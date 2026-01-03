import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatSensorValue(value: number, type: string): string {
  const units: Record<string, string> = {
    'Temperature': '°C',
    'Humidity': '%',
    'Pressure': 'hPa',
    'Light': 'lux',
    'default': '',
  };

  const unit = units[type] || units.default;
  return `${value.toFixed(2)}${unit}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-green-600 bg-green-100',
    inactive: 'text-gray-600 bg-gray-100',
    error: 'text-red-600 bg-red-100',
    warning: 'text-yellow-600 bg-yellow-100',
  };
  return colors[status.toLowerCase()] || colors.inactive;
}
