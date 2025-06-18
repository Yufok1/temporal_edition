import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { StewardPerformanceMetrics, PerformanceTrend } from '../types/steward';
import './StewardPerformanceDashboard.css';

interface StewardPerformanceDashboardProps {
    stewardID: string;
    metrics: StewardPerformanceMetrics;
    onTimeRangeChange?: (range: string) => void;
}

export const StewardPerformanceDashboard: React.FC<StewardPerformanceDashboardProps> = ({
    stewardID,
    metrics,
    onTimeRangeChange
}) => {
    const [selectedMetric, setSelectedMetric] = useState<string>('emotionalIntelligence');
    const [timeRange, setTimeRange] = useState<string>('week');

    const handleTimeRangeChange = (range: string) => {
        setTimeRange(range);
        onTimeRangeChange?.(range);
    };

    const getRadarData = () => {
        return [
            { metric: 'Emotional Intelligence', value: metrics.averageEmotionalIntelligence },
            { metric: 'Cultural Sensitivity', value: metrics.averageCulturalSensitivity },
            { metric: 'Communication', value: metrics.averageCommunicationEffectiveness },
            { metric: 'Adaptability', value: metrics.averageAdaptability },
            { metric: 'Empathy', value: metrics.averageEmpathy },
            { metric: 'Patience', value: metrics.averagePatience },
            { metric: 'Clarity', value: metrics.averageClarity }
        ];
    };

    const getTrendData = (metric: string) => {
        const trend = metrics.performanceTrends.find(t => t.metric === metric);
        if (!trend) return [];

        return trend.values.map((value, index) => ({
            timestamp: trend.timestamps[index],
            value: value
        }));
    };

    return (
        <div className="steward-performance-dashboard">
            <div className="dashboard-header">
                <h2>Steward Performance Dashboard</h2>
                <div className="time-range-selector">
                    <button
                        className={timeRange === 'week' ? 'active' : ''}
                        onClick={() => handleTimeRangeChange('week')}
                    >
                        Week
                    </button>
                    <button
                        className={timeRange === 'month' ? 'active' : ''}
                        onClick={() => handleTimeRangeChange('month')}
                    >
                        Month
                    </button>
                    <button
                        className={timeRange === 'year' ? 'active' : ''}
                        onClick={() => handleTimeRangeChange('year')}
                    >
                        Year
                    </button>
                </div>
            </div>

            <div className="metrics-overview">
                <div className="metric-card">
                    <h3>Success Rate</h3>
                    <div className="metric-value">{metrics.successRate.toFixed(1)}%</div>
                </div>
                <div className="metric-card">
                    <h3>Improvement Rate</h3>
                    <div className="metric-value">{metrics.improvementRate.toFixed(1)}%</div>
                </div>
                <div className="metric-card">
                    <h3>Whale Engagement</h3>
                    <div className="metric-value">{metrics.whaleEngagementScore.toFixed(1)}%</div>
                </div>
            </div>

            <div className="charts-container">
                <div className="radar-chart">
                    <h3>Capability Assessment</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={getRadarData()}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="metric" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar
                                name="Capabilities"
                                dataKey="value"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div className="trend-chart">
                    <h3>Performance Trends</h3>
                    <div className="metric-selector">
                        <select
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value)}
                        >
                            <option value="emotionalIntelligence">Emotional Intelligence</option>
                            <option value="culturalSensitivity">Cultural Sensitivity</option>
                            <option value="communicationEffectiveness">Communication</option>
                            <option value="adaptability">Adaptability</option>
                            <option value="empathy">Empathy</option>
                            <option value="patience">Patience</option>
                            <option value="clarity">Clarity</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={getTrendData(selectedMetric)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                            />
                            <YAxis domain={[0, 100]} />
                            <Tooltip
                                labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="improvement-suggestions">
                <h3>Areas for Improvement</h3>
                {metrics.performanceTrends
                    .filter(trend => trend.trend === 'declining')
                    .map(trend => (
                        <div key={trend.metric} className="improvement-card">
                            <h4>{trend.metric}</h4>
                            <p>Trend: {trend.trend}</p>
                            <p>Confidence: {(trend.confidence * 100).toFixed(1)}%</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}; 