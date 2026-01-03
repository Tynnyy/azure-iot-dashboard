'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RegisterSensorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    sensorName: '',
    sensorType: 'Temperature',
    locationName: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    sensorID?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/sensor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: 'Sensor registered successfully!',
          sensorID: data.sensorID,
        });
        // Reset form
        setFormData({
          sensorName: '',
          sensorType: 'Temperature',
          locationName: '',
        });
      } else {
        // Show specific error messages
        let errorMessage = data.error || 'Failed to register sensor';

        if (response.status === 409) {
          errorMessage = 'A sensor with this name already exists. Please use a different name.';
        } else if (response.status === 401 || response.status === 403) {
          errorMessage = 'You must be logged in to register sensors.';
        } else if (response.status === 400) {
          errorMessage = 'Invalid input. Please check your form data.';
        } else if (response.status === 500) {
          errorMessage = `Server error: ${data.message || 'Please try again later.'}`;
        }

        setResult({
          success: false,
          message: errorMessage,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateUniqueName = () => {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const suggestedName = `${formData.sensorType}_Sensor_${timestamp}`;
    setFormData({
      ...formData,
      sensorName: suggestedName,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Register New Sensor</h1>
          <p className="text-gray-600 mt-2">
            Add a new IoT sensor to your dashboard for simulation
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sensor Name */}
              <div>
                <label
                  htmlFor="sensorName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sensor Name <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="sensorName"
                    name="sensorName"
                    value={formData.sensorName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Living_Room_Temp_01"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button
                    type="button"
                    onClick={generateUniqueName}
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    🎲 Generate
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use a unique name or click &quot;Generate&quot; for auto-generated name
                </p>
              </div>

              {/* Sensor Type */}
              <div>
                <label
                  htmlFor="sensorType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sensor Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="sensorType"
                  name="sensorType"
                  value={formData.sensorType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Temperature">Temperature Sensor</option>
                  <option value="Humidity">Humidity Sensor</option>
                  <option value="Pressure">Pressure Sensor</option>
                  <option value="Light">Light Sensor</option>
                  <option value="Motion">Motion Sensor</option>
                  <option value="Air Quality">Air Quality Sensor</option>
                  <option value="CO2">CO2 Sensor</option>
                  <option value="Voltage">Voltage Sensor</option>
                </select>
              </div>

              {/* Location Name */}
              <div>
                <label
                  htmlFor="locationName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Location Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="locationName"
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Living Room, Office, Warehouse A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Where is this sensor located?
                </p>
              </div>

              {/* Result Message */}
              {result && (
                <div
                  className={`p-4 rounded-lg ${
                    result.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p
                    className={`font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {result.message}
                  </p>
                  {result.sensorID && (
                    <p className="text-sm text-green-700 mt-2">
                      Sensor ID: <span className="font-mono">{result.sensorID}</span>
                    </p>
                  )}
                  {result.success && (
                    <Button
                      type="button"
                      onClick={() => router.push('/dashboard')}
                      className="mt-3"
                      size="sm"
                    >
                      View in Dashboard
                    </Button>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Registering...
                    </>
                  ) : (
                    <>📡 Register Sensor</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Simulation Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use unique sensor names to avoid conflicts</li>
              <li>• Choose appropriate sensor types for your simulation</li>
              <li>• Group sensors by location for better organization</li>
              <li>
                • After registration, use the Python simulator to send data:
                <code className="block bg-white px-2 py-1 rounded mt-1 text-xs">
                  python simulator/iot_simulator.py --url https://azure-iot-dashboard.vercel.app
                  --name YourSensorName
                </code>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
