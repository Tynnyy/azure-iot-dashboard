# Azure IoT Dashboard

Real-time IoT sensor data monitoring and visualization platform built with Next.js 14, TypeScript, and Supabase.

## Features

- Real-time sensor data visualization with interactive charts
- Multiple sensor types support (Temperature, Humidity, Pressure, Light)
- Location-based sensor organization
- 24-hour historical data tracking
- User authentication with Supabase Auth
- RESTful API for data ingestion
- Python simulator for testing
- Responsive design with Tailwind CSS

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
   - Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard)
   - Go to Settings > API and copy your Project URL, anon key, and service role key
   - Add credentials to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   - Run the SQL migration in Supabase SQL Editor to create tables, indexes, and RLS policies

3. **Run the development server:**

```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Python Simulator

The simulator sends realistic sensor data to your API for testing.

### Setup and Usage

1. **Install dependencies:**
   ```bash
   cd simulator
   pip install -r requirements.txt
   ```

2. **Run the simulator:**
   ```bash
   # Basic usage - automatically registers sensor and starts sending data
   python iot_simulator.py

   # Custom configuration
   python iot_simulator.py --name "Kitchen_Temp" --type "Temperature" --location "Kitchen" --interval 5

   # Use with deployed app
   python iot_simulator.py --url https://azure-iot-dashboard.vercel.app
   ```

3. **View data** at [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

See `simulator/README.md` for full documentation.

## API Documentation

**Register a Sensor**
```bash
POST /api/sensor
{"sensorName": "Kitchen_Temperature", "sensorType": "Temperature", "locationName": "Kitchen"}
```

**Submit Sensor Data**
```bash
POST /api/sensors/{sensorID}/data
{"value": 23.5}
```

**Get All Sensors** - `GET /api/sensors`
**Get Sensor Details** - `GET /api/sensors/{sensorID}`
**Get Sensor Data (Last 24 Hours)** - `GET /api/sensors/{sensorID}/data`
**Get All Locations** - `GET /api/locations`

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

Deployment to Vercel is automatic via GitHub integration:

1. Commit and push changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. Vercel automatically deploys at [https://azure-iot-dashboard.vercel.app](https://azure-iot-dashboard.vercel.app)

Environment variables are configured in Vercel project settings.

## Troubleshooting

**Supabase Connection Errors**
- Verify `.env.local` credentials
- Check Supabase project is not paused
- Ensure RLS policies are configured

**Data Not Appearing**
- Confirm sensors are registered before sending data
- Check sensor_id is correct
- Review Supabase logs

**Python Simulator Issues**
- Install requirements: `pip install -r requirements.txt`
- Verify API URL is correct
- Check network connectivity

## License

MIT - Educational purposes. Fork and modify as needed.
