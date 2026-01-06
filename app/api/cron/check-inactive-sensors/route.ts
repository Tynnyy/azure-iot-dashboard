import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendInactiveSensorAlert } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Cron endpoint to check for inactive sensors and send email alerts
 * Runs every 10 minutes via Vercel Cron
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use admin client for database operations (bypasses RLS)
    const supabaseAdmin = createAdminClient();

    // Regular client for auth operations
    const supabase = await createClient();

    // Calculate 24 hours ago
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get all sensors using admin client
    const { data: allSensors, error: sensorsError } = await supabaseAdmin
      .from('sensors')
      .select(`
        *,
        location:locations(*)
      `);

    if (sensorsError) {
      console.error('Error fetching sensors:', sensorsError);
      return NextResponse.json(
        { error: 'Failed to fetch sensors', message: sensorsError.message },
        { status: 500 }
      );
    }

    if (!allSensors || allSensors.length === 0) {
      return NextResponse.json({
        message: 'No sensors to check',
        sensorsChecked: 0,
        alertsSent: 0,
      });
    }

    // Get all sensor data from last 24 hours using admin client
    const { data: recentData } = await supabaseAdmin
      .from('sensor_data')
      .select('sensor_id, data_timestamp')
      .gte('data_timestamp', twentyFourHoursAgo.toISOString());

    // Create a set of sensor IDs that have recent data (are active)
    const activeSensorIds = new Set(
      recentData?.map((d) => d.sensor_id) || []
    );

    // Find inactive sensors (no data in last 24 hours)
    const inactiveSensors = allSensors.filter(
      (sensor) => !activeSensorIds.has(sensor.sensor_id)
    );

    console.log(`Found ${inactiveSensors.length} inactive sensors out of ${allSensors.length} total sensors`);

    // Update sensor_status in database for inactive sensors using admin client
    if (inactiveSensors.length > 0) {
      const inactiveSensorIds = inactiveSensors.map(s => s.sensor_id);
      const { error: updateError } = await supabaseAdmin
        .from('sensors')
        .update({ sensor_status: 'inactive' })
        .in('sensor_id', inactiveSensorIds);

      if (updateError) {
        console.error('Error updating inactive sensors:', updateError);
      } else {
        console.log(`Updated ${inactiveSensors.length} sensors to 'inactive' status`);
      }
    }

    // Update sensor_status in database for active sensors using admin client
    if (activeSensorIds.size > 0) {
      const activeSensorIdsArray = Array.from(activeSensorIds);
      const { error: updateError } = await supabaseAdmin
        .from('sensors')
        .update({ sensor_status: 'active' })
        .in('sensor_id', activeSensorIdsArray);

      if (updateError) {
        console.error('Error updating active sensors:', updateError);
      } else {
        console.log(`Updated ${activeSensorIds.size} sensors to 'active' status`);
      }
    }

    // For each inactive sensor, check if we've already sent an alert in the last 24 hours
    let alertsSent = 0;
    const errors: string[] = [];

    for (const sensor of inactiveSensors) {
      // Check if an alert was already sent in the last 24 hours using admin client
      const { data: recentAlerts } = await supabaseAdmin
        .from('alert_history')
        .select('*')
        .eq('sensor_id', sensor.sensor_id)
        .eq('alert_type', 'inactive_sensor')
        .gte('alert_sent_at', twentyFourHoursAgo.toISOString())
        .limit(1);

      // If an alert was already sent in the last 24 hours, skip this sensor
      if (recentAlerts && recentAlerts.length > 0) {
        console.log(`Alert already sent for sensor ${sensor.sensor_name} in the last 24 hours, skipping`);
        continue;
      }

      // Get all users to notify (from Supabase Auth)
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

      if (usersError || !users || users.users.length === 0) {
        console.error('No users found or error fetching users:', usersError);
        continue;
      }

      // Send email to each user
      for (const user of users.users) {
        if (!user.email) continue;

        const result = await sendInactiveSensorAlert(sensor, user.email);

        if (result.success) {
          // Log the alert in alert_history using admin client
          await supabaseAdmin.from('alert_history').insert({
            sensor_id: sensor.sensor_id,
            alert_type: 'inactive_sensor',
            recipient_email: user.email,
          });

          alertsSent++;
          console.log(`Alert sent to ${user.email} for sensor ${sensor.sensor_name}`);
        } else {
          errors.push(`Failed to send alert to ${user.email}: ${result.error}`);
          console.error(`Failed to send alert to ${user.email}:`, result.error);
        }
      }
    }

    return NextResponse.json({
      message: 'Inactive sensor check completed',
      sensorsChecked: allSensors.length,
      inactiveSensors: inactiveSensors.length,
      alertsSent,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in check-inactive-sensors cron:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
