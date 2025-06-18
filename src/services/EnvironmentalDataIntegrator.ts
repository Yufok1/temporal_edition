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

import { WaterConditions, WhaleSignal, WhaleEnvironmentalContext } from '../types/whale';

export class EnvironmentalDataIntegrator {
    private currentData: WaterConditions;
    private history: WhaleEnvironmentalContext[] = [];

    constructor() {
        this.currentData = {
            temperature: 20,
            salinity: 35,
            pressure: 1,
            current: 0.5,
            visibility: 15,
            lightLevel: 0.7
        };
    }

    public getCurrentData(): WaterConditions {
        return this.currentData;
    }

    public updateData(data: Partial<WaterConditions>): void {
        this.currentData = { ...this.currentData, ...data };
    }

    public getTemperature(): number {
        return this.currentData.temperature;
    }

    public getCurrent(): number {
        return this.currentData.current;
    }

    public getVisibility(): number {
        return this.currentData.visibility;
    }

    public processSignal(signal: WhaleSignal): void {
        const environmentalContext: WhaleEnvironmentalContext = {
            waterConditions: this.currentData,
            spatialContext: {
                depth: 20,
                location: 'unknown',
                proximityToGroup: 50,
                proximityToSteward: 30
            },
            temporalContext: {
                timeOfDay: new Date().toLocaleTimeString(),
                season: this.getCurrentSeason(),
                duration: 0,
                frequency: 0
            },
            socialContext: {
                groupSize: 1,
                groupComposition: 'unknown',
                interactionIntensity: 0.5,
                socialHierarchy: 'unknown'
            }
        };

        this.history.push(environmentalContext);
    }

    private getCurrentSeason(): string {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    public getEnvironmentalScore(): number {
        const { temperature, current, visibility } = this.currentData;
        
        const temperatureScore = this.calculateTemperatureScore(temperature);
        const currentScore = this.calculateCurrentScore(current);
        const visibilityScore = this.calculateVisibilityScore(visibility);

        return (temperatureScore + currentScore + visibilityScore) / 3;
    }

    private calculateTemperatureScore(temperature: number): number {
        const optimalRange = { min: 15, max: 25 };
        if (temperature >= optimalRange.min && temperature <= optimalRange.max) {
            return 1;
        }
        return 1 - Math.min(
            Math.abs(temperature - optimalRange.min),
            Math.abs(temperature - optimalRange.max)
        ) / 10;
    }

    private calculateCurrentScore(current: number): number {
        return Math.min(Math.max(1 - current / 5, 0), 1);
    }

    private calculateVisibilityScore(visibility: number): number {
        return Math.min(Math.max(visibility / 20, 0), 1);
    }
} 