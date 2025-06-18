// Copyright 2024 The Temporal Editioner Contributors
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 

import React, { useEffect, useRef, useState } from 'react';
import { EnvironmentalContext, EmotionalAnalysis } from '../types/whale';
import { HistoricalAnalysisService } from '../services/HistoricalAnalysisService';
import './HistoricalAnalysisDisplay.css';

interface Props {
  environmentalContext: EnvironmentalContext;
  emotionalAnalysis: EmotionalAnalysis;
  updateInterval?: number;
}

export const HistoricalAnalysisDisplay: React.FC<Props> = ({
  environmentalContext,
  emotionalAnalysis,
  updateInterval = 5000
}) => {
  const [analysisService] = useState(() => new HistoricalAnalysisService());
  const [trends, setTrends] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('temperature');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const processData = () => {
      analysisService.addDataPoint(environmentalContext, emotionalAnalysis);
      setTrends(analysisService.analyzeTrends());
      setInsights(analysisService.detectPatterns());
      renderChart();
    };

    processData();
    const interval = setInterval(processData, updateInterval);
    return () => clearInterval(interval);
  }, [environmentalContext, emotionalAnalysis, updateInterval]);

  const renderChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const selectedTrend = trends.find(t => t.metric === selectedMetric);
    if (!selectedTrend) return;

    const values = selectedTrend.values;
    const timestamps = selectedTrend.timestamps;

    // Calculate scales
    const xScale = (width - 2 * padding) / (values.length - 1);
    const yMin = Math.min(...values);
    const yMax = Math.max(...values);
    const yRange = yMax - yMin;
    const yScale = (height - 2 * padding) / yRange;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#eee';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Draw y-axis labels
      const value = yMax - (i * yRange) / 5;
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.fillText(value.toFixed(1), 5, y + 4);
    }

    // Draw data points and lines
    ctx.beginPath();
    ctx.strokeStyle = getMetricColor(selectedMetric);
    ctx.lineWidth = 2;

    values.forEach((value: number, i: number) => {
      const x = padding + i * xScale;
      const y = height - padding - (value - yMin) * yScale;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw point
      ctx.fillStyle = getMetricColor(selectedMetric);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.stroke();

    // Draw trend line
    if (selectedTrend.trend !== 'fluctuating') {
      const firstValue = values[0];
      const lastValue = values[values.length - 1];
      const trendSlope = (lastValue - firstValue) / (values.length - 1);

      ctx.beginPath();
      ctx.strokeStyle = '#ff9800';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      values.forEach((_: number, i: number) => {
        const x = padding + i * xScale;
        const y = height - padding - (firstValue + trendSlope * i - yMin) * yScale;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`${selectedMetric} Trend`, padding, 20);
  };

  const getMetricColor = (metric: string): string => {
    const colorMap: { [key: string]: string } = {
      'temperature': '#ff9800',
      'salinity': '#2196f3',
      'pressure': '#9c27b0',
      'groupSize': '#4caf50'
    };
    return colorMap[metric] || '#9e9e9e';
  };

  const getInsightColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      'correlation': '#2196f3',
      'seasonality': '#9c27b0',
      'threshold': '#ff9800',
      'anomaly': '#f44336'
    };
    return colorMap[type] || '#9e9e9e';
  };

  return (
    <div className="historical-analysis">
      <h3>Historical Analysis</h3>

      <div className="analysis-grid">
        <div className="chart-section">
          <div className="metric-selector">
            <label>Select Metric: </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="temperature">Temperature</option>
              <option value="salinity">Salinity</option>
              <option value="pressure">Pressure</option>
              <option value="groupSize">Group Size</option>
            </select>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="trend-chart"
          />

          {trends.find(t => t.metric === selectedMetric) && (
            <div className="trend-info">
              <div className="trend-metric">
                <span>Trend: </span>
                <span className={`trend-${trends.find(t => t.metric === selectedMetric)?.trend}`}>
                  {trends.find(t => t.metric === selectedMetric)?.trend}
                </span>
              </div>
              <div className="trend-confidence">
                <span>Confidence: </span>
                <span>
                  {(trends.find(t => t.metric === selectedMetric)?.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="insights-section">
          <h4>Pattern Insights</h4>
          {insights.length > 0 ? (
            <div className="insights-list">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="insight-item"
                  style={{ borderLeftColor: getInsightColor(insight.type) }}
                >
                  <div className="insight-header">
                    <span className="insight-type">{insight.type}</span>
                    <span className="insight-impact">{insight.impact}</span>
                  </div>
                  <p className="insight-description">{insight.description}</p>
                  <div className="insight-confidence">
                    Confidence: {(insight.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="insight-recommendations">
                    <h5>Recommendations:</h5>
                    <ul>
                      {insight.recommendations.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-insights">No significant patterns detected</p>
          )}
        </div>
      </div>
    </div>
  );
}; 