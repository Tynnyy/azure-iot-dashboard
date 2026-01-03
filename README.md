# Azure IoT Dashboard

Real-time IoT sensor data monitoring and visualization platform built with Next.js 14, TypeScript, and Supabase.

## Features

- 📊 Real-time sensor data visualization with interactive charts
- 🔌 Multiple sensor types support (Temperature, Humidity, Pressure, Light)
- 📍 Location-based sensor organization
- 📈 24-hour historical data tracking
- 🔐 User authentication with Supabase Auth
- 🚀 RESTful API for easy data ingestion
- 🐍 Python simulator for testing
- 📱 Responsive design with Tailwind CSS

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Charts:** Recharts
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for simulator)
- Supabase account (free tier works)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up Supabase:**

   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Name it `azure-iot-dashboard`
   - Save your database password
   - Wait for the project to provision

3. **Get Supabase credentials:**

   - Go to Settings > API
   - Copy the Project URL
   - Copy the `anon public` key

4. **Configure environment variables:**

   Edit `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Set up the database:**

   - Go to Supabase SQL Editor
   - Run the SQL migration from the plan file to create tables

   The migration creates:
   - `locations` table
   - `sensors` table
   - `sensor_data` table
   - Indexes for performance
   - Row Level Security (RLS) policies
   - Sample location data

6. **Run the development server:**

```bash
npm run dev
```

7. **Open [http://localhost:3000](http://localhost:3000)**

## Using the Python Simulator

The simulator sends realistic sensor data to your API for testing.


```powershell
python simulator/iot_simulator.py --url https://azure-iot-dashboard.vercel.app --type "Light" --location "Office"
```

### Install Dependencies

```bash
cd simulator
pip install -r requirements.txt
```

### Run the Simulator

```bash
# Default temperature sensor
python iot_simulator.py

# Custom sensor with options
python iot_simulator.py --name "Kitchen_Temp" --type "Temperature" --location "Kitchen" --interval 5

# Run multiple sensors in different terminals
python iot_simulator.py --name "Office_Humidity" --type "Humidity" --location "Office"
```

See `simulator/README.md` for full documentation.

## API Documentation

### Register a Sensor

```bash
POST /api/sensor
Content-Type: application/json

{
  "sensorName": "Kitchen_Temperature",
  "sensorType": "Temperature",
  "locationName": "Kitchen"
}
```

### Submit Sensor Data

```bash
POST /api/sensors/{sensorID}/data
Content-Type: application/json

{
  "value": 23.5
}
```

### Get All Sensors

```bash
GET /api/sensors
```

### Get Sensor Details

```bash
GET /api/sensors/{sensorID}
```

### Get Sensor Data (Last 24 Hours)

```bash
GET /api/sensors/{sensorID}/data
```

### Get All Locations

```bash
GET /api/locations
```

## Project Structure

```
my-app/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── api/                 # API routes
│   ├── dashboard/           # Dashboard pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── auth/                # Auth forms
│   ├── charts/              # Chart components
│   ├── dashboard/           # Dashboard components
│   └── header.tsx           # Header component
├── lib/                     # Utilities and config
│   ├── supabase/            # Supabase clients
│   ├── types.ts             # TypeScript types
│   ├── utils.ts             # Utility functions
│   └── validations.ts       # Zod schemas
├── simulator/               # Python simulator
│   ├── iot_simulator.py     # Main simulator script
│   ├── requirements.txt     # Python dependencies
│   └── README.md            # Simulator docs
├── middleware.ts            # Auth middleware
├── CLAUDE.md                # Project specifications
└── README.md                # This file
```

## Database Schema

### Tables

- **locations**: Location management
  - `location_id` (UUID, PK)
  - `location_name` (VARCHAR, UNIQUE)
  - `created_at`, `updated_at` (TIMESTAMP)

- **sensors**: Sensor registry
  - `sensor_id` (UUID, PK)
  - `sensor_name` (VARCHAR, UNIQUE)
  - `sensor_type` (VARCHAR)
  - `sensor_location_id` (UUID, FK → locations)
  - `sensor_status` (VARCHAR)
  - `created_at`, `updated_at` (TIMESTAMP)

- **sensor_data**: Time-series sensor readings
  - `id` (UUID, PK)
  - `sensor_id` (UUID, FK → sensors)
  - `data_timestamp` (TIMESTAMP)
  - `data_value` (DECIMAL)
  - `data_type` (VARCHAR)
  - `created_at` (TIMESTAMP)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Update Supabase Settings

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your Vercel domain to Redirect URLs:
   ```
   https://your-app.vercel.app/api/auth/callback
   ```

## Testing

### Test API Endpoints

```bash
# Register a sensor
curl -X POST http://localhost:3000/api/sensor \
  -H "Content-Type: application/json" \
  -d '{"sensorName":"Test_Sensor","sensorType":"Temperature","locationName":"Lab"}'

# Submit data (use the sensorID from response)
curl -X POST http://localhost:3000/api/sensors/{SENSOR_ID}/data \
  -H "Content-Type: application/json" \
  -d '{"value":25.5}'
```

### Run Simulator

```bash
cd simulator
python iot_simulator.py --interval 5 --duration 300
```

Then check your dashboard at http://localhost:3000/dashboard to see live updates!

## Troubleshooting

### Supabase Connection Errors

- Verify `.env.local` has correct credentials
- Check that Supabase project is not paused (free tier)
- Ensure RLS policies are set up correctly

### Data Not Appearing

- Check that sensors are registered before sending data
- Verify sensor_id is correct
- Check Supabase logs in dashboard

### Python Simulator Issues

- Ensure `requests` library is installed: `pip install requests`
- Verify API URL is correct (http://localhost:3000 for local)
- Check network connectivity

## License

MIT

## Contributing

This is a demo application for educational purposes. Feel free to fork and modify for your needs.
