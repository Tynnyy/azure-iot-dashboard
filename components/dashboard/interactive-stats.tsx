'use client';

import { useState } from 'react';
import { StatsCard } from './stats-card';
import { DetailModal } from './detail-modal';

interface InteractiveStatsProps {
  stats: {
    totalSensors: number;
    activeSensors: number;
    totalLocations: number;
    recentReadings: number;
  };
}

type DetailType = 'sensors' | 'active-sensors' | 'locations' | 'readings' | null;

export function InteractiveStats({ stats }: InteractiveStatsProps) {
  const [selectedDetail, setSelectedDetail] = useState<DetailType>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          onClick={() => setSelectedDetail('sensors')}
          className="cursor-pointer transform hover:scale-105 transition-transform"
        >
          <StatsCard
            title="Total Sensors"
            value={stats.totalSensors}
            icon={<span className="text-4xl">📡</span>}
          />
        </div>
        <div
          onClick={() => setSelectedDetail('active-sensors')}
          className="cursor-pointer transform hover:scale-105 transition-transform"
        >
          <StatsCard
            title="Active Sensors"
            value={stats.activeSensors}
            icon={<span className="text-4xl">✅</span>}
          />
        </div>
        <div
          onClick={() => setSelectedDetail('locations')}
          className="cursor-pointer transform hover:scale-105 transition-transform"
        >
          <StatsCard
            title="Locations"
            value={stats.totalLocations}
            icon={<span className="text-4xl">📍</span>}
          />
        </div>
        <div
          onClick={() => setSelectedDetail('readings')}
          className="cursor-pointer transform hover:scale-105 transition-transform"
        >
          <StatsCard
            title="24h Readings"
            value={stats.recentReadings}
            icon={<span className="text-4xl">📊</span>}
          />
        </div>
      </div>

      <DetailModal
        type={selectedDetail}
        onClose={() => setSelectedDetail(null)}
      />
    </>
  );
}
