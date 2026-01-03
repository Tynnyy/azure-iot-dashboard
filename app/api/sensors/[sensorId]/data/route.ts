import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { submitDataSchema } from '@/lib/validations';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sensorId: string }> }
) {
  try {
    const { sensorId } = await params;
    const body = await request.json();

    // Validate request
    const validation = submitDataSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { value } = validation.data;
    const supabase = await createClient();

    // Verify sensor exists
    const { data: sensor, error: sensorError } = await supabase
      .from('sensors')
      .select('sensor_id, sensor_type')
      .eq('sensor_id', sensorId)
      .single();

    if (sensorError || !sensor) {
      return NextResponse.json(
        { error: 'Sensor not found' },
        { status: 404 }
      );
    }

    // Insert sensor data
    const { error: insertError } = await supabase
      .from('sensor_data')
      .insert({
        sensor_id: sensorId,
        data_value: value,
        data_type: sensor.sensor_type,
      });

    if (insertError) throw insertError;

    return NextResponse.json({
      status: 'ok',
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting sensor data:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sensorId: string }> }
) {
  try {
    const { sensorId } = await params;
    const supabase = await createClient();

    // Get last 24 hours of data
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { data, error } = await supabase
      .from('sensor_data')
      .select('*')
      .eq('sensor_id', sensorId)
      .gte('data_timestamp', twentyFourHoursAgo.toISOString())
      .order('data_timestamp', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
