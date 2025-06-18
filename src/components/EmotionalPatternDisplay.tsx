import React, { useEffect, useState } from 'react';
import { EmotionalAnalysis, EnvironmentalContext } from '../types/whale';
import { EmotionalPatternAnalysisService } from '../services/EmotionalPatternAnalysisService';
import './EmotionalPatternDisplay.css';

interface Props {
  emotionalAnalysis: EmotionalAnalysis;
  environmentalContext: EnvironmentalContext;
  updateInterval?: number;
}

export const EmotionalPatternDisplay: React.FC<Props> = ({
  emotionalAnalysis,
  environmentalContext,
  updateInterval = 5000 // Default to 5 seconds
}) => {
  const [patternAnalysis, setPatternAnalysis] = useState<any>(null);
  const patternAnalysisService = new EmotionalPatternAnalysisService();

  useEffect(() => {
    const analyzePatterns = () => {
      const analysis = patternAnalysisService.analyzePatterns(
        emotionalAnalysis,
        environmentalContext
      );
      setPatternAnalysis(analysis);
    };

    // Initial analysis
    analyzePatterns();

    // Set up periodic updates
    const intervalId = setInterval(analyzePatterns, updateInterval);

    return () => clearInterval(intervalId);
  }, [emotionalAnalysis, environmentalContext, updateInterval]);

  if (!patternAnalysis) return null;

  const getTrendColor = (direction: string) => {
    const colorMap: { [key: string]: string } = {
      increasing: '#4CAF50',
      decreasing: '#F44336',
      stable: '#2196F3',
      oscillating: '#FFC107'
    };
    return colorMap[direction] || '#757575';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: { [key: string]: string } = {
      high: '#F44336',
      medium: '#FFC107',
      low: '#4CAF50'
    };
    return colorMap[priority] || '#757575';
  };

  return (
    <div className="emotional-pattern-display">
      <h2>Emotional Pattern Analysis</h2>

      <div className="pattern-section">
        <h3>Current Pattern</h3>
        <div className="pattern-details">
          <div className="pattern-info">
            <span className="pattern-type">{patternAnalysis.currentPattern.pattern}</span>
            <div className="confidence-bar">
              <div 
                className="confidence-fill"
                style={{ width: `${patternAnalysis.currentPattern.confidence * 100}%` }}
              />
            </div>
            <span className="confidence-value">
              {Math.round(patternAnalysis.currentPattern.confidence * 100)}% Confidence
            </span>
          </div>
          <div className="pattern-triggers">
            <h4>Triggers</h4>
            {patternAnalysis.currentPattern.triggers.map((trigger: string, index: number) => (
              <span key={index} className="trigger-tag">
                {trigger}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="trends-section">
        <h3>Emotional Trends</h3>
        <div className="trends-grid">
          {patternAnalysis.trends.map((trend: any, index: number) => (
            <div key={index} className="trend-card">
              <div 
                className="trend-indicator"
                style={{ backgroundColor: getTrendColor(trend.direction) }}
              >
                {trend.direction}
              </div>
              <div className="trend-metrics">
                <div className="metric">
                  <label>Magnitude</label>
                  <div className="progress-bar">
                    <div 
                      className="progress"
                      style={{ width: `${trend.magnitude * 100}%` }}
                    />
                  </div>
                </div>
                <div className="metric">
                  <label>Stability</label>
                  <div className="progress-bar">
                    <div 
                      className="progress"
                      style={{ width: `${trend.stability * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="predictions-section">
        <h3>Predictions</h3>
        <div className="prediction-card">
          <div className="prediction-header">
            <span className="next-emotion">
              Next: {patternAnalysis.predictions.nextEmotion}
            </span>
            <span className="confidence">
              {Math.round(patternAnalysis.predictions.confidence * 100)}% Confidence
            </span>
          </div>
          <div className="time-to-change">
            Time to Change: {Math.round(patternAnalysis.predictions.timeToChange / 60)} minutes
          </div>
        </div>
      </div>

      <div className="recommendations-section">
        <h3>Recommendations</h3>
        <div className="recommendations-list">
          {patternAnalysis.recommendations.map((rec: any, index: number) => (
            <div 
              key={index}
              className="recommendation-card"
              style={{ borderLeftColor: getPriorityColor(rec.priority) }}
            >
              <div className="recommendation-header">
                <span className="priority" style={{ color: getPriorityColor(rec.priority) }}>
                  {rec.priority.toUpperCase()}
                </span>
                <span className="impact">
                  Impact: {Math.round(rec.impact * 100)}%
                </span>
              </div>
              <p className="action">{rec.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 