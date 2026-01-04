-- Create alert_history table to track email notifications sent
-- This prevents duplicate alerts and provides audit trail

CREATE TABLE IF NOT EXISTS alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id UUID NOT NULL REFERENCES sensors(sensor_id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL,
  alert_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recipient_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_alert_history_sensor_id ON alert_history(sensor_id);
CREATE INDEX idx_alert_history_sent_at ON alert_history(alert_sent_at);
CREATE INDEX idx_alert_history_sensor_type ON alert_history(sensor_id, alert_type);

-- Add comment for documentation
COMMENT ON TABLE alert_history IS 'Tracks email alerts sent to users for inactive sensors';
COMMENT ON COLUMN alert_history.alert_type IS 'Type of alert sent (e.g., inactive_sensor)';
COMMENT ON COLUMN alert_history.alert_sent_at IS 'Timestamp when the alert email was sent';
