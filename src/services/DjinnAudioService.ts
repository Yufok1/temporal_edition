import { EventEmitter } from 'events';
import logger from '../logger';
import { MonitoringService } from '../MonitoringService';
import { AudioProcessorService, AudioAnalysis } from './AudioProcessorService';

export interface AudioState {
  isPlaying: boolean;
  currentTone: string;
  volume: number;
  tempo: number;
  harmony: string[];
  analysis: AudioAnalysis | null;
}

export interface DjinnResponse {
  type: 'harmony' | 'tempo' | 'volume' | 'tone';
  value: string[] | number | string;
  confidence: number;
}

export class DjinnAudioService extends EventEmitter {
  private monitoringService: MonitoringService;
  private audioProcessor: AudioProcessorService;
  private audioContext: AudioContext | null = null;
  private audioState: AudioState = {
    isPlaying: false,
    currentTone: 'C4',
    volume: 0.7,
    tempo: 120,
    harmony: ['C4', 'E4', 'G4'],
    analysis: null
  };

  private readonly noteFrequencies: Record<string, number> = {
    'C4': 261.63,
    'E4': 329.63,
    'G4': 392.00,
    'A4': 440.00,
    'B4': 493.88
  };

  constructor(monitoringService: MonitoringService) {
    super();
    this.monitoringService = monitoringService;
    this.audioProcessor = new AudioProcessorService();
  }

  async initialize(): Promise<void> {
    try {
      logger.info('Initializing Djinn Audio Service...');
      
      if (typeof window !== 'undefined') {
        this.audioContext = new AudioContext();
        await this.audioContext.resume();
        this.monitoringService.logSessionEvent({
          type: 'session_start',
          timestamp: Date.now(),
          metadata: {
            identity: 'monkey-king',
            mode: 'audio_initialization'
          }
        });
      }
      
      // Initialize audio processor
      await this.audioProcessor.initialize();
      
      // Set up monitoring
      this.monitoringService.updateSystemHealth('audio', true);
      this.monitoringService.updateSystemStability('audio', 1.0);
      
      logger.info('Djinn Audio Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Djinn Audio Service:', error);
      this.monitoringService.updateSystemHealth('audio', false);
      throw error;
    }
  }

  async processWhaleVocalization(vocalization: string): Promise<DjinnResponse> {
    if (!vocalization) {
      throw new Error('Vocalization cannot be empty');
    }

    try {
      // Create audio buffer from vocalization
      const audioBuffer = await this.createAudioBuffer(vocalization);
      
      // Process audio
      const analysis = await this.audioProcessor.processAudio(audioBuffer);
      
      // Update audio state with analysis
      this.audioState.analysis = analysis;
      this.emit('audioStateChanged', this.audioState);
      
      // Analyze the vocalization and generate a response
      const response = await this.analyzeVocalization(vocalization, analysis);
      
      // Update audio state based on response
      await this.updateAudioState(response);
      
      return response;
    } catch (error) {
      logger.error('Failed to process whale vocalization:', error);
      throw error;
    }
  }

  private async createAudioBuffer(vocalization: string): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    // Create a simple sine wave based on the vocalization
    const sampleRate = this.audioContext.sampleRate;
    const duration = 1; // 1 second
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate a simple tone based on the vocalization
    const frequency = this.getFrequencyFromVocalization(vocalization);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
    }

    return buffer;
  }

  private getFrequencyFromVocalization(vocalization: string): number {
    // Simple mapping of vocalization to frequency
    const baseFrequency = 440; // A4
    const vocalizationHash = vocalization.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return baseFrequency * (1 + (vocalizationHash % 12) / 12);
  }

  private async analyzeVocalization(vocalization: string, analysis: AudioAnalysis): Promise<DjinnResponse> {
    if (!analysis || typeof analysis.confidence !== 'number' || typeof analysis.pitch !== 'number') {
      throw new Error('Invalid audio analysis data');
    }

    // Use the audio analysis to influence the response
    const confidence = analysis.confidence;
    const pitch = analysis.pitch;
    
    // Find closest note to the analyzed pitch
    let closestNote = 'C4';
    let minDiff = Infinity;
    
    Object.entries(this.noteFrequencies).forEach(([note, freq]) => {
      const diff = Math.abs(freq - pitch);
      if (diff < minDiff) {
        minDiff = diff;
        closestNote = note;
      }
    });
    
    return {
      type: 'harmony',
      value: [closestNote, 'E4', 'G4'],
      confidence
    };
  }

  private async updateAudioState(response: DjinnResponse): Promise<void> {
    if (!response || !response.type || !response.value) {
      throw new Error('Invalid response data');
    }

    switch (response.type) {
      case 'harmony':
        if (!Array.isArray(response.value)) {
          throw new Error('Harmony value must be an array of strings');
        }
        this.audioState.harmony = response.value;
        break;
      case 'tempo':
        if (typeof response.value !== 'number') {
          throw new Error('Tempo value must be a number');
        }
        this.audioState.tempo = response.value;
        break;
      case 'volume':
        if (typeof response.value !== 'number') {
          throw new Error('Volume value must be a number');
        }
        this.audioState.volume = response.value;
        break;
      case 'tone':
        if (typeof response.value !== 'string') {
          throw new Error('Tone value must be a string');
        }
        this.audioState.currentTone = response.value;
        break;
      default:
        throw new Error(`Unknown response type: ${response.type}`);
    }
    
    this.emit('audioStateChanged', this.audioState);
  }

  async playTone(frequency: number, duration: number): Promise<void> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    if (typeof frequency !== 'number' || frequency <= 0) {
      throw new Error('Invalid frequency value');
    }

    if (typeof duration !== 'number' || duration <= 0) {
      throw new Error('Invalid duration value');
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = this.audioState.volume;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  async playHarmony(): Promise<void> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    for (const note of this.audioState.harmony) {
      const frequency = this.noteFrequencies[note];
      if (!frequency) {
        logger.warn(`Unknown note frequency for note: ${note}`);
        continue;
      }
      await this.playTone(frequency, 0.5);
    }
  }

  getAudioState(): AudioState {
    return { ...this.audioState };
  }

  async shutdown(): Promise<void> {
    try {
      logger.info('Shutting down Djinn Audio Service...');
      
      if (this.audioContext) {
        await this.audioContext.close();
        this.audioContext = null;
      }
      
      await this.audioProcessor.shutdown();
      
      logger.info('Djinn Audio Service shut down successfully');
    } catch (error) {
      logger.error('Failed to shut down Djinn Audio Service:', error);
      throw error;
    }
  }

  async startSession(): Promise<void> {
    try {
      if (!this.audioContext) {
        throw new Error('Audio context not initialized');
      }
      this.audioState.isPlaying = true;
      this.monitoringService.logSessionEvent({
        type: 'session_start',
        timestamp: Date.now(),
        metadata: {
          identity: 'monkey-king',
          mode: 'audio_session'
        }
      });
    } catch (error) {
      console.error('Failed to start session:', error);
      throw error;
    }
  }

  async endSession(): Promise<void> {
    try {
      if (this.audioContext) {
        await this.audioContext.suspend();
        this.audioState.isPlaying = false;
        this.monitoringService.logSessionEvent({
          type: 'session_end',
          timestamp: Date.now(),
          metadata: {
            identity: 'monkey-king',
            mode: 'audio_session'
          }
        });
      }
    } catch (error) {
      console.error('Failed to end session:', error);
      throw error;
    }
  }

  setVolume(volume: number): void {
    this.audioState.volume = Math.max(0, Math.min(1, volume));
  }

  setTempo(tempo: number): void {
    this.audioState.tempo = Math.max(60, Math.min(240, tempo));
  }

  setEffectParameter(type: string, parameter: string, value: number): void {
    // Implementation for setting effect parameters
    console.log(`Setting ${type} effect parameter ${parameter} to ${value}`);
  }

  getCurrentState(): AudioState {
    return { ...this.audioState };
  }
} 