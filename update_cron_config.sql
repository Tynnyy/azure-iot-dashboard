-- Update Supabase cron_config table with correct values
-- Run this in your Supabase SQL Editor

UPDATE cron_config
SET value = 'https://azure-iot-dashboard.vercel.app', updated_at = NOW()
WHERE key = 'api_url';

UPDATE cron_config
SET value = 'rses37ItWQ03vD+SNZba/gGnxVNHZ+vYUIc9Des/Yrc=', updated_at = NOW()
WHERE key = 'cron_secret';

-- Verify the updates
SELECT * FROM cron_config;
