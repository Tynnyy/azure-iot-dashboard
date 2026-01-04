'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface DataPoint {
  data_timestamp: string;
  data_value: number;
}

interface LineChartComponentProps {
  data: DataPoint[];
  color?: string;
}

export function LineChartComponent({ data, color = "#3b82f6" }: LineChartComponentProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map(item => {
    const date = new Date(item.data_timestamp);
    return {
      timestamp: date.getTime(),
      value: item.data_value,
      formattedTime: format(date, 'HH:mm'),
      fullTime: format(date, 'MMM dd, yyyy HH:mm:ss'),
    };
  });

  // Generate ticks at 10-minute intervals
  const generateTicks = () => {
    if (chartData.length === 0) return [];

    const minTime = chartData[0].timestamp;
    const maxTime = chartData[chartData.length - 1].timestamp;

    const ticks: number[] = [];
    const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds

    // Round down to nearest 10-minute mark
    const startDate = new Date(minTime);
    startDate.setMinutes(Math.floor(startDate.getMinutes() / 10) * 10, 0, 0);
    let currentTick = startDate.getTime();

    // Generate ticks every 10 minutes
    while (currentTick <= maxTime) {
      if (currentTick >= minTime) {
        ticks.push(currentTick);
      }
      currentTick += tenMinutes;
    }

    return ticks;
  };

  const ticks = generateTicks();

  const formatTick = (timestamp: number) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="timestamp"
          type="number"
          domain={['dataMin', 'dataMax']}
          ticks={ticks}
          tickFormatter={formatTick}
          stroke="#6b7280"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#374151' }}
          formatter={(value: number | undefined) => {
            if (value === undefined) return ['N/A', 'Value'];
            return [value.toFixed(2), 'Value'];
          }}
          labelFormatter={(label, payload) => {
            if (payload && payload[0]) {
              return payload[0].payload.fullTime;
            }
            return label;
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
