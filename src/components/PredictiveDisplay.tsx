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
import { MachineLearningService } from '../services/MachineLearningService';
import './PredictiveDisplay.css';

interface Props {
  environmentalContext: EnvironmentalContext;
  emotionalAnalysis: EmotionalAnalysis;
  updateInterval?: number;
}

export const PredictiveDisplay: React.FC<Props> = ({
  environmentalContext,
  emotionalAnalysis,
  updateInterval = 5000
}) => {
  const [mlService] = useState(() => new MachineLearningService());
  const [predictions, setPredictions] = useState<Map<string, any>>(new Map());
  const [selectedMetric, setSelectedMetric] = useState<string>('temperature');
  const [predictionHorizon, setPredictionHorizon] = useState<number>(24);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const processData = () => {
      mlService.addDataPoint(environmentalContext, emotionalAnalysis);
      
      try {
        const prediction = mlService.generatePrediction(selectedMetric, predictionHorizon);
        setPredictions(prev => {
          const updated = new Map(prev);
          updated.set(selectedMetric, prediction);
          return updated;
        });
        renderChart();
      } catch (error) {
        console.warn('Prediction generation failed:', error);
      }
    };

    processData();
    const interval = setInterval(processData, updateInterval);
    return () => clearInterval(interval);
  }, [environmentalContext, emotionalAnalysis, selectedMetric, predictionHorizon, updateInterval]);

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

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    const prediction = predictions.get(selectedMetric);
    if (!prediction) return;

    // Draw grid lines
    ctx.strokeStyle = '#eee';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Draw y-axis labels
      const value = prediction.value + (4 - i) * (prediction.value * 0.2);
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.fillText(value.toFixed(1), 5, y + 4);
    }

    // Draw prediction line
    ctx.beginPath();
    ctx.strokeStyle = getMetricColor(selectedMetric);
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    const xScale = (width - 2 * padding) / predictionHorizon;
    const yScale = (height - 2 * padding) / (prediction.value * 0.4);

    // Draw confidence interval
    const confidenceHeight = 20 * (1 - prediction.confidence);
    ctx.fillStyle = `rgba(255, 152, 0, ${0.1 * prediction.confidence})`;
    ctx.fillRect(
      padding,
      height - padding - prediction.value * yScale - confidenceHeight / 2,
      width - 2 * padding,
      confidenceHeight
    );

    // Draw prediction line
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - prediction.value * yScale);
    ctx.lineTo(width - padding, height - padding - prediction.value * yScale);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`${selectedMetric} Prediction`, padding, 20);

    // Draw model metrics
    ctx.font = '12px Arial';
    ctx.fillText(
      `Model Accuracy: ${(prediction.model.metrics.accuracy * 100).toFixed(1)}%`,
      padding,
      height - padding + 20
    );
    ctx.fillText(
      `Confidence: ${(prediction.confidence * 100).toFixed(1)}%`,
      padding,
      height - padding + 35
    );
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

  return (
    <div className="predictive-display">
      <h3>Machine Learning Predictions</h3>

      <div className="prediction-grid">
        <div className="chart-section">
          <div className="controls">
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

            <div className="horizon-selector">
              <label>Prediction Horizon: </label>
              <select
                value={predictionHorizon}
                onChange={(e) => setPredictionHorizon(Number(e.target.value))}
              >
                <option value="6">6 hours</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
              </select>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="prediction-chart"
          />

          {predictions.get(selectedMetric) && (
            <div className="prediction-info">
              <div className="prediction-metric">
                <span>Current: </span>
                <span>
                  {predictions.get(selectedMetric)?.value.toFixed(2)}
                </span>
              </div>
              <div className="prediction-value">
                <span>Predicted: </span>
                <span>
                  {predictions.get(selectedMetric)?.value.toFixed(2)}
                </span>
              </div>
              <div className="prediction-confidence">
                <span>Confidence: </span>
                <span>
                  {(predictions.get(selectedMetric)?.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="factors-section">
          <h4>Influencing Factors</h4>
          {predictions.get(selectedMetric)?.factors.length > 0 ? (
            <div className="factors-list">
              {predictions
                .get(selectedMetric)
                ?.factors.map((factor: { name: string; influence: number; confidence: number }, index: number) => (
                  <div key={index} className="factor-item">
                    <div className="factor-header">
                      <span className="factor-name">{factor.name}</span>
                      <span className={`factor-influence ${factor.influence > 0 ? 'positive' : 'negative'}`}>
                        {factor.influence > 0 ? '+' : ''}{factor.influence.toFixed(2)}
                      </span>
                    </div>
                    <div className="factor-bar">
                      <div
                        className="factor-bar-fill"
                        style={{
                          width: `${Math.abs(factor.influence) * 100}%`,
                          backgroundColor: factor.influence > 0 ? '#4caf50' : '#f44336'
                        }}
                      />
                    </div>
                    <div className="factor-confidence">
                      Confidence: {(factor.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="no-factors">No significant factors detected</p>
          )}
        </div>
      </div>
    </div>
  );
}; 