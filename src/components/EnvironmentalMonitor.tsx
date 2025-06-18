import React, { useEffect, useRef, useState } from 'react';
import { EnvironmentalContext } from '../types/whale';
import { EnvironmentalMonitoringService } from '../services/EnvironmentalMonitoringService';
import './EnvironmentalMonitor.css';

interface Props {
  environmentalContext: EnvironmentalContext;
  updateInterval?: number;
}

export const EnvironmentalMonitor: React.FC<Props> = ({
  environmentalContext,
  updateInterval = 5000
}) => {
  const [monitoringService] = useState(() => new EnvironmentalMonitoringService());
  const [trends, setTrends] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [impact, setImpact] = useState<{
    socialStability: number;
    emotionalInfluence: number;
    recommendedActions: string[];
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const processData = () => {
      monitoringService.processEnvironmentalData(environmentalContext);
      setTrends(monitoringService.getEnvironmentalTrends());
      setAlerts(monitoringService.getActiveAlerts());
      setImpact(monitoringService.getEnvironmentalImpact(environmentalContext));
      renderTrends();
    };

    processData();
    const interval = setInterval(processData, updateInterval);
    return () => clearInterval(interval);
  }, [environmentalContext, updateInterval]);

  const renderTrends = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const pos = (i / 10) * width;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(width, pos);
      ctx.stroke();
    }

    // Draw trends
    trends.forEach((trend, index) => {
      const yOffset = (index * height) / trends.length;
      const trendHeight = height / trends.length - 20;

      // Draw trend line
      ctx.beginPath();
      ctx.strokeStyle = getTrendColor(trend.metric);
      ctx.lineWidth = 2;

      trend.values.forEach((value: number, i: number) => {
        const x = (i / (trend.values.length - 1)) * width;
        const y = yOffset + trendHeight - (value * trendHeight);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw metric label
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.fillText(trend.metric, 10, yOffset + 15);

      // Draw trend indicator
      const trendText = `${trend.trend} (${trend.rateOfChange.toFixed(2)})`;
      ctx.fillText(trendText, width - 100, yOffset + 15);
    });
  };

  const getTrendColor = (metric: string): string => {
    const colorMap: { [key: string]: string } = {
      'temperature': '#ff9800',
      'salinity': '#2196f3',
      'pressure': '#9c27b0',
      'groupSize': '#4caf50'
    };
    return colorMap[metric] || '#9e9e9e';
  };

  const getAlertSeverityColor = (severity: string): string => {
    const colorMap: { [key: string]: string } = {
      'low': '#4caf50',
      'medium': '#ff9800',
      'high': '#f44336'
    };
    return colorMap[severity] || '#9e9e9e';
  };

  return (
    <div className="environmental-monitor">
      <h3>Environmental Monitor</h3>
      
      <div className="monitor-grid">
        <div className="trends-section">
          <h4>Environmental Trends</h4>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="trends-canvas"
          />
        </div>

        <div className="alerts-section">
          <h4>Active Alerts</h4>
          {alerts.length > 0 ? (
            <div className="alerts-list">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="alert-item"
                  style={{ borderLeftColor: getAlertSeverityColor(alert.severity) }}
                >
                  <div className="alert-header">
                    <span className="alert-type">{alert.type}</span>
                    <span className="alert-severity">{alert.severity}</span>
                  </div>
                  <p className="alert-message">{alert.message}</p>
                  <div className="alert-details">
                    <span>Current: {alert.value.toFixed(2)}</span>
                    <span>Threshold: {alert.threshold.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-alerts">No active alerts</p>
          )}
        </div>

        {impact && (
          <div className="impact-section">
            <h4>Environmental Impact</h4>
            <div className="impact-metrics">
              <div className="metric">
                <label>Social Stability</label>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${impact.socialStability * 100}%` }}
                  />
                </div>
              </div>
              <div className="metric">
                <label>Emotional Influence</label>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${impact.emotionalInfluence * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="recommendations">
              <h5>Recommended Actions</h5>
              <ul>
                {impact.recommendedActions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 