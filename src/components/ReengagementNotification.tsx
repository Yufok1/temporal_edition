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
import { EmotionalTone } from '../types/translation';
import './ReengagementNotification.css';

interface ReengagementNotificationProps {
    isReady: boolean;
    emotionalState: EmotionalTone;
    onReengage: () => void;
    onDismiss: () => void;
}

export const ReengagementNotification: React.FC<ReengagementNotificationProps> = ({
    isReady,
    emotionalState,
    onReengage,
    onDismiss
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [animationState, setAnimationState] = useState<'entering' | 'visible' | 'exiting'>('entering');

    useEffect(() => {
        if (isReady) {
            setIsVisible(true);
            setAnimationState('entering');
            const timer = setTimeout(() => {
                setAnimationState('visible');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isReady]);

    const handleDismiss = () => {
        setAnimationState('exiting');
        setTimeout(() => {
            setIsVisible(false);
            onDismiss();
        }, 300);
    };

    const getEmotionalToneColor = (tone: EmotionalTone): string => {
        const toneColors: Record<EmotionalTone, string> = {
            peaceful: '#4CAF50',
            joyful: '#FFC107',
            contemplative: '#2196F3',
            curious: '#9C27B0',
            playful: '#FF9800',
            distressed: '#F44336',
            mating: '#E91E63',
            migratory: '#00BCD4',
            teaching: '#673AB7',
            learning: '#3F51B5',
            social: '#009688',
            spiritual: '#795548',
            alerting: '#FF5722',
            encouraging: '#8BC34A'
        };
        return toneColors[tone] || '#757575';
    };

    const getEmotionalMessage = (tone: EmotionalTone): string => {
        const messages: Record<EmotionalTone, string> = {
            peaceful: 'The whale appears calm and ready to reengage.',
            joyful: 'The whale is showing signs of excitement and readiness.',
            contemplative: 'The whale seems thoughtful and receptive to interaction.',
            curious: 'The whale is showing interest in reconnecting.',
            playful: 'The whale is displaying playful behavior, ready for interaction.',
            distressed: 'The whale may need gentle reassurance before reengaging.',
            mating: 'The whale is in a social mood, open to communication.',
            migratory: 'The whale is in a transitional state, may be receptive.',
            teaching: 'The whale is in a sharing mood, ready to interact.',
            learning: 'The whale is in an attentive state, ready to engage.',
            social: 'The whale is showing social behavior, open to connection.',
            spiritual: 'The whale is in a reflective state, receptive to deep interaction.',
            alerting: 'The whale is showing heightened awareness, ready to engage.',
            encouraging: 'The whale is displaying positive energy, ready to connect.'
        };
        return messages[tone] || 'The whale is ready to reengage.';
    };

    if (!isVisible) return null;

    return (
        <div className={`reengagement-notification ${animationState}`}>
            <div className="notification-content">
                <div className="emotional-indicator">
                    <div 
                        className="indicator-dot"
                        style={{ backgroundColor: getEmotionalToneColor(emotionalState) }}
                    />
                    <span className="emotional-state">
                        {emotionalState.charAt(0).toUpperCase() + emotionalState.slice(1)}
                    </span>
                </div>
                <p className="message">{getEmotionalMessage(emotionalState)}</p>
                <div className="actions">
                    <button 
                        className="reengage-button"
                        onClick={onReengage}
                    >
                        Reengage Now
                    </button>
                    <button 
                        className="dismiss-button"
                        onClick={handleDismiss}
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}; 