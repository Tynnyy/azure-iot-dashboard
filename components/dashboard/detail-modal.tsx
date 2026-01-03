'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type DetailType = 'sensors' | 'active-sensors' | 'locations' | 'readings' | null;

interface DetailModalProps {
  type: DetailType;
  onClose: () => void;
}

interface Sensor {
  sensor_id: string;
  sensor_name: string;
  sensor_type: string;
  sensor_status: string;
  created_at: string;
  location?: {
    location_name: string;
  };
}

interface Location {
  location_id: string;
  location_name: string;
  created_at: string;
}

interface Reading {
  id: string;
  sensor_id: string;
  data_value: number;
  data_type: string;
  data_timestamp: string;
  sensor?: {
    sensor_name: string;
  };
}

export function DetailModal({ type, onClose }: DetailModalProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        let url = '';
        switch (type) {
          case 'sensors':
          case 'active-sensors':
            url = '/api/sensors';
            break;
          case 'locations':
            url = '/api/locations';
            break;
          case 'readings':
            url = '/api/sensors'; // We'll need to aggregate readings
            break;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (type === 'active-sensors') {
          setData(result.sensors?.filter((s: Sensor) => s.sensor_status === 'active') || []);
        } else if (type === 'readings') {
          // Fetch recent readings from all sensors
          const sensorsData = result.sensors || [];
          const allReadings: Reading[] = [];

          for (const sensor of sensorsData.slice(0, 10)) {
            const readingResponse = await fetch(`/api/sensors/${sensor.sensor_id}/data`);
            const readingData = await readingResponse.json();
            if (readingData.data) {
              readingData.data.forEach((reading: Reading) => {
                allReadings.push({
                  ...reading,
                  sensor: { sensor_name: sensor.sensor_name }
                });
              });
            }
          }

          // Sort by timestamp and take most recent
          allReadings.sort((a, b) =>
            new Date(b.data_timestamp).getTime() - new Date(a.data_timestamp).getTime()
          );
          setData(allReadings.slice(0, 50));
        } else {
          setData(result.sensors || result.locations || []);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  if (!type) return null;

  const getTitle = () => {
    switch (type) {
      case 'sensors':
        return 'All Sensors';
      case 'active-sensors':
        return 'Active Sensors';
      case 'locations':
        return 'All Locations';
      case 'readings':
        return 'Recent Readings (24h)';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : data.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No data available</p>
          ) : (
            <div className="space-y-3">
              {(type === 'sensors' || type === 'active-sensors') && (
                data.map((sensor: Sensor) => (
                  <div
                    key={sensor.sensor_id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{sensor.sensor_name}</h3>
                        <p className="text-gray-600 text-sm mt-1">Type: {sensor.sensor_type}</p>
                        <p className="text-gray-600 text-sm">
                          Location: {sensor.location?.location_name || 'Unknown'}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          sensor.sensor_status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {sensor.sensor_status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Created: {format(new Date(sensor.created_at), 'PPpp')}
                    </p>
                  </div>
                ))
              )}

              {type === 'locations' && (
                data.map((location: Location) => (
                  <div
                    key={location.location_id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-lg">📍 {location.location_name}</h3>
                    <p className="text-xs text-gray-400 mt-2">
                      Created: {format(new Date(location.created_at), 'PPpp')}
                    </p>
                  </div>
                ))
              )}

              {type === 'readings' && (
                data.map((reading: Reading) => (
                  <div
                    key={reading.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{reading.sensor?.sensor_name}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Value: <span className="font-mono font-bold">{reading.data_value}</span>
                        </p>
                        <p className="text-gray-600 text-sm">Type: {reading.data_type}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {format(new Date(reading.data_timestamp), 'PPpp')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-between items-center border-t">
          <p className="text-sm text-gray-600">
            Showing {data.length} {data.length === 1 ? 'item' : 'items'}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
