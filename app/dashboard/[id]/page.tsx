import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChartComponent } from '@/components/charts/line-chart';
import { formatTimestamp, formatSensorValue, getStatusColor } from '@/lib/utils';
import { LocalTimestamp } from '@/components/ui/local-timestamp';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SensorActions } from '@/components/dashboard/sensor-actions';

async function getSensorDetails(sensorId: string) {
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
    return null;
  }

  // Get last 24 hours of data
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const { data: readings } = await supabase
    .from('sensor_data')
    .select('*')
    .eq('sensor_id', sensorId)
    .gte('data_timestamp', twentyFourHoursAgo.toISOString())
    .order('data_timestamp', { ascending: true });

  // Compute dynamic status based on latest reading
  const latestReading = readings && readings.length > 0 ? readings[readings.length - 1] : null;
  const computed_status: 'active' | 'inactive' =
    latestReading && new Date(latestReading.data_timestamp) > twentyFourHoursAgo
      ? 'active'
      : 'inactive';

  return {
    sensor: {
      ...sensor,
      computed_status,
    },
    readings: readings || [],
    currentTime: new Date().toISOString(),
  };
}

export default async function SensorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getSensorDetails(id);

  if (!data) {
    notFound();
  }

  const { sensor, readings, currentTime } = data;

  const latestReading = readings[readings.length - 1];
  const avgValue = readings.length > 0
    ? readings.reduce((sum, r) => sum + r.data_value, 0) / readings.length
    : 0;
  const minValue = readings.length > 0
    ? Math.min(...readings.map(r => r.data_value))
    : 0;
  const maxValue = readings.length > 0
    ? Math.max(...readings.map(r => r.data_value))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-2">
            ← Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{sensor.sensor_name}</h1>
            <p className="text-gray-600 mt-1">{sensor.sensor_type}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sensor.computed_status || sensor.sensor_status)}`}>
              {sensor.computed_status || sensor.sensor_status}
            </span>
            <SensorActions sensor={sensor} />
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Last Value</p>
            <p className="text-3xl font-bold text-blue-600">
              {latestReading ? formatSensorValue(latestReading.data_value, sensor.sensor_type) : 'N/A'}
            </p>
            <LocalTimestamp
              timestamp={latestReading ? latestReading.data_timestamp : currentTime}
              className="text-xs text-gray-400 mt-2 block"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Average (24h)</p>
            <p className="text-3xl font-bold">
              {formatSensorValue(avgValue, sensor.sensor_type)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Min (24h)</p>
            <p className="text-3xl font-bold text-blue-500">
              {formatSensorValue(minValue, sensor.sensor_type)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Max (24h)</p>
            <p className="text-3xl font-bold text-red-500">
              {formatSensorValue(maxValue, sensor.sensor_type)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>24 Hour History</CardTitle>
        </CardHeader>
        <CardContent>
          {readings.length > 0 ? (
            <LineChartComponent data={readings} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              No data available for the last 24 hours
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sensor Details */}
      <Card>
        <CardHeader>
          <CardTitle>Sensor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Sensor ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{sensor.sensor_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{sensor.sensor_type}</dd>
            </div>
            {sensor.location && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">{sensor.location.location_name}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sensor.computed_status || sensor.sensor_status)}`}>
                  {sensor.computed_status || sensor.sensor_status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatTimestamp(sensor.created_at)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Readings (24h)</dt>
              <dd className="mt-1 text-sm text-gray-900">{readings.length}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
