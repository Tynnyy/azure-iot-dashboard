import { createClient } from '@/lib/supabase/server';
import { SensorGrid } from '@/components/dashboard/sensor-grid';
import { InteractiveStats } from '@/components/dashboard/interactive-stats';
import type { SensorWithLatestReading } from '@/lib/types';

async function getSensorsWithLatestReadings(): Promise<SensorWithLatestReading[]> {
  const supabase = await createClient();

  const { data: sensors, error } = await supabase
    .from('sensors')
    .select(`
      *,
      location:locations(*)
    `)
    .order('created_at', { ascending: false });

  if (error || !sensors) {
    return [];
  }

  // Get latest reading for each sensor and compute dynamic status
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Batch query for all recent data (for sparklines)
  const { data: allRecentData } = await supabase
    .from('sensor_data')
    .select('sensor_id, data_value, data_timestamp')
    .gte('data_timestamp', twentyFourHoursAgo.toISOString())
    .order('data_timestamp', { ascending: true });

  // Group data by sensor_id
  const dataBySensor = new Map<string, Array<{ data_value: number; data_timestamp: string }>>();
  allRecentData?.forEach((reading) => {
    if (!dataBySensor.has(reading.sensor_id)) {
      dataBySensor.set(reading.sensor_id, []);
    }
    dataBySensor.get(reading.sensor_id)!.push({
      data_value: reading.data_value,
      data_timestamp: reading.data_timestamp,
    });
  });

  const sensorsWithReadings = await Promise.all(
    sensors.map(async (sensor) => {
      const { data: latestReading } = await supabase
        .from('sensor_data')
        .select('data_value, data_timestamp')
        .eq('sensor_id', sensor.sensor_id)
        .order('data_timestamp', { ascending: false })
        .limit(1)
        .single();

      // Compute dynamic status based on latest reading timestamp
      const computed_status: 'active' | 'inactive' =
        latestReading && new Date(latestReading.data_timestamp) > twentyFourHoursAgo
          ? 'active'
          : 'inactive';

      // Get recent readings for this sensor (limit to last 20 points for performance)
      const recentReadings = dataBySensor.get(sensor.sensor_id) || [];
      const limitedRecentReadings = recentReadings.slice(-20);

      return {
        ...sensor,
        latest_reading: latestReading || undefined,
        recent_readings: limitedRecentReadings,
        computed_status,
      };
    })
  );

  return sensorsWithReadings;
}

async function getDashboardStats() {
  const supabase = await createClient();

  const { count: totalSensors } = await supabase
    .from('sensors')
    .select('*', { count: 'exact', head: true });

  // Get total readings in last 24 hours
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  // Count active sensors (sensors with data in last 24 hours)
  const { data: sensorsWithRecentData } = await supabase
    .from('sensor_data')
    .select('sensor_id')
    .gte('data_timestamp', twentyFourHoursAgo.toISOString());

  // Get unique sensor IDs that have recent data
  const activeSensorIds = new Set(
    sensorsWithRecentData?.map((d) => d.sensor_id) || []
  );
  const activeSensors = activeSensorIds.size;

  const { count: totalLocations } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true });

  const { count: recentReadings } = await supabase
    .from('sensor_data')
    .select('*', { count: 'exact', head: true })
    .gte('data_timestamp', twentyFourHoursAgo.toISOString());

  return {
    totalSensors: totalSensors || 0,
    activeSensors,
    totalLocations: totalLocations || 0,
    recentReadings: recentReadings || 0,
  };
}

export default async function DashboardPage() {
  const [sensors, stats] = await Promise.all([
    getSensorsWithLatestReadings(),
    getDashboardStats(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor all your IoT sensors in real-time</p>
      </div>

      {/* Stats Cards */}
      <InteractiveStats stats={stats} />

      {/* Sensors Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Sensors</h2>
        <SensorGrid sensors={sensors} />
      </div>
    </div>
  );
}
