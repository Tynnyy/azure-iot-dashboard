-- Add CASCADE delete for sensor_data foreign key
-- This ensures that when a sensor is deleted, all associated sensor_data records are automatically deleted

ALTER TABLE sensor_data
DROP CONSTRAINT IF EXISTS sensor_data_sensor_id_fkey,
ADD CONSTRAINT sensor_data_sensor_id_fkey
  FOREIGN KEY (sensor_id)
  REFERENCES sensors(sensor_id)
  ON DELETE CASCADE;
