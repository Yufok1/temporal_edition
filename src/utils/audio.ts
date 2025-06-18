import { getAudioConfig } from './environment';

export const createAudioContext = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContext({
    sampleRate: getAudioConfig().sampleRate,
    latencyHint: 'interactive'
  });
};

export const createAnalyser = (context: AudioContext) => {
  const analyser = context.createAnalyser();
  analyser.fftSize = getAudioConfig().fftSize;
  analyser.smoothingTimeConstant = getAudioConfig().smoothingTimeConstant;
  analyser.minDecibels = getAudioConfig().minDecibels;
  analyser.maxDecibels = getAudioConfig().maxDecibels;
  return analyser;
};

export const createGainNode = (context: AudioContext, gain: number = 1) => {
  const gainNode = context.createGain();
  gainNode.gain.value = gain;
  return gainNode;
};

export const createOscillator = (context: AudioContext, frequency: number) => {
  const oscillator = context.createOscillator();
  oscillator.frequency.value = frequency;
  return oscillator;
};

export const createBiquadFilter = (context: AudioContext, type: BiquadFilterType, frequency: number, Q: number = 1) => {
  const filter = context.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = Q;
  return filter;
};

export const createDelay = (context: AudioContext, delayTime: number) => {
  const delay = context.createDelay();
  delay.delayTime.value = delayTime;
  return delay;
};

export const createConvolver = async (context: AudioContext, impulseResponse: AudioBuffer) => {
  const convolver = context.createConvolver();
  convolver.buffer = impulseResponse;
  return convolver;
};

export const createStereoPanner = (context: AudioContext, pan: number = 0) => {
  const panner = context.createStereoPanner();
  panner.pan.value = pan;
  return panner;
};

export const createDynamicsCompressor = (context: AudioContext) => {
  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.knee.value = 30;
  compressor.ratio.value = 12;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.25;
  return compressor;
};

export const connectNodes = (source: AudioNode, destination: AudioNode) => {
  source.connect(destination);
};

export const disconnectNodes = (node: AudioNode) => {
  node.disconnect();
};

export const getFrequencyData = (analyser: AnalyserNode) => {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  return dataArray;
};

export const getTimeDomainData = (analyser: AnalyserNode) => {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);
  return dataArray;
}; 