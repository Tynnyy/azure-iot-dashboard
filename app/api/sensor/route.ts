import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { registerSensorSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = registerSensorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { sensorName, sensorType, locationName } = validation.data;
    const supabase = await createClient();

    // Find or create location
    let { data: location, error: locationError } = await supabase
      .from('locations')
      .select('location_id')
      .eq('location_name', locationName)
      .single();

    if (locationError && locationError.code !== 'PGRST116') {
      throw locationError;
    }

    if (!location) {
      const { data: newLocation, error: createLocationError } = await supabase
        .from('locations')
        .insert({ location_name: locationName })
        .select('location_id')
        .single();

      if (createLocationError) throw createLocationError;
      location = newLocation;
    }

    // Create sensor
    const { data: sensor, error: sensorError } = await supabase
      .from('sensors')
      .insert({
        sensor_name: sensorName,
        sensor_type: sensorType,
        sensor_location_id: location.location_id,
        sensor_status: 'active',
      })
      .select('sensor_id')
      .single();

    if (sensorError) {
      if (sensorError.code === '23505') {
        return NextResponse.json(
          { error: 'Sensor name already exists' },
          { status: 409 }
        );
      }
      throw sensorError;
    }

    return NextResponse.json({
      sensorID: sensor.sensor_id,
      status: 'registered',
    }, { status: 201 });

  } catch (error) {
    console.error('Error registering sensor:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
