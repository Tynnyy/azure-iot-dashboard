import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sensorId: string }> }
) {
  try {
    const { sensorId } = await params;
    const supabase = await createClient();

    const { data: sensor, error } = await supabase
      .from('sensors')
      .select(`
        *,
        location:locations(*)
      `)
      .eq('sensor_id', sensorId)
      .single();

    if (error || !sensor) {
      return NextResponse.json(
        { error: 'Sensor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: sensor }, { status: 200 });

  } catch (error) {
    console.error('Error fetching sensor:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
