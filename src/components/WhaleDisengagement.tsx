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

import React, { useEffect, useState } from 'react';
import { FarewellSignal, EmotionalAnalysis, EnvironmentalContext } from '../types/whale';
import { WhalePsychoanalysisService } from '../services/WhalePsychoanalysisService';
import { EmotionalPatternAnalysisService } from '../services/EmotionalPatternAnalysisService';
import { EmotionalPatternDisplay } from './EmotionalPatternDisplay';
import { StressAndBondingDisplay } from './StressAndBondingDisplay';
import { EmotionalHeatMap } from './EmotionalHeatMap';
import { SocialNetworkGraph } from './SocialNetworkGraph';
import { EnvironmentalMonitor } from './EnvironmentalMonitor';
import { HistoricalAnalysisDisplay } from './HistoricalAnalysisDisplay';
import { PredictiveDisplay } from './PredictiveDisplay';
import { RecommendationDisplay } from './RecommendationDisplay';
import './WhaleDisengagement.css';

interface Props {
  farewellSignal: FarewellSignal;
  onAcknowledge: () => void;
  onReengage: () => void;
  stewardId: string;
}

export const WhaleDisengagement: React.FC<Props> = ({
  farewellSignal,
  onAcknowledge,
  onReengage,
  stewardId,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(300); // 5 minutes in seconds
  const [psychoanalyticalContext, setPsychoanalyticalContext] = useState<EmotionalAnalysis | null>(null);
  const [recoveryMetrics, setRecoveryMetrics] = useState<{
    emotionalRecovery: number;
    environmentalAdaptation: number;
    socialIntegration: number;
    readinessScore: number;
  } | null>(null);
  const [environmentalContext, setEnvironmentalContext] = useState<EnvironmentalContext>({
    waterConditions: {
      temperature: 20,
      salinity: 35,
      pressure: 1,
    },
    socialContext: {
      groupSize: 3,
      proximity: 0.5,
    },
  });

  useEffect(() => {
    // Analyze emotional state when farewell signal is received
    const analysis = WhalePsychoanalysisService.analyzeEmotionalState(farewellSignal);
    setPsychoanalyticalContext(analysis);

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [farewellSignal]);

  useEffect(() => {
    if (psychoanalyticalContext) {
      // Calculate recovery metrics
      const metrics = WhalePsychoanalysisService.calculateRecoveryMetrics(
        psychoanalyticalContext,
        environmentalContext
      );
      setRecoveryMetrics(metrics);
    }
  }, [psychoanalyticalContext, environmentalContext]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="whale-disengagement">
      <h2>Whale Disengagement</h2>
      
      <div className="signal-details">
        <h3>Farewell Signal Details</h3>
        <p>Type: {farewellSignal.type}</p>
        <p>Intensity: {farewellSignal.intensity}</p>
        <p>Duration: {farewellSignal.duration} seconds</p>
      </div>

      {psychoanalyticalContext && (
        <>
          <div className="emotional-analysis">
            <h3>Emotional Analysis</h3>
            <div className="emotional-states">
              <div className="primary-emotion">
                <h4>Primary Emotion</h4>
                <p>{psychoanalyticalContext.primaryEmotion}</p>
                <div className="intensity-bar">
                  <div
                    className="intensity-fill"
                    style={{ width: `${psychoanalyticalContext.intensity * 100}%` }}
                  />
                </div>
              </div>
              <div className="secondary-emotions">
                <h4>Secondary Emotions</h4>
                {psychoanalyticalContext.secondaryEmotions.map((emotion: string, index: number) => (
                  <div key={index} className="emotion-tag">
                    {emotion}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <EmotionalPatternDisplay
            emotionalAnalysis={psychoanalyticalContext}
            environmentalContext={environmentalContext}
            updateInterval={5000}
          />

          <StressAndBondingDisplay
            emotionalAnalysis={psychoanalyticalContext}
            environmentalContext={environmentalContext}
            updateInterval={5000}
          />

          <EmotionalHeatMap
            emotionalAnalysis={psychoanalyticalContext}
            environmentalContext={environmentalContext}
            updateInterval={5000}
          />

          <SocialNetworkGraph
            whaleId="current-whale"
            emotionalAnalysis={psychoanalyticalContext}
            environmentalContext={environmentalContext}
            updateInterval={5000}
          />

          <EnvironmentalMonitor
            environmentalContext={environmentalContext}
            updateInterval={5000}
          />

          <HistoricalAnalysisDisplay
            environmentalContext={environmentalContext}
            emotionalAnalysis={psychoanalyticalContext}
            updateInterval={5000}
          />

          <PredictiveDisplay
            environmentalContext={environmentalContext}
            emotionalAnalysis={psychoanalyticalContext}
            updateInterval={5000}
          />

          <RecommendationDisplay
            environmentalContext={environmentalContext}
            emotionalAnalysis={psychoanalyticalContext}
            stewardId={stewardId}
            updateInterval={5000}
          />
        </>
      )}

      {recoveryMetrics && (
        <div className="recovery-metrics">
          <h3>Recovery Progress</h3>
          <div className="metrics-grid">
            <div className="metric">
              <label>Emotional Recovery</label>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${recoveryMetrics.emotionalRecovery * 100}%` }}
                />
              </div>
            </div>
            <div className="metric">
              <label>Environmental Adaptation</label>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${recoveryMetrics.environmentalAdaptation * 100}%` }}
                />
              </div>
            </div>
            <div className="metric">
              <label>Social Integration</label>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${recoveryMetrics.socialIntegration * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="buffer-period">
        <h3>Buffer Period</h3>
        <p>Time Remaining: {formatTime(timeRemaining)}</p>
      </div>

      <div className="actions">
        <button
          className="acknowledge-btn"
          onClick={onAcknowledge}
          disabled={timeRemaining > 0}
        >
          Acknowledge Disengagement
        </button>
        {timeRemaining === 0 && recoveryMetrics && recoveryMetrics.readinessScore >= 0.7 && (
          <button className="reengage-btn" onClick={onReengage}>
            Reengage with Whale
          </button>
        )}
      </div>
    </div>
  );
}; 