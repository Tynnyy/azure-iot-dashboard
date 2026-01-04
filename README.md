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

## How to Develop

### Setting Up Your Development Environment

1. **Open VSCode:**
   - Navigate to the project folder in File Explorer: `C:\Users\Acer\OneDrive\Documents\Educationnn\DEGREE\IOT - Internet of Things\IOT CW2\my-app`
   - Right-click and select "Open with Code"
   - Or from command line: `code "C:\Users\Acer\OneDrive\Documents\Educationnn\DEGREE\IOT - Internet of Things\IOT CW2\my-app"`

2. **Start Claude for Programming Assistant:**
   - Open a terminal in VSCode (Terminal > New Terminal)
   - Run: `claude code`
   - This starts Claude Code CLI to help you with development tasks

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Open the Application:**
   - Navigate to [http://localhost:3000](http://localhost:3000) in your browser

Now you're ready to develop with AI assistance from Claude!

## How to Simulate

### Step-by-Step Guide to Submit Sensor Data

#### Option 1: Using the Python Simulator (Recommended)

1. **Install Python Dependencies:**
   ```bash
   cd simulator
   pip install -r requirements.txt
   ```

2. **Run the Simulator:**
   ```bash
   # Basic usage - automatically registers sensor and starts sending data
   python iot_simulator.py

   # Custom configuration
   python iot_simulator.py --name "Kitchen_Temp" --type "Temperature" --location "Kitchen" --interval 5
   ```

3. **View Data in Dashboard:**
   - Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - You should see the sensor appear and data updating in real-time

#### Option 2: Manual API Testing with cURL

1. **Register a Sensor:**
   ```bash
   curl -X POST http://localhost:3000/api/sensor \
     -H "Content-Type: application/json" \
     -d "{\"sensorName\":\"Test_Sensor_001\",\"sensorType\":\"Temperature\",\"locationName\":\"Lab\"}"
   ```

   Save the `sensorID` from the response (e.g., `"sensorID": "abc123..."`)

2. **Submit Sensor Data:**
   ```bash
   # Replace {SENSOR_ID} with the ID from step 1
   curl -X POST http://localhost:3000/api/sensors/{SENSOR_ID}/data \
     -H "Content-Type: application/json" \
     -d "{\"value\":25.5}"
   ```

3. **Submit Multiple Data Points:**
   ```bash
   # Send different values to simulate sensor readings
   curl -X POST http://localhost:3000/api/sensors/{SENSOR_ID}/data \
     -H "Content-Type: application/json" \
     -d "{\"value\":26.2}"

   curl -X POST http://localhost:3000/api/sensors/{SENSOR_ID}/data \
     -H "Content-Type: application/json" \
     -d "{\"value\":24.8}"
   ```

4. **View the Data:**
   - Go to [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - Click on your sensor to see the data visualization
   - Or use the API: `curl http://localhost:3000/api/sensors/{SENSOR_ID}/data`

## Using the Python Simulator

The simulator sends realistic sensor data to your API for testing.


```powershell
python simulator/iot_simulator.py --url https://azure-iot-dashboard.vercel.app --name "Humidity_Sensor_20260103T085236" --type "Humidity" --use-existing --interval 5
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

## How to Deploy

Since GitHub connectivity to Vercel is already configured, deployment is automatic:

1. **Commit Your Changes:**
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

3. **Automatic Deployment:**
   - Vercel will automatically detect the push
   - A new deployment will start immediately
   - You'll receive a notification when deployment is complete

4. **View Your Deployment:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click on your project to see deployment status
   - Your live URL: https://azure-iot-dashboard.vercel.app

**Note:** Environment variables are already configured in Vercel. If you need to update them, go to your Vercel project settings > Environment Variables.

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
