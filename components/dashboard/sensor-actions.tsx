'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditSensorDialog } from './edit-sensor-dialog';
import { DeleteSensorDialog } from './delete-sensor-dialog';
import type { Sensor } from '@/lib/types';

interface SensorActionsProps {
  sensor: Sensor;
}

export function SensorActions({ sensor }: SensorActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditDialogOpen(true)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
        </Button>
      </div>

      <EditSensorDialog
        sensor={sensor}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeleteSensorDialog
        sensor={sensor}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
