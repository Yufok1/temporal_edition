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

import React, { useEffect, useRef } from 'react';
import { AudioState } from '../services/DjinnAudioService';
import '../styles/AudioVisualizer.css';

interface AudioVisualizerProps {
  audioState: AudioState;
  onVolumeChange: (volume: number) => void;
  onTempoChange: (tempo: number) => void;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioState,
  onVolumeChange,
  onTempoChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawVisualizer = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(52, 152, 219, 0.1)');
      gradient.addColorStop(1, 'rgba(46, 204, 113, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw waveform
      if (audioState.isPlaying) {
        const time = Date.now() * 0.001;
        const amplitude = audioState.volume * 0.5;
        const frequency = audioState.tempo / 60;

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.8)';
        ctx.lineWidth = 2;

        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.02 + time * frequency) * amplitude * height;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();

        // Draw harmonics
        audioState.harmony.forEach((_, index) => {
          const harmonicAmplitude = amplitude * 0.3;
          const harmonicFrequency = frequency * (index + 2);

          ctx.beginPath();
          ctx.strokeStyle = `rgba(46, 204, 113, ${0.4 - index * 0.1})`;
          ctx.lineWidth = 1;

          for (let x = 0; x < width; x++) {
            const y = height / 2 + Math.sin(x * 0.02 + time * harmonicFrequency) * harmonicAmplitude * height;
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.stroke();
        });
      }

      animationFrameRef.current = requestAnimationFrame(drawVisualizer);
    };

    drawVisualizer();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioState]);

  return (
    <div className="audio-visualizer">
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        style={{ width: '100%', height: '200px' }}
      />
      
      <div className="audio-controls">
        <div className="control-group">
          <label>Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioState.volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          />
        </div>
        
        <div className="control-group">
          <label>Tempo</label>
          <input
            type="range"
            min="60"
            max="240"
            step="1"
            value={audioState.tempo}
            onChange={(e) => onTempoChange(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="current-harmony">
        <h3>Current Harmony</h3>
        <div className="harmony-notes">
          {audioState.harmony.map((note, index) => (
            <span key={index} className="note">
              {note}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}; 