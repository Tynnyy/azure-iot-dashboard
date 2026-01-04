import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateSensorSchema } from '@/lib/validations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sensorId: string }> }
) {
  try {
    const { sensorId } = await params;
    const supabase = await createClient();
    const body = await request.json();

    // Validate request body
    const validation = updateSensorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: validation.error.issues },
        { status: 400 }
      );
    }

    const { sensorName } = validation.data;

    // Update sensor name
    const { data: updatedSensor, error } = await supabase
      .from('sensors')
      .update({
        sensor_name: sensorName,
        updated_at: new Date().toISOString(),
      })
      .eq('sensor_id', sensorId)
      .select(`
        *,
        location:locations(*)
      `)
      .single();

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A sensor with this name already exists' },
          { status: 409 }
        );
      }

      console.error('Error updating sensor:', error);
      return NextResponse.json(
        { error: 'Failed to update sensor', message: error.message },
        { status: 500 }
      );
    }

    if (!updatedSensor) {
      return NextResponse.json(
        { error: 'Sensor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updatedSensor }, { status: 200 });

  } catch (error) {
    console.error('Error updating sensor:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sensorId: string }> }
) {
  try {
    const { sensorId } = await params;
    const supabase = await createClient();

    // Verify sensor exists
    const { data: sensor, error: fetchError } = await supabase
      .from('sensors')
      .select('sensor_id')
      .eq('sensor_id', sensorId)
      .single();

    if (fetchError || !sensor) {
      return NextResponse.json(
        { error: 'Sensor not found' },
        { status: 404 }
      );
    }

    // Delete sensor (CASCADE will handle sensor_data deletion)
    const { error: deleteError } = await supabase
      .from('sensors')
      .delete()
      .eq('sensor_id', sensorId);

    if (deleteError) {
      console.error('Error deleting sensor:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete sensor', message: deleteError.message },
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Error deleting sensor:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
