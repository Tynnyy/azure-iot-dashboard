import requests
import random
import time
from datetime import datetime
import argparse


class IoTSimulator:
    def __init__(self, api_url, sensor_config):
        """
        Initialize IoT Simulator

        Args:
            api_url: Base URL of the API (e.g., http://localhost:3000)
            sensor_config: Dictionary containing sensor configuration
        """
        self.api_url = api_url.rstrip('/')
        self.sensor_config = sensor_config
        self.sensor_id = None

    def register_sensor(self):
        """Register a new sensor with the API"""
        url = f"{self.api_url}/api/sensor"

        payload = {
            "sensorName": self.sensor_config['name'],
            "sensorType": self.sensor_config['type'],
            "locationName": self.sensor_config['location']
        }

        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()

            data = response.json()
            self.sensor_id = data['sensorID']
            print(f"✓ Sensor registered successfully!")
            print(f"  Sensor ID: {self.sensor_id}")
            print(f"  Name: {self.sensor_config['name']}")
            print(f"  Type: {self.sensor_config['type']}")
            print(f"  Location: {self.sensor_config['location']}")
            return True

        except requests.exceptions.RequestException as e:
            print(f"✗ Failed to register sensor: {e}")
            return False

    def generate_sensor_value(self):
        """Generate a realistic sensor value based on type"""
        base_value = self.sensor_config.get('base_value', 20)
        variance = self.sensor_config.get('variance', 5)

        # Generate value with some randomness
        value = base_value + random.uniform(-variance, variance)

        # Add small trend (optional)
        if hasattr(self, 'trend'):
            value += self.trend
            # Occasionally reverse trend
            if random.random() < 0.1:
                self.trend = -self.trend
        else:
            self.trend = random.uniform(-0.1, 0.1)

        return round(value, 2)

    def send_data(self, value):
        """Send sensor data to the API"""
        if not self.sensor_id:
            print("✗ Sensor not registered. Call register_sensor() first.")
            return False

        url = f"{self.api_url}/api/sensors/{self.sensor_id}/data"

        payload = {
            "value": value
        }

        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()

            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"[{timestamp}] ✓ Sent: {value} (Status: {response.json()['status']})")
            return True

        except requests.exceptions.RequestException as e:
            print(f"✗ Failed to send data: {e}")
            return False

    def run(self, interval=10, duration=None):
        """
        Run the simulator

        Args:
            interval: Seconds between readings (default: 10)
            duration: Total duration in seconds (None = run indefinitely)
        """
        print("\n" + "="*60)
        print("IoT Sensor Simulator Started")
        print("="*60)

        # Register sensor first
        if not self.register_sensor():
            return

        print(f"\nSending data every {interval} seconds...")
        print("Press Ctrl+C to stop\n")

        start_time = time.time()
        reading_count = 0

        try:
            while True:
                # Check duration
                if duration and (time.time() - start_time) >= duration:
                    print(f"\nDuration of {duration} seconds reached. Stopping.")
                    break

                # Generate and send data
                value = self.generate_sensor_value()
                if self.send_data(value):
                    reading_count += 1

                # Wait for next reading
                time.sleep(interval)

        except KeyboardInterrupt:
            print("\n\nSimulator stopped by user")

        finally:
            elapsed_time = time.time() - start_time
            print("\n" + "="*60)
            print("Simulation Summary")
            print("="*60)
            print(f"Total readings sent: {reading_count}")
            print(f"Total time: {elapsed_time:.1f} seconds")
            if reading_count > 0:
                print(f"Average interval: {elapsed_time/reading_count:.1f} seconds")
            print("="*60)


def main():
    parser = argparse.ArgumentParser(description='IoT Sensor Data Simulator')
    parser.add_argument('--url', default='http://localhost:3000',
                        help='API base URL (default: http://localhost:3000)')
    parser.add_argument('--name', default=None,
                        help='Sensor name (default: auto-generated with timestamp)')
    parser.add_argument('--type', default='Temperature',
                        help='Sensor type (Temperature, Humidity, Pressure, Light)')
    parser.add_argument('--location', default='Simulation Lab',
                        help='Sensor location')
    parser.add_argument('--interval', type=int, default=10,
                        help='Seconds between readings (default: 10)')
    parser.add_argument('--duration', type=int, default=None,
                        help='Total duration in seconds (default: run indefinitely)')
    parser.add_argument('--base-value', type=float, default=None,
                        help='Base sensor value')
    parser.add_argument('--variance', type=float, default=None,
                        help='Value variance range')

    args = parser.parse_args()

    # Auto-generate sensor name with timestamp if not provided
    if args.name is None:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        args.name = f"{args.type}_Sensor_{timestamp}"

    # Default values based on sensor type
    default_configs = {
        'Temperature': {'base_value': 22.0, 'variance': 3.0},
        'Humidity': {'base_value': 60.0, 'variance': 10.0},
        'Pressure': {'base_value': 1013.0, 'variance': 5.0},
        'Light': {'base_value': 500.0, 'variance': 100.0},
    }

    sensor_config = {
        'name': args.name,
        'type': args.type,
        'location': args.location,
        'base_value': args.base_value or default_configs.get(args.type, {}).get('base_value', 20),
        'variance': args.variance or default_configs.get(args.type, {}).get('variance', 5),
    }

    simulator = IoTSimulator(args.url, sensor_config)
    simulator.run(interval=args.interval, duration=args.duration)


if __name__ == "__main__":
    main()
