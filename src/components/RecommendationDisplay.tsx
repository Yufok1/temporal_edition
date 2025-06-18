import React, { useEffect, useState } from 'react';
import { EnvironmentalContext, EmotionalAnalysis } from '../types/whale';
import { AdvancedRecommendationService } from '../services/AdvancedRecommendationService';
import { MachineLearningService } from '../services/MachineLearningService';
import './RecommendationDisplay.css';

interface Props {
  environmentalContext: EnvironmentalContext;
  emotionalAnalysis: EmotionalAnalysis;
  stewardId: string;
  updateInterval?: number;
}

export const RecommendationDisplay: React.FC<Props> = ({
  environmentalContext,
  emotionalAnalysis,
  stewardId,
  updateInterval = 5000
}) => {
  const [recommendationService] = useState(() => new AdvancedRecommendationService());
  const [mlService] = useState(() => new MachineLearningService());
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'immediate' | 'shortTerm' | 'longTerm'>('immediate');

  useEffect(() => {
    const processData = () => {
      mlService.addDataPoint(environmentalContext, emotionalAnalysis);

      try {
        // Generate predictions for all metrics
        const predictions = new Map();
        ['temperature', 'salinity', 'pressure', 'groupSize'].forEach(metric => {
          try {
            const prediction = mlService.generatePrediction(metric);
            predictions.set(metric, prediction);
          } catch (error) {
            console.warn(`Failed to generate prediction for ${metric}:`, error);
          }
        });

        // Generate advanced recommendations
        const newRecommendations = recommendationService.generateAdvancedRecommendations({
          environmentalContext,
          emotionalAnalysis,
          predictions,
          historicalTrends: [], // TODO: Implement historical trend analysis
          stewardProfile: {
            id: stewardId,
            experience: 75, // TODO: Get from steward profile
            successRate: 85, // TODO: Get from steward profile
            preferredApproaches: ['environmental', 'emotional'],
            learningStyle: 'visual',
            adaptationSpeed: 0.8
          },
          groupDynamics: {
            stability: 0.85,
            cohesion: 0.75,
            individualStatus: new Map()
          }
        });

        setRecommendations(newRecommendations);
      } catch (error) {
        console.warn('Recommendation generation failed:', error);
      }
    };

    processData();
    const interval = setInterval(processData, updateInterval);
    return () => clearInterval(interval);
  }, [environmentalContext, emotionalAnalysis, stewardId, updateInterval]);

  const getPriorityColor = (priority: string): string => {
    const colorMap: { [key: string]: string } = {
      high: '#f44336',
      medium: '#ff9800',
      low: '#4caf50'
    };
    return colorMap[priority] || '#9e9e9e';
  };

  const getTypeIcon = (type: string): string => {
    const iconMap: { [key: string]: string } = {
      environmental: '🌊',
      social: '🐋',
      behavioral: '🎯',
      emotional: '❤️'
    };
    return iconMap[type] || '📊';
  };

  const getTimeframeImpact = (recommendation: any): number => {
    return recommendation.groupImpact[selectedTimeframe];
  };

  const filteredRecommendations = recommendations
    .filter(rec => selectedPriority === 'all' || rec.priority === selectedPriority)
    .sort((a, b) => getTimeframeImpact(b) - getTimeframeImpact(a));

  return (
    <div className="recommendation-display">
      <div className="recommendation-header">
        <h3>Intelligent Recommendations</h3>
        <div className="filters">
          <div className="priority-filter">
            <label>Filter by Priority: </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          <div className="timeframe-filter">
            <label>Impact Timeframe: </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            >
              <option value="immediate">Immediate</option>
              <option value="shortTerm">Short Term</option>
              <option value="longTerm">Long Term</option>
            </select>
          </div>
        </div>
      </div>

      <div className="recommendations-grid">
        {filteredRecommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="recommendation-card"
            style={{ borderColor: getPriorityColor(recommendation.priority) }}
          >
            <div className="recommendation-header">
              <span className="type-icon">{getTypeIcon(recommendation.type)}</span>
              <span className="priority-badge" style={{ backgroundColor: getPriorityColor(recommendation.priority) }}>
                {recommendation.priority}
              </span>
            </div>

            <h4>{recommendation.title}</h4>
            <p className="description">{recommendation.description}</p>

            <div className="metrics">
              <div className="metric">
                <span className="label">Impact:</span>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${recommendation.impact * 100}%`,
                      backgroundColor: getPriorityColor(recommendation.priority)
                    }}
                  />
                </div>
              </div>
              <div className="metric">
                <span className="label">Confidence:</span>
                <span className="value">{(recommendation.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="group-impact">
              <h5>Group Impact</h5>
              <div className="impact-timeline">
                <div className="impact-point">
                  <span className="label">Immediate</span>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${recommendation.groupImpact.immediate * 100}%`,
                        backgroundColor: '#f44336'
                      }}
                    />
                  </div>
                </div>
                <div className="impact-point">
                  <span className="label">Short Term</span>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${recommendation.groupImpact.shortTerm * 100}%`,
                        backgroundColor: '#ff9800'
                      }}
                    />
                  </div>
                </div>
                <div className="impact-point">
                  <span className="label">Long Term</span>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${recommendation.groupImpact.longTerm * 100}%`,
                        backgroundColor: '#4caf50'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {recommendation.factors.length > 0 && (
              <div className="factors">
                <h5>Influencing Factors</h5>
                <div className="factors-list">
                  {recommendation.factors.map((factor: any, index: number) => (
                    <div key={index} className="factor">
                      <span className="factor-name">{factor.name}</span>
                      <span className={`factor-influence ${factor.influence > 0 ? 'positive' : 'negative'}`}>
                        {factor.influence > 0 ? '+' : ''}{factor.influence.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendation.actions.length > 0 && (
              <div className="actions">
                <h5>Recommended Actions</h5>
                <ul>
                  {recommendation.actions.map((action: any, index: number) => (
                    <li key={index}>
                      <div className="action-header">
                        <span className="action-description">{action.description}</span>
                        <span className="action-difficulty" style={{ color: getPriorityColor(action.difficulty > 0.7 ? 'high' : action.difficulty > 0.4 ? 'medium' : 'low') }}>
                          Difficulty: {(action.difficulty * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="action-details">
                        <span className="action-outcome">Expected: {action.expectedOutcome}</span>
                        <span className="action-time">Time: {action.timeToImplement.toFixed(0)} min</span>
                        <span className="action-probability">Success: {(action.successProbability * 100).toFixed(0)}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendation.stewardAdaptation && (
              <div className="steward-adaptation">
                <h5>Steward Adaptation</h5>
                <div className="adaptation-section">
                  <h6>Required Skills</h6>
                  <ul>
                    {recommendation.stewardAdaptation.requiredSkills.map((skill: string, index: number) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="adaptation-section">
                  <h6>Learning Resources</h6>
                  <ul>
                    {recommendation.stewardAdaptation.learningResources.map((resource: string, index: number) => (
                      <li key={index}>{resource}</li>
                    ))}
                  </ul>
                </div>
                <div className="adaptation-section">
                  <h6>Practice Exercises</h6>
                  <ul>
                    {recommendation.stewardAdaptation.practiceExercises.map((exercise: string, index: number) => (
                      <li key={index}>{exercise}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="timeframe">
              <span className="label">Timeframe:</span>
              <span className="value">
                {new Date(recommendation.timeframe.start).toLocaleTimeString()} -{' '}
                {new Date(recommendation.timeframe.end).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 