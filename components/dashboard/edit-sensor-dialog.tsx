'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Sensor } from '@/lib/types';

interface EditSensorDialogProps {
  sensor: Sensor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSensorDialog({
  sensor,
  open,
  onOpenChange,
}: EditSensorDialogProps) {
  const router = useRouter();
  const [sensorName, setSensorName] = useState(sensor.sensor_name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/sensors/${sensor.sensor_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sensorName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update sensor');
      }

      // Success - close dialog and refresh
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Sensor</DialogTitle>
          <DialogDescription>
            Update the name of your sensor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="sensorName" className="block text-sm font-medium text-gray-700 mb-1">
                Sensor Name
              </label>
              <Input
                id="sensorName"
                type="text"
                value={sensorName}
                onChange={(e) => setSensorName(e.target.value)}
                placeholder="Enter sensor name"
                required
                minLength={3}
                maxLength={255}
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
