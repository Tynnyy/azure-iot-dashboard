import { SensorCard } from './sensor-card';
import type { SensorWithLatestReading } from '@/lib/types';

interface SensorGridProps {
  sensors: SensorWithLatestReading[];
}

export function SensorGrid({ sensors }: SensorGridProps) {
  if (sensors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No sensors found</p>
        <p className="text-gray-400 mt-2">Register your first sensor to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sensors.map((sensor) => (
        <SensorCard key={sensor.sensor_id} sensor={sensor} />
      ))}
    </div>
  );
}
