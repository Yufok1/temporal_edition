import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TemporalData } from '../services/TemporalEditionService';
import '../styles/TemporalEditionViewer.css';

interface TemporalEditionViewerProps {
  data: TemporalData[];
  onTimeRangeChange: (start: Date, end: Date) => void;
}

export const TemporalEditionViewer: React.FC<TemporalEditionViewerProps> = ({
  data,
  onTimeRangeChange
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [filteredData, setFilteredData] = useState<TemporalData[]>([]);

  useEffect(() => {
    const now = Date.now();
    const ranges = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const filtered = data.filter(item => 
      item.timestamp >= now - ranges[timeRange]
    );

    setFilteredData(filtered);
    
    onTimeRangeChange(
      new Date(now - ranges[timeRange]),
      new Date(now)
    );
  }, [data, timeRange, onTimeRangeChange]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="temporal-edition-viewer">
      <div className="controls">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as '24h' | '7d' | '30d')}
          className="time-range-selector"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      <div className="metrics-chart">
        <h3>System Metrics</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTimestamp}
              angle={-45}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip
              labelFormatter={formatTimestamp}
              formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="metrics.cpu"
              name="CPU Usage"
              stroke="#8884d8"
            />
            <Line
              type="monotone"
              dataKey="metrics.memory"
              name="Memory Usage"
              stroke="#82ca9d"
            />
            <Line
              type="monotone"
              dataKey="metrics.cycleTime"
              name="Cycle Time"
              stroke="#ffc658"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 