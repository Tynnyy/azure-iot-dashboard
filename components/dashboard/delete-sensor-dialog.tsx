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
import type { Sensor } from '@/lib/types';

interface DeleteSensorDialogProps {
  sensor: Sensor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSensorDialog({
  sensor,
  open,
  onOpenChange,
}: DeleteSensorDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/sensors/${sensor.sensor_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete sensor');
      }

      // Success - close dialog and redirect to dashboard
      onOpenChange(false);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Sensor</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this sensor?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> This action cannot be undone. This will permanently delete:
            </p>
            <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 ml-2">
              <li>Sensor: <strong>{sensor.sensor_name}</strong></li>
              <li>All historical data associated with this sensor</li>
            </ul>
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
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Sensor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
