import { Resend } from 'resend';
import type { Sensor } from './types';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email alert when a sensor becomes inactive
 * @param sensor The inactive sensor
 * @param recipientEmail Email address to send the alert to
 */
export async function sendInactiveSensorAlert(
  sensor: Sensor,
  recipientEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const sensorUrl = `${appUrl}/dashboard/${sensor.sensor_id}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #ef4444;
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 20px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .sensor-info {
              background-color: white;
              padding: 15px;
              border-radius: 8px;
              margin: 15px 0;
              border-left: 4px solid #ef4444;
            }
            .info-row {
              margin: 8px 0;
            }
            .label {
              font-weight: bold;
              color: #6b7280;
            }
            .value {
              color: #111827;
            }
            .button {
              display: inline-block;
              background-color: #3b82f6;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 15px;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">⚠️ Sensor Inactive Alert</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>The following sensor has been inactive for more than 24 hours and has not reported any data:</p>

              <div class="sensor-info">
                <div class="info-row">
                  <span class="label">Sensor Name:</span>
                  <span class="value">${sensor.sensor_name}</span>
                </div>
                <div class="info-row">
                  <span class="label">Type:</span>
                  <span class="value">${sensor.sensor_type}</span>
                </div>
                <div class="info-row">
                  <span class="label">Location:</span>
                  <span class="value">${sensor.location?.location_name || 'Unknown'}</span>
                </div>
                <div class="info-row">
                  <span class="label">Status:</span>
                  <span class="value" style="color: #ef4444; font-weight: bold;">INACTIVE</span>
                </div>
              </div>

              <p>Please check the sensor to ensure it is functioning correctly.</p>

              <a href="${sensorUrl}" class="button">View Sensor Details</a>

              <div class="footer">
                <p>You are receiving this email because you are subscribed to sensor alerts.</p>
                <p>Azure IoT Dashboard - Automated Alert System</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.ALERT_EMAIL_FROM || 'Azure IoT Dashboard <alerts@yourdomain.com>',
      to: recipientEmail,
      subject: `⚠️ Sensor Alert: ${sensor.sensor_name} is Inactive`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data);
    return { success: true };
  } catch (error) {
    console.error('Error in sendInactiveSensorAlert:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
