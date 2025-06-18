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

import React, { useState, useEffect } from 'react';
import { TimeHorizon, PredictiveRecommendation } from '../services/PredictiveRecommendationService';
import { EnvironmentalContext, EmotionalAnalysis } from '../types/whale';
import './PredictiveRecommendationDisplay.css';

interface Props {
  environmentalContext: EnvironmentalContext;
  emotionalAnalysis: EmotionalAnalysis;
  stewardId: string;
  updateInterval?: number;
}

export const PredictiveRecommendationDisplay: React.FC<Props> = ({
  environmentalContext,
  emotionalAnalysis,
  stewardId,
  updateInterval = 5000
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<TimeHorizon>(TimeHorizon.IMMEDIATE);
  const [recommendations, setRecommendations] = useState<PredictiveRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual service call
        const mockRecommendations: PredictiveRecommendation[] = [
          {
            id: '1',
            title: 'Monitor Group Stress Levels',
            description: 'Predicted increase in group stress due to environmental changes',
            type: 'emotional',
            priority: 'high',
            confidence: 0.85,
            impact: 0.9,
            timeHorizon: TimeHorizon.IMMEDIATE,
            timeframe: {
              start: new Date(),
              end: new Date(Date.now() + 3600000)
            },
            prediction: {
              metric: 'stressLevel',
              currentValue: 0.6,
              predictedValue: 0.8,
              confidence: 0.85,
              trend: 'increasing',
              confidenceFactors: {
                dataQuality: 0.9,
                modelReliability: 0.85,
                historicalAccuracy: 0.8,
                environmentalStability: 0.75
              }
            },
            factors: [
              {
                name: 'Temperature Change',
                influence: 0.8,
                trend: 'increasing',
                predictedImpact: 0.7,
                confidence: 0.85
              }
            ],
            actions: [
              {
                description: 'Prepare calming activities',
                expectedOutcome: 'Reduced group stress',
                difficulty: 0.3,
                timeToImplement: 15,
                successProbability: 0.85,
                predictedEffectiveness: 0.8,
                optimalTiming: new Date(),
                confidence: 0.85,
                prerequisites: ['Calming music ready', 'Space prepared']
              }
            ],
            groupImpact: {
              immediate: 0.7,
              shortTerm: 0.6,
              longTerm: 0.5,
              predictedStability: 0.8,
              predictedCohesion: 0.75,
              confidence: 0.85
            },
            stewardAdaptation: {
              requiredSkills: ['Stress management', 'Group dynamics'],
              learningResources: ['Stress reduction techniques', 'Group calming exercises'],
              practiceExercises: ['Deep breathing exercises', 'Group meditation'],
              predictedLearningCurve: 0.7,
              confidence: 0.85
            },
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 60000)
          }
        ];
        setRecommendations(mockRecommendations);
        setError(null);
      } catch (err) {
        setError('Failed to fetch recommendations');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
    const interval = setInterval(fetchRecommendations, updateInterval);
    return () => clearInterval(interval);
  }, [environmentalContext, emotionalAnalysis, stewardId, updateInterval]);

  const filteredRecommendations = recommendations.filter(
    rec => rec.timeHorizon === selectedHorizon
  );

  const renderConfidenceIndicator = (confidence: number) => {
    const color = confidence >= 0.8 ? '#4CAF50' : confidence >= 0.6 ? '#FFC107' : '#F44336';
    return (
      <div className="confidence-indicator" style={{ backgroundColor: color }}>
        {Math.round(confidence * 100)}%
      </div>
    );
  };

  const renderTimeHorizonTabs = () => (
    <div className="time-horizon-tabs">
      {Object.values(TimeHorizon).map(horizon => (
        <button
          key={horizon}
          className={`tab ${selectedHorizon === horizon ? 'active' : ''}`}
          onClick={() => setSelectedHorizon(horizon)}
        >
          {horizon.replace('_', ' ')}
        </button>
      ))}
    </div>
  );

  const renderRecommendation = (recommendation: PredictiveRecommendation) => (
    <div key={recommendation.id} className="recommendation-card">
      <div className="recommendation-header">
        <h3>{recommendation.title}</h3>
        {renderConfidenceIndicator(recommendation.confidence)}
      </div>
      
      <p className="description">{recommendation.description}</p>
      
      <div className="prediction-section">
        <h4>Prediction</h4>
        <div className="prediction-details">
          <div className="metric">
            <span>Current:</span> {recommendation.prediction.currentValue}
          </div>
          <div className="metric">
            <span>Predicted:</span> {recommendation.prediction.predictedValue}
          </div>
          <div className="trend">
            <span>Trend:</span> {recommendation.prediction.trend}
          </div>
        </div>
        
        <div className="confidence-factors">
          <h5>Confidence Factors</h5>
          <div className="factors-grid">
            {Object.entries(recommendation.prediction.confidenceFactors).map(([factor, value]: [string, number]) => (
              <div key={factor} className="factor">
                <span>{factor}:</span> {Math.round(value * 100)}%
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="actions-section">
        <h4>Recommended Actions</h4>
        {recommendation.actions.map((action: PredictiveRecommendation['actions'][0], index: number) => (
          <div key={index} className="action-item">
            <div className="action-header">
              <h5>{action.description}</h5>
              {renderConfidenceIndicator(action.confidence)}
            </div>
            <p>Expected Outcome: {action.expectedOutcome}</p>
            <div className="action-metrics">
              <div>Difficulty: {action.difficulty * 100}%</div>
              <div>Time to Implement: {action.timeToImplement} minutes</div>
              <div>Success Probability: {action.successProbability * 100}%</div>
            </div>
            {action.prerequisites.length > 0 && (
              <div className="prerequisites">
                <h6>Prerequisites:</h6>
                <ul>
                  {action.prerequisites.map((prereq: string, i: number) => (
                    <li key={i}>{prereq}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="steward-adaptation">
        <h4>Steward Adaptation</h4>
        <div className="skills-section">
          <h5>Required Skills</h5>
          <ul>
            {recommendation.stewardAdaptation.requiredSkills.map((skill: string, i: number) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>
        <div className="resources-section">
          <h5>Learning Resources</h5>
          <ul>
            {recommendation.stewardAdaptation.learningResources.map((resource: string, i: number) => (
              <li key={i}>{resource}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="predictive-recommendation-display">
      <h2>Predictive Recommendations</h2>
      {renderTimeHorizonTabs()}
      <div className="recommendations-container">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map(renderRecommendation)
        ) : (
          <div className="no-recommendations">
            No recommendations available for the selected time horizon.
          </div>
        )}
      </div>
    </div>
  );
}; 