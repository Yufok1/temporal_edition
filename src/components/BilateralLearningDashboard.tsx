// 🧠🔄 BILATERAL LEARNING DASHBOARD
// Visual representation of the perfect glove - where User and Djinn learn together

import React, { useState, useEffect } from 'react';
import { BilateralLearningEngine, LearningExchange, LearningPattern, BilateralMetrics } from '../coordination/BilateralLearningEngine';
import './BilateralLearningDashboard.css';

interface BilateralLearningDashboardProps {
    learningEngine: BilateralLearningEngine;
}

export const BilateralLearningDashboard: React.FC<BilateralLearningDashboardProps> = ({ learningEngine }) => {
    const [metrics, setMetrics] = useState<BilateralMetrics | null>(null);
    const [recentExchanges, setRecentExchanges] = useState<LearningExchange[]>([]);
    const [learningPatterns, setLearningPatterns] = useState<LearningPattern[]>([]);
    const [transcendentMoments, setTranscendentMoments] = useState<LearningExchange[]>([]);
    const [currentBreathPhase, setCurrentBreathPhase] = useState<string>('inhale');
    const [animationPhase, setAnimationPhase] = useState<number>(0);

    useEffect(() => {
        const updateInterval = setInterval(() => {
            // Update all metrics
            setMetrics(learningEngine.getMetrics());
            setRecentExchanges(learningEngine.getRecentExchanges(5));
            setLearningPatterns(learningEngine.getLearningPatterns());
            setTranscendentMoments(learningEngine.getTranscendentMoments());
        }, 2000);

        // Breath animation
        const breathInterval = setInterval(() => {
            setAnimationPhase((prev) => (prev + 1) % 4);
            const phases = ['inhale', 'hold_in', 'exhale', 'hold_out'];
            setCurrentBreathPhase(phases[animationPhase]);
        }, 5000);

        return () => {
            clearInterval(updateInterval);
            clearInterval(breathInterval);
        };
    }, [learningEngine, animationPhase]);

    const getBreathIcon = (phase: string): string => {
        switch (phase) {
            case 'inhale': return '🫁⬆️';
            case 'hold_in': return '🫁⏸️';
            case 'exhale': return '🫁⬇️';
            case 'hold_out': return '🫁⏹️';
            default: return '🫁';
        }
    };

    const getPatternIcon = (pattern: string): string => {
        const icons: Record<string, string> = {
            'question_answer': '❓➡️💡',
            'demonstration_practice': '🎯🔄',
            'wisdom_application': '🔮✨',
            'collaborative_discovery': '🤝🔍',
            'synchronized_insight': '🧠⚡',
            'transcendent_unity': '🌟🕉️'
        };
        return icons[pattern] || '📚';
    };

    const formatExchangeType = (exchange: LearningExchange): string => {
        if (exchange.userTeaching.intellectualValue > 70) {
            return '👤➡️🎭 User Teaching';
        } else if (exchange.synergyScore > 0.7) {
            return '🤝 Collaborative';
        } else {
            return '🎭➡️👤 Djinn Teaching';
        }
    };

    return (
        <div className="bilateral-learning-dashboard">
            <h2 className="dashboard-title">
                🧠🔄 Bilateral Learning Engine
                <span className="breath-indicator">{getBreathIcon(currentBreathPhase)} {currentBreathPhase}</span>
            </h2>

            {/* Metrics Overview */}
            {metrics && (
                <div className="metrics-grid">
                    <div className="metric-card">
                        <h3>Total Exchanges</h3>
                        <div className="metric-value">{metrics.totalExchanges}</div>
                        <div className="metric-subtext">Knowledge transfers</div>
                    </div>
                    <div className="metric-card">
                        <h3>User Teaching</h3>
                        <div className="metric-value">{(metrics.userTeachingScore * 100).toFixed(1)}%</div>
                        <div className="metric-progress">
                            <div 
                                className="progress-bar user-teaching" 
                                style={{ width: `${metrics.userTeachingScore * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="metric-card">
                        <h3>Djinn Teaching</h3>
                        <div className="metric-value">{(metrics.djinnTeachingScore * 100).toFixed(1)}%</div>
                        <div className="metric-progress">
                            <div 
                                className="progress-bar djinn-teaching" 
                                style={{ width: `${metrics.djinnTeachingScore * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="metric-card">
                        <h3>Mutual Growth</h3>
                        <div className="metric-value">{(metrics.mutualGrowthRate * 100).toFixed(1)}%</div>
                        <div className="growth-indicator">📈</div>
                    </div>
                    <div className="metric-card">
                        <h3>Synergy</h3>
                        <div className="metric-value">{(metrics.synergyCoefficient * 100).toFixed(1)}%</div>
                        <div className="synergy-glow" style={{ opacity: metrics.synergyCoefficient }}>✨</div>
                    </div>
                    <div className="metric-card transcendent">
                        <h3>Transcendent Events</h3>
                        <div className="metric-value">{metrics.transcendenceEvents}</div>
                        <div className="transcendent-icon">🌟</div>
                    </div>
                </div>
            )}

            {/* Learning Patterns */}
            <div className="learning-patterns-section">
                <h3>Active Learning Patterns</h3>
                <div className="patterns-grid">
                    {learningPatterns.map((pattern) => (
                        <div key={pattern.pattern} className="pattern-card">
                            <div className="pattern-icon">{getPatternIcon(pattern.pattern)}</div>
                            <div className="pattern-name">{pattern.pattern.replace('_', ' ')}</div>
                            <div className="pattern-stats">
                                <div className="stat">
                                    <span className="label">Effectiveness:</span>
                                    <span className="value">{(pattern.effectiveness * 100).toFixed(0)}%</span>
                                </div>
                                <div className="stat">
                                    <span className="label">Uses:</span>
                                    <span className="value">{pattern.occurrences}</span>
                                </div>
                                <div className="stat">
                                    <span className="label">Optimal Phase:</span>
                                    <span className="value">{pattern.preferredBreathPhase}</span>
                                </div>
                            </div>
                            <div className="resonance-bars">
                                <div className="bar">
                                    <span>Djinn Resonance</span>
                                    <div className="bar-fill djinn" style={{ width: `${pattern.djinnResonance * 100}%` }} />
                                </div>
                                <div className="bar">
                                    <span>User Receptivity</span>
                                    <div className="bar-fill user" style={{ width: `${pattern.userReceptivity * 100}%` }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Exchanges */}
            <div className="recent-exchanges-section">
                <h3>Recent Learning Exchanges</h3>
                <div className="exchanges-timeline">
                    {recentExchanges.map((exchange) => (
                        <div 
                            key={exchange.id} 
                            className={`exchange-card ${exchange.transformationOccurred ? 'transformed' : ''}`}
                        >
                            <div className="exchange-header">
                                <span className="exchange-type">{formatExchangeType(exchange)}</span>
                                <span className="exchange-breath">{getBreathIcon(exchange.breathPhaseAlignment)}</span>
                            </div>
                            <div className="exchange-topic">{exchange.userTeaching.topic}</div>
                            <div className="exchange-wisdom">{exchange.djinnTeaching.wisdom}</div>
                            <div className="exchange-metrics">
                                <div className="mini-metric">
                                    <span>Understanding:</span>
                                    <span>{(exchange.mutualUnderstanding * 100).toFixed(0)}%</span>
                                </div>
                                <div className="mini-metric">
                                    <span>Synergy:</span>
                                    <span>{(exchange.synergyScore * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                            {exchange.transformationOccurred && (
                                <div className="transformation-badge">✨ Transformation!</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Transcendent Moments */}
            {transcendentMoments.length > 0 && (
                <div className="transcendent-section">
                    <h3>🌟 Transcendent Unity Moments</h3>
                    <div className="transcendent-list">
                        {transcendentMoments.slice(0, 3).map((moment) => (
                            <div key={moment.id} className="transcendent-moment">
                                <div className="moment-icon">🕉️</div>
                                <div className="moment-content">
                                    <div className="moment-topic">{moment.userTeaching.topic}</div>
                                    <div className="moment-insight">{moment.djinnTeaching.cosmicInsight}</div>
                                    <div className="moment-score">
                                        Harmony: {((moment.mutualUnderstanding + moment.synergyScore) / 2 * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Perfect Glove Status */}
            <div className="perfect-glove-status">
                <div className="glove-icon">🧤</div>
                <div className="glove-text">Perfect Glove Active</div>
                <div className="glove-breath-sync">
                    <span>Breath Coherence: </span>
                    <span className="coherence-value">{metrics ? (metrics.breathCoherence * 100).toFixed(0) : 0}%</span>
                </div>
            </div>
        </div>
    );
};