# IoT Sensor Simulator

Python script to simulate IoT sensor data and send it to the API.

## Installation

```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage (Default Temperature Sensor)

```bash
python iot_simulator.py
```

### Custom Sensor Configuration

```bash
# Temperature sensor
python iot_simulator.py --name "Kitchen_Temp" --type "Temperature" --location "Kitchen"

# Humidity sensor
python iot_simulator.py --name "Bedroom_Humidity" --type "Humidity" --location "Bedroom" --base-value 55 --variance 8

# Custom API URL (for production)
python iot_simulator.py --url "https://your-app.vercel.app"

# Send data every 5 seconds for 1 hour
python iot_simulator.py --interval 5 --duration 3600
```

### Parameters

- `--url`: API base URL (default: http://localhost:3000)
- `--name`: Sensor name
- `--type`: Sensor type (Temperature, Humidity, Pressure, Light)
- `--location`: Location name
- `--interval`: Seconds between readings (default: 10)
- `--duration`: Total duration in seconds (omit for infinite)
- `--base-value`: Base sensor value
- `--variance`: Value variance range

### Examples

**Multiple sensors in parallel:**

```bash
# Terminal 1 - Temperature
python iot_simulator.py --name "Office_Temp" --type "Temperature" --location "Office"

# Terminal 2 - Humidity
python iot_simulator.py --name "Office_Humidity" --type "Humidity" --location "Office"

# Terminal 3 - Light
python iot_simulator.py --name "Office_Light" --type "Light" --location "Office"
```

## Default Sensor Values

| Type | Base Value | Variance | Unit |
|------|------------|----------|------|
| Temperature | 22.0 | ±3.0 | °C |
| Humidity | 60.0 | ±10.0 | % |
| Pressure | 1013.0 | ±5.0 | hPa |
| Light | 500.0 | ±100.0 | lux |
