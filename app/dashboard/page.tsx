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

  // Get latest reading for each sensor
  const sensorsWithReadings = await Promise.all(
    sensors.map(async (sensor) => {
      const { data: latestReading } = await supabase
        .from('sensor_data')
        .select('data_value, data_timestamp')
        .eq('sensor_id', sensor.sensor_id)
        .order('data_timestamp', { ascending: false })
        .limit(1)
        .single();

      return {
        ...sensor,
        latest_reading: latestReading || undefined,
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

  const { count: activeSensors } = await supabase
    .from('sensors')
    .select('*', { count: 'exact', head: true })
    .eq('sensor_status', 'active');

  const { count: totalLocations } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true });

  // Get total readings in last 24 hours
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  const { count: recentReadings } = await supabase
    .from('sensor_data')
    .select('*', { count: 'exact', head: true })
    .gte('data_timestamp', twentyFourHoursAgo.toISOString());

  return {
    totalSensors: totalSensors || 0,
    activeSensors: activeSensors || 0,
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
