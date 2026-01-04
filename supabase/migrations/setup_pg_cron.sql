-- Enable pg_cron extension for scheduled tasks
-- pg_cron allows running scheduled jobs directly in PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for making HTTP requests
-- pg_net allows making HTTP requests from PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant permissions to use pg_net
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;

-- Create a configuration table to store API settings
-- This avoids permission issues with ALTER DATABASE
CREATE TABLE IF NOT EXISTS cron_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configuration (you'll update these after Vercel deployment)
INSERT INTO cron_config (key, value) VALUES
  ('api_url', 'https://your-project.vercel.app'),
  ('cron_secret', 'your_cron_secret_here')
ON CONFLICT (key) DO NOTHING;

-- Add comment
COMMENT ON TABLE cron_config IS 'Configuration settings for cron jobs';

-- Create a function to check inactive sensors and send alerts
-- This function will make an HTTP request to our Next.js API endpoint
CREATE OR REPLACE FUNCTION check_inactive_sensors_cron()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  api_url TEXT;
  cron_secret TEXT;
BEGIN
  -- Get the API URL and secret from config table
  SELECT value INTO api_url FROM cron_config WHERE key = 'api_url';
  SELECT value INTO cron_secret FROM cron_config WHERE key = 'cron_secret';

  -- If settings are not configured, skip execution
  IF api_url IS NULL OR api_url = '' OR api_url = 'https://your-project.vercel.app' THEN
    RAISE NOTICE 'API URL not configured. Skipping inactive sensor check.';
    RETURN;
  END IF;

  -- Make HTTP GET request to the Next.js API endpoint
  PERFORM net.http_get(
    url := api_url || '/api/cron/check-inactive-sensors',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(cron_secret, '')
    )
  );

  RAISE NOTICE 'Inactive sensor check triggered at %', NOW();
END;
$$;

-- Schedule the cron job to run every 10 minutes
-- Cron expression: */10 * * * * means "every 10 minutes"
SELECT cron.schedule(
  'check-inactive-sensors',           -- job name
  '*/10 * * * *',                     -- cron expression (every 10 minutes)
  $$SELECT check_inactive_sensors_cron();$$  -- SQL to execute
);

-- Add comments for documentation
COMMENT ON FUNCTION check_inactive_sensors_cron() IS 'Cron job function that checks for inactive sensors and sends email alerts via Next.js API';
