import React, { useEffect, useRef, useState } from 'react';
import { EmotionalAnalysis, EnvironmentalContext } from '../types/whale';
import { EmotionalHeatMapService } from '../services/EmotionalHeatMapService';
import './EmotionalHeatMap.css';

interface Props {
  emotionalAnalysis: EmotionalAnalysis;
  environmentalContext: EnvironmentalContext;
  updateInterval?: number;
}

export const EmotionalHeatMap: React.FC<Props> = ({
  emotionalAnalysis,
  environmentalContext,
  updateInterval = 5000
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [heatMapService] = useState(() => new EmotionalHeatMapService());
  const [timeWindow, setTimeWindow] = useState<number>(3600000); // 1 hour default

  useEffect(() => {
    const processData = () => {
      heatMapService.processEmotionalData(emotionalAnalysis, environmentalContext);
      renderHeatMap();
    };

    processData();
    const interval = setInterval(processData, updateInterval);
    return () => clearInterval(interval);
  }, [emotionalAnalysis, environmentalContext, updateInterval]);

  const renderHeatMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const heatMapData = heatMapService.getHeatMapData(timeWindow);
    const clusters = heatMapService.getEmotionalClusters();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const pos = (i / 10) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvas.width, pos);
      ctx.stroke();
    }

    // Draw heat map points
    heatMapData.points.forEach(point => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;
      const radius = 20;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      
      // Color based on emotion
      const color = getEmotionColor(point.emotion);
      gradient.addColorStop(0, `${color}80`); // 50% opacity
      gradient.addColorStop(1, `${color}00`); // 0% opacity
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw cluster centers
    clusters.forEach((points, key) => {
      if (points.length < 3) return; // Only show significant clusters
      
      const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
      const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
      
      const x = centerX * canvas.width;
      const y = centerY * canvas.height;
      
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw cluster label
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText(key, x + 10, y);
    });
  };

  const getEmotionColor = (emotion: string): string => {
    const colorMap: { [key: string]: string } = {
      'joy': '#ffeb3b',
      'contentment': '#4caf50',
      'curiosity': '#2196f3',
      'anxiety': '#ff9800',
      'distress': '#f44336'
    };
    return colorMap[emotion] || '#9e9e9e';
  };

  return (
    <div className="emotional-heat-map">
      <h3>Emotional Heat Map</h3>
      <div className="time-window-controls">
        <button onClick={() => setTimeWindow(3600000)}>1 Hour</button>
        <button onClick={() => setTimeWindow(86400000)}>24 Hours</button>
        <button onClick={() => setTimeWindow(604800000)}>1 Week</button>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="heat-map-canvas"
      />
      <div className="legend">
        <div className="legend-item">
          <span className="color-dot" style={{ backgroundColor: '#ffeb3b' }}></span>
          <span>Joy</span>
        </div>
        <div className="legend-item">
          <span className="color-dot" style={{ backgroundColor: '#4caf50' }}></span>
          <span>Contentment</span>
        </div>
        <div className="legend-item">
          <span className="color-dot" style={{ backgroundColor: '#2196f3' }}></span>
          <span>Curiosity</span>
        </div>
        <div className="legend-item">
          <span className="color-dot" style={{ backgroundColor: '#ff9800' }}></span>
          <span>Anxiety</span>
        </div>
        <div className="legend-item">
          <span className="color-dot" style={{ backgroundColor: '#f44336' }}></span>
          <span>Distress</span>
        </div>
      </div>
    </div>
  );
}; 