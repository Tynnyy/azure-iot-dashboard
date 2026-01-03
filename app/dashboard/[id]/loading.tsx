import { Spinner } from '@/components/ui/spinner';

export default function SensorLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading sensor data...</p>
      </div>
    </div>
  );
}
