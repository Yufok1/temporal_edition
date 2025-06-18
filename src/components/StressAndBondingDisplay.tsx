import React, { useEffect, useState } from 'react';
import { EmotionalAnalysis, EnvironmentalContext } from '../types/whale';
import { StressAnalysisService } from '../services/StressAnalysisService';
import './StressAndBondingDisplay.css';

interface Props {
  emotionalAnalysis: EmotionalAnalysis;
  environmentalContext: EnvironmentalContext;
  updateInterval?: number;
}

export const StressAndBondingDisplay: React.FC<Props> = ({
  emotionalAnalysis,
  environmentalContext,
  updateInterval = 5000
}) => {
  const [stressAnalysis, setStressAnalysis] = useState<any>(null);
  const [bondingAnalysis, setBondingAnalysis] = useState<any>(null);

  useEffect(() => {
    const analyzeData = () => {
      const stress = StressAnalysisService.analyzeStress(emotionalAnalysis, environmentalContext);
      const bonding = StressAnalysisService.analyzeSocialBonding(emotionalAnalysis, environmentalContext);
      setStressAnalysis(stress);
      setBondingAnalysis(bonding);
    };

    analyzeData();
    const interval = setInterval(analyzeData, updateInterval);
    return () => clearInterval(interval);
  }, [emotionalAnalysis, environmentalContext, updateInterval]);

  if (!stressAnalysis || !bondingAnalysis) return null;

  const getStressColor = (level: number) => {
    if (level < 0.3) return '#4CAF50';
    if (level < 0.6) return '#FFC107';
    return '#F44336';
  };

  const getBondingColor = (trend: string) => {
    switch (trend) {
      case 'strengthening': return '#4CAF50';
      case 'stable': return '#2196F3';
      case 'weakening': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <div className="stress-bonding-display">
      <div className="stress-analysis">
        <h3>Stress Analysis</h3>
        <div className="stress-levels">
          <div className="current-stress">
            <h4>Current Stress Level</h4>
            <div className="stress-indicator">
              <div
                className="stress-bar"
                style={{
                  width: `${stressAnalysis.currentStressLevel * 100}%`,
                  backgroundColor: getStressColor(stressAnalysis.currentStressLevel)
                }}
              />
              <span className="stress-value">
                {Math.round(stressAnalysis.currentStressLevel * 100)}%
              </span>
            </div>
          </div>
          <div className="predicted-stress">
            <h4>Predicted Stress Level</h4>
            <div className="stress-indicator">
              <div
                className="stress-bar"
                style={{
                  width: `${stressAnalysis.predictedStressLevel * 100}%`,
                  backgroundColor: getStressColor(stressAnalysis.predictedStressLevel)
                }}
              />
              <span className="stress-value">
                {Math.round(stressAnalysis.predictedStressLevel * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="stress-factors">
          <h4>Stress Factors</h4>
          <div className="factors-grid">
            {Object.entries(stressAnalysis.stressFactors).map(([factor, value]) => (
              <div key={factor} className="factor">
                <label>{factor.charAt(0).toUpperCase() + factor.slice(1)}</label>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${Number(value) * 100}%`,
                      backgroundColor: getStressColor(Number(value))
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mitigation-strategies">
          <h4>Recommended Actions</h4>
          <ul>
            {stressAnalysis.mitigationStrategies.map((strategy: string, index: number) => (
              <li key={index}>{strategy}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bonding-analysis">
        <h3>Social Bonding Analysis</h3>
        <div className="bonding-metrics">
          <div className="trend-indicator" style={{ backgroundColor: getBondingColor(bondingAnalysis.bondingTrend) }}>
            {bondingAnalysis.bondingTrend}
          </div>
          <div className="metrics-grid">
            {Object.entries(bondingAnalysis.metrics).map(([metric, value]) => (
              <div key={metric} className="metric">
                <label>{metric.split(/(?=[A-Z])/).join(' ')}</label>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${Number(value) * 100}%`,
                      backgroundColor: getBondingColor(bondingAnalysis.bondingTrend)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bonding-recommendations">
          <h4>Recommended Actions</h4>
          <ul>
            {bondingAnalysis.recommendedActions.map((action: string, index: number) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}; 