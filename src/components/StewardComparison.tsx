import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { StewardPerformanceMetrics } from '../types/steward';
import './StewardComparison.css';

interface StewardComparisonProps {
    stewardMetrics: StewardPerformanceMetrics;
    groupMetrics: StewardPerformanceMetrics;
    onLearningPathSelect: (path: string) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const StewardComparison: React.FC<StewardComparisonProps> = ({
    stewardMetrics,
    groupMetrics,
    onLearningPathSelect
}) => {
    const [selectedMetric, setSelectedMetric] = useState<string>('emotionalIntelligence');
    const [comparisonType, setComparisonType] = useState<'bar' | 'pie'>('bar');

    const getComparisonData = () => {
        return [
            {
                name: 'Emotional Intelligence',
                steward: stewardMetrics.averageEmotionalIntelligence,
                group: groupMetrics.averageEmotionalIntelligence
            },
            {
                name: 'Cultural Sensitivity',
                steward: stewardMetrics.averageCulturalSensitivity,
                group: groupMetrics.averageCulturalSensitivity
            },
            {
                name: 'Communication',
                steward: stewardMetrics.averageCommunicationEffectiveness,
                group: groupMetrics.averageCommunicationEffectiveness
            },
            {
                name: 'Adaptability',
                steward: stewardMetrics.averageAdaptability,
                group: groupMetrics.averageAdaptability
            },
            {
                name: 'Empathy',
                steward: stewardMetrics.averageEmpathy,
                group: groupMetrics.averageEmpathy
            },
            {
                name: 'Patience',
                steward: stewardMetrics.averagePatience,
                group: groupMetrics.averagePatience
            },
            {
                name: 'Clarity',
                steward: stewardMetrics.averageClarity,
                group: groupMetrics.averageClarity
            }
        ];
    };

    const getLearningPaths = () => {
        const paths: Array<{
            metric: string;
            currentValue: number;
            targetValue: number;
            improvement: number;
            unit: string;
        }> = [];
        const metrics = getComparisonData();

        metrics.forEach(metric => {
            const difference = metric.steward - metric.group;
            if (difference < -10) {
                paths.push({
                    name: metric.name,
                    priority: 'high',
                    description: `Focus on improving ${metric.name.toLowerCase()} through targeted exercises and practice.`
                });
            } else if (difference < 0) {
                paths.push({
                    name: metric.name,
                    priority: 'medium',
                    description: `Continue developing ${metric.name.toLowerCase()} with regular practice.`
                });
            }
        });

        return paths;
    };

    const renderComparisonChart = () => {
        const data = getComparisonData();

        if (comparisonType === 'bar') {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="steward" name="Your Performance" fill="#8884d8" />
                        <Bar dataKey="group" name="Group Average" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            );
        } else {
            const pieData = [
                { name: 'Above Average', value: data.filter(d => d.steward > d.group).length },
                { name: 'At Average', value: data.filter(d => d.steward === d.group).length },
                { name: 'Below Average', value: data.filter(d => d.steward < d.group).length }
            ];

            return (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            );
        }
    };

    return (
        <div className="steward-comparison">
            <div className="comparison-header">
                <h2>Performance Comparison</h2>
                <div className="comparison-controls">
                    <select
                        value={comparisonType}
                        onChange={(e) => setComparisonType(e.target.value as 'bar' | 'pie')}
                    >
                        <option value="bar">Bar Chart</option>
                        <option value="pie">Pie Chart</option>
                    </select>
                </div>
            </div>

            <div className="comparison-chart">
                {renderComparisonChart()}
            </div>

            <div className="learning-paths">
                <h3>Recommended Learning Paths</h3>
                <div className="paths-grid">
                    {getLearningPaths().map((path, index) => (
                        <div
                            key={index}
                            className={`path-card ${path.priority}`}
                            onClick={() => onLearningPathSelect(path.name)}
                        >
                            <h4>{path.name}</h4>
                            <p>{path.description}</p>
                            <div className="path-priority">{path.priority.toUpperCase()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 