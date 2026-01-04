'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatTimestamp, formatSensorValue, getStatusColor } from '@/lib/utils';
import { Sparkline } from '@/components/charts/sparkline';
import type { SensorWithLatestReading } from '@/lib/types';

interface SensorCardProps {
  sensor: SensorWithLatestReading;
}

export function SensorCard({ sensor }: SensorCardProps) {
  return (
    <Link href={`/dashboard/${sensor.sensor_id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{sensor.sensor_name}</CardTitle>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sensor.computed_status || sensor.sensor_status)}`}>
              {sensor.computed_status || sensor.sensor_status}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{sensor.sensor_type}</p>
            </div>

            {sensor.location && (
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{sensor.location.location_name}</p>
              </div>
            )}

            {sensor.latest_reading && (
              <div>
                <p className="text-sm text-gray-500">Latest Reading</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatSensorValue(sensor.latest_reading.data_value, sensor.sensor_type)}
                </p>
                <p className="text-xs text-gray-400">
                  {formatTimestamp(sensor.latest_reading.data_timestamp)}
                </p>
              </div>
            )}

            {sensor.recent_readings && sensor.recent_readings.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-1">24h Trend</p>
                <Sparkline data={sensor.recent_readings} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
