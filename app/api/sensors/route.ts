import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: sensors, error } = await supabase
      .from('sensors')
      .select(`
        *,
        location:locations(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Compute active status based on recent data (last 24 hours)
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get all sensor data from last 24 hours
    const { data: recentData } = await supabase
      .from('sensor_data')
      .select('sensor_id, data_timestamp')
      .gte('data_timestamp', twentyFourHoursAgo.toISOString());

    // Create a set of sensor IDs that have recent data
    const activeSensorIds = new Set(
      recentData?.map((d) => d.sensor_id) || []
    );

    // Add computed_status to each sensor
    const sensorsWithComputedStatus = sensors?.map((sensor) => ({
      ...sensor,
      computed_status: activeSensorIds.has(sensor.sensor_id) ? 'active' : 'inactive',
    })) || [];

    return NextResponse.json({ data: sensorsWithComputedStatus }, { status: 200 });

  } catch (error) {
    console.error('Error fetching sensors:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
