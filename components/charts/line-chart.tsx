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
  const chartData = data.map(item => ({
    timestamp: new Date(item.data_timestamp).getTime(),
    value: item.data_value,
    formattedTime: format(new Date(item.data_timestamp), 'HH:mm'),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="formattedTime"
          stroke="#6b7280"
          fontSize={12}
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
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
