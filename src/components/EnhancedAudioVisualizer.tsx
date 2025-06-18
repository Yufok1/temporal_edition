import React, { useEffect, useRef } from 'react';
import { AudioAnalysis } from '../types/audio';

interface EnhancedAudioVisualizerProps {
  analysis: AudioAnalysis;
  onEffectChange: (type: string, parameter: string, value: number) => void;
}

export const EnhancedAudioVisualizer: React.FC<EnhancedAudioVisualizerProps> = ({
  analysis,
  onEffectChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSpectrum = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Draw background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(52, 152, 219, 0.05)');
      gradient.addColorStop(1, 'rgba(46, 204, 113, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw frequency spectrum
      const barWidth = width / analysis.frequencyData.length;
      analysis.frequencyData.forEach((value, index) => {
        const x = index * barWidth;
        const barHeight = (value / 255) * height;

        // Create gradient for each bar
        const barGradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        barGradient.addColorStop(0, 'rgba(52, 152, 219, 0.8)');
        barGradient.addColorStop(1, 'rgba(46, 204, 113, 0.8)');

        ctx.fillStyle = barGradient;
        ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
      });

      // Draw time domain
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;

      analysis.timeData.forEach((value, index) => {
        const x = (index / analysis.timeData.length) * width;
        const y = ((value + 128) / 255) * height;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw pitch detection
      if (analysis.pitch) {
        const pitchX = (analysis.pitch.frequency / analysis.sampleRate) * width;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.8)';
        ctx.lineWidth = 2;
        ctx.moveTo(pitchX, 0);
        ctx.lineTo(pitchX, height);
        ctx.stroke();

        // Draw confidence indicator
        const confidenceHeight = analysis.pitch.confidence * height;
        ctx.fillStyle = 'rgba(231, 76, 60, 0.2)';
        ctx.fillRect(pitchX - 2, height - confidenceHeight, 4, confidenceHeight);
      }

      animationFrameRef.current = requestAnimationFrame(drawSpectrum);
    };

    drawSpectrum();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analysis]);

  return (
    <div className="enhanced-visualizer">
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        style={{ width: '100%', height: '200px' }}
      />
      <div className="analysis-controls">
        <div className="control-group">
          <label>Filter Cutoff</label>
          <input
            type="range"
            min="20"
            max="20000"
            step="1"
            value={analysis.filterCutoff || 1000}
            onChange={(e) => onEffectChange('filter', 'cutoff', parseFloat(e.target.value))}
          />
        </div>
        <div className="control-group">
          <label>Filter Resonance</label>
          <input
            type="range"
            min="0"
            max="20"
            step="0.1"
            value={analysis.filterResonance || 1}
            onChange={(e) => onEffectChange('filter', 'resonance', parseFloat(e.target.value))}
          />
        </div>
        <div className="control-group">
          <label>Reverb Mix</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={analysis.reverbMix || 0}
            onChange={(e) => onEffectChange('reverb', 'mix', parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}; 