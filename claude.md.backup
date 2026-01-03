# Project: Azure IOT Dashboard

## What I'm Building 
A tool that collect IoT sensor data and show the data in dashboard - including data ingest at cloud, data transmit simulation at local, and web interface for dashboard

## Tech Stack
| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Next.js API routes |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |
| Hosting | Vercel |

## Pages

| Route | Purpose |
| --- | --- |
| / | Landing page - hero, features, CTA |
| /login | Login form |
| /signup | Sign up form |
| /dashboard | List IoT data in charts and other formats |
| /dashboard/[id] | view of single IoT data |

## API endpoints

### POST /api/sensor
Register a new sensor

**Request**
```json
{
    "sensorName" : "MainRoom_Temperature",
    "sensorType" : "Temperature Sensor",
    "locationName": "Main Room",
}
```

**Response**
```json
{
    "sensorID": "999999",
    "status": "registered"
}
```

### POST /api/sensor/{sensorID}/data
Submit new sensor reading

**Request**
```json
{
    "value": 30.52
}
```

**Response**
```json
{
    "status" : "ok"
}
```

### GET /api/sensors
List all sensors

### GET /api/sensors/{sensorID}
Sensor details

### GET /api/sensors/{sensorID}/data
Get latest 24 hour reading

### GET /api/locations
List of locations configured

## Database
Tables needed

### Location
- locationID (pk)
- locationName

### Sensor
- sensorID (pk)
- sensorName
- sensorType
- sensorLocationID (fk)
- sensorStatus

### Sensor Data
- sensorID (fk)
- dataTimestamp
- dataValue
- dataType

### User
- userID (pk)
- username
- userStatus
- passwordHash

## Authorization
As this is demo application, all users have all access to all sensors and data

## Local simulation
This simulation will be on python script