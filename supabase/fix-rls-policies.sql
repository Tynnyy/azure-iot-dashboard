-- Fix Row Level Security Policies for IoT Dashboard
-- This allows all authenticated users to access all data (demo application)

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON locations;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON sensors;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON sensor_data;

-- Locations table policies
CREATE POLICY "Allow all operations for authenticated users"
ON locations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Sensors table policies
CREATE POLICY "Allow all operations for authenticated users"
ON sensors
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Sensor data table policies
CREATE POLICY "Allow all operations for authenticated users"
ON sensor_data
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Also allow anonymous access for API endpoints (for Python simulator)
CREATE POLICY "Allow anonymous read access"
ON locations
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anonymous insert access"
ON locations
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous read access"
ON sensors
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anonymous insert access"
ON sensors
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous all access"
ON sensor_data
FOR ALL
TO anon
USING (true)
WITH CHECK (true);
