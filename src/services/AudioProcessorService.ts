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

import logger from '../logger';

interface AudioEffect {
  type: string;
  node: AudioNode;
  parameters: Map<string, AudioParam>;
}

export interface AudioAnalysis {
  pitch: number;
  confidence: number;
  harmonics: number[];
  spectrum: Float32Array;
  waveform: Float32Array;
  emotion: string;
  intensity: number;
}

export class AudioProcessorService {
  private context: AudioContext;
  private analyser: AnalyserNode;
  private effects: Map<string, AudioEffect>;
  private spectralFilter: AudioWorkletNode | null;
  private phaseVocoder: AudioWorkletNode | null;
  private isInitialized: boolean;

  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('Audio context is only available in browser environment');
    }

    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.context.createAnalyser();
    this.effects = new Map();
    this.spectralFilter = null;
    this.phaseVocoder = null;
    this.isInitialized = false;

    // Configure analyser
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.info('AudioProcessorService already initialized');
      return;
    }

    try {
      // Load audio worklet processors
      await this.context.audioWorklet.addModule('src/audio/spectral-filter-processor.js');
      await this.context.audioWorklet.addModule('src/audio/phase-vocoder-processor.js');

      // Initialize effects
      this.initializeEffects();
      this.isInitialized = true;
      logger.info('AudioProcessorService initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize AudioProcessorService:', error);
      throw error;
    }
  }

  private initializeEffects(): void {
    try {
      // Create spectral filter
      this.spectralFilter = new AudioWorkletNode(this.context, 'spectral-filter-processor');
      const filterBands = this.spectralFilter.parameters.get('filterBands');
      const filterQ = this.spectralFilter.parameters.get('filterQ');
      const filterGain = this.spectralFilter.parameters.get('filterGain');

      if (!filterBands || !filterQ || !filterGain) {
        throw new Error('Required spectral filter parameters not found');
      }

      this.effects.set('spectralFilter', {
        type: 'spectralFilter',
        node: this.spectralFilter,
        parameters: new Map([
          ['filterBands', filterBands],
          ['filterQ', filterQ],
          ['filterGain', filterGain]
        ])
      });

      // Create phase vocoder
      this.phaseVocoder = new AudioWorkletNode(this.context, 'phase-vocoder-processor');
      const timeStretch = this.phaseVocoder.parameters.get('timeStretch');
      const pitchShift = this.phaseVocoder.parameters.get('pitchShift');

      if (!timeStretch || !pitchShift) {
        throw new Error('Required phase vocoder parameters not found');
      }

      this.effects.set('phaseVocoder', {
        type: 'phaseVocoder',
        node: this.phaseVocoder,
        parameters: new Map([
          ['timeStretch', timeStretch],
          ['pitchShift', pitchShift]
        ])
      });

      // Initialize basic effects
      this.initializeBasicEffects();

      // Connect nodes
      this.connectNodes();
    } catch (error) {
      logger.error('Failed to initialize audio effects:', error);
      throw error;
    }
  }

  private initializeBasicEffects(): void {
    try {
      // Reverb
      const reverb = this.context.createConvolver();
      this.effects.set('reverb', {
        type: 'reverb',
        node: reverb,
        parameters: new Map()
      });

      // Echo
      const echo = this.context.createDelay();
      const echoGain = this.context.createGain();
      this.effects.set('echo', {
        type: 'echo',
        node: echo,
        parameters: new Map([
          ['time', echo.delayTime],
          ['feedback', echoGain.gain]
        ])
      });

      // Flanger
      const flanger = this.context.createBiquadFilter();
      this.effects.set('flanger', {
        type: 'flanger',
        node: flanger,
        parameters: new Map([
          ['rate', flanger.frequency],
          ['depth', flanger.Q]
        ])
      });

      // Chorus
      const chorus = this.context.createBiquadFilter();
      this.effects.set('chorus', {
        type: 'chorus',
        node: chorus,
        parameters: new Map([
          ['rate', chorus.frequency],
          ['depth', chorus.Q]
        ])
      });

      // Distortion
      const distortion = this.context.createWaveShaper();
      const distortionGain = this.context.createGain();
      this.effects.set('distortion', {
        type: 'distortion',
        node: distortion,
        parameters: new Map([
          ['amount', distortionGain.gain]
        ])
      });
    } catch (error) {
      logger.error('Failed to initialize basic effects:', error);
      throw error;
    }
  }

  private connectNodes(): void {
    if (!this.spectralFilter || !this.phaseVocoder) {
      throw new Error('Required audio nodes not initialized');
    }

    try {
      // Connect spectral filter to phase vocoder
      this.spectralFilter.connect(this.phaseVocoder);
      this.phaseVocoder.connect(this.analyser);
    } catch (error) {
      logger.error('Failed to connect audio nodes:', error);
      throw error;
    }
  }

  async processAudio(input: AudioBuffer): Promise<AudioAnalysis> {
    if (!this.isInitialized) {
      throw new Error('AudioProcessorService not initialized');
    }

    if (!input || !input.length) {
      throw new Error('Invalid audio input');
    }

    try {
      // Create source from input buffer
      const source = this.context.createBufferSource();
      source.buffer = input;
      
      if (this.spectralFilter) {
        source.connect(this.spectralFilter);
      }

      // Start playback
      source.start();

      // Analyze audio
      const analysis = await this.analyzeAudio();
      return analysis;
    } catch (error) {
      logger.error('Error processing audio:', error);
      throw error;
    }
  }

  private async analyzeAudio(): Promise<AudioAnalysis> {
    try {
      const spectrum = new Float32Array(this.analyser.frequencyBinCount);
      const waveform = new Float32Array(this.analyser.frequencyBinCount);
      
      this.analyser.getFloatFrequencyData(spectrum);
      this.analyser.getFloatTimeDomainData(waveform);

      // Calculate pitch using autocorrelation
      const pitch = this.estimatePitch(waveform);
      const confidence = this.calculateConfidence(spectrum);
      const harmonics = this.detectHarmonics(spectrum, pitch);
      const emotion = this.analyzeEmotion(spectrum);
      const intensity = this.calculateIntensity(spectrum);

      return {
        pitch,
        confidence,
        harmonics,
        spectrum,
        waveform,
        emotion,
        intensity
      };
    } catch (error) {
      logger.error('Error analyzing audio:', error);
      throw error;
    }
  }

  private estimatePitch(waveform: Float32Array): number {
    if (!waveform || !waveform.length) {
      throw new Error('Invalid waveform data');
    }

    const sampleRate = this.context.sampleRate;
    const maxOffset = Math.floor(sampleRate / 50); // Minimum frequency: 50Hz
    const minOffset = Math.floor(sampleRate / 2000); // Maximum frequency: 2000Hz

    let bestOffset = -1;
    let bestCorrelation = 0;

    for (let offset = minOffset; offset < maxOffset; offset++) {
      let correlation = 0;
      for (let i = 0; i < waveform.length - offset; i++) {
        correlation += waveform[i] * waveform[i + offset];
      }
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    }

    return bestOffset > 0 ? sampleRate / bestOffset : 0;
  }

  private calculateConfidence(spectrum: Float32Array): number {
    if (!spectrum || !spectrum.length) {
      throw new Error('Invalid spectrum data');
    }

    let totalEnergy = 0;
    let peakEnergy = 0;
    let peakIndex = 0;

    for (let i = 0; i < spectrum.length; i++) {
      const energy = Math.pow(10, spectrum[i] / 20);
      totalEnergy += energy;
      if (energy > peakEnergy) {
        peakEnergy = energy;
        peakIndex = i;
      }
    }

    return totalEnergy > 0 ? peakEnergy / totalEnergy : 0;
  }

  private detectHarmonics(spectrum: Float32Array, fundamental: number): number[] {
    if (!spectrum || !spectrum.length || fundamental <= 0) {
      throw new Error('Invalid input for harmonic detection');
    }

    const harmonics: number[] = [];
    const sampleRate = this.context.sampleRate;
    const binSize = sampleRate / (2 * spectrum.length);

    for (let i = 2; i <= 8; i++) {
      const harmonicFreq = fundamental * i;
      const binIndex = Math.round(harmonicFreq / binSize);
      if (binIndex < spectrum.length) {
        harmonics.push(spectrum[binIndex]);
      }
    }

    return harmonics;
  }

  private analyzeEmotion(spectrum: Float32Array): string {
    if (!spectrum || !spectrum.length) {
      throw new Error('Invalid spectrum data for emotion analysis');
    }

    const lowFreq = this.getAverageEnergy(spectrum, 0, 0.2);
    const midFreq = this.getAverageEnergy(spectrum, 0.2, 0.6);
    const highFreq = this.getAverageEnergy(spectrum, 0.6, 1.0);

    // Simple emotion detection based on spectral features
    if (highFreq > midFreq && highFreq > lowFreq) {
      return 'excited';
    } else if (midFreq > highFreq && midFreq > lowFreq) {
      return 'calm';
    } else if (lowFreq > midFreq && lowFreq > highFreq) {
      return 'sad';
    } else {
      return 'neutral';
    }
  }

  private getAverageEnergy(spectrum: Float32Array, start: number, end: number): number {
    if (!spectrum || !spectrum.length || start < 0 || end > 1 || start >= end) {
      throw new Error('Invalid parameters for energy calculation');
    }

    const startIndex = Math.floor(start * spectrum.length);
    const endIndex = Math.floor(end * spectrum.length);
    let sum = 0;

    for (let i = startIndex; i < endIndex; i++) {
      sum += Math.pow(10, spectrum[i] / 20);
    }

    return sum / (endIndex - startIndex);
  }

  private calculateIntensity(spectrum: Float32Array): number {
    if (!spectrum || !spectrum.length) {
      throw new Error('Invalid spectrum data for intensity calculation');
    }

    let sum = 0;
    for (let i = 0; i < spectrum.length; i++) {
      sum += Math.pow(10, spectrum[i] / 20);
    }

    return sum / spectrum.length;
  }

  setEffectParameter(effect: string, parameter: string, value: number): void {
    const effectNode = this.effects.get(effect);
    if (!effectNode) {
      throw new Error(`Effect not found: ${effect}`);
    }

    const param = effectNode.parameters.get(parameter);
    if (!param) {
      throw new Error(`Parameter not found: ${parameter} for effect ${effect}`);
    }

    try {
      param.value = value;
    } catch (error) {
      logger.error(`Failed to set effect parameter: ${effect}.${parameter}`, error);
      throw error;
    }
  }

  getEffectParameters(effect: string): Map<string, number> {
    const effectNode = this.effects.get(effect);
    if (!effectNode) {
      throw new Error(`Effect not found: ${effect}`);
    }

    const parameters = new Map<string, number>();
    effectNode.parameters.forEach((param, name) => {
      parameters.set(name, param.value);
    });

    return parameters;
  }

  async shutdown(): Promise<void> {
    try {
      if (this.context.state !== 'closed') {
        await this.context.close();
      }
      this.isInitialized = false;
      logger.info('AudioProcessorService shut down successfully');
    } catch (error) {
      logger.error('Failed to shut down AudioProcessorService:', error);
      throw error;
    }
  }
} 