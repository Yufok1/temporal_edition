export interface AudioAnalysis {
  frequencyData: Uint8Array;
  timeData: Uint8Array;
  sampleRate: number;
  filterCutoff?: number;
  filterResonance?: number;
  reverbMix?: number;
  pitch?: {
    frequency: number;
    confidence: number;
  };
}

export interface AudioEffect {
  type: string;
  parameters: {
    [key: string]: number;
  };
}

export interface AudioProcessor {
  process(input: Float32Array): Float32Array;
  setParameter(name: string, value: number): void;
  getParameter(name: string): number;
}

export interface AudioWorkletProcessor {
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: { [key: string]: Float32Array }
  ): boolean;
}

export interface AudioWorkletNode extends AudioNode {
  parameters: AudioParamMap;
  port: MessagePort;
}

export interface AudioParamMap {
  get(name: string): AudioParam;
  has(name: string): boolean;
  forEach(callback: (value: AudioParam, key: string) => void): void;
}

export interface AudioParam {
  value: number;
  defaultValue: number;
  minValue: number;
  maxValue: number;
  automationRate: 'a-rate' | 'k-rate';
  setValueAtTime(value: number, startTime: number): AudioParam;
  linearRampToValueAtTime(value: number, endTime: number): AudioParam;
  exponentialRampToValueAtTime(value: number, endTime: number): AudioParam;
  setTargetAtTime(target: number, startTime: number, timeConstant: number): AudioParam;
  setValueCurveAtTime(values: Float32Array, startTime: number, duration: number): AudioParam;
  cancelScheduledValues(startTime: number): AudioParam;
  cancelAndHoldAtTime(startTime: number): AudioParam;
} 