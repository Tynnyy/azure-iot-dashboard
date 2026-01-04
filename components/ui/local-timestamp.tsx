'use client';

import { formatTimestamp } from '@/lib/utils';

interface LocalTimestampProps {
  timestamp: string;
  className?: string;
}

export function LocalTimestamp({ timestamp, className }: LocalTimestampProps) {
  return (
    <span className={className}>
      {formatTimestamp(timestamp)}
    </span>
  );
}
