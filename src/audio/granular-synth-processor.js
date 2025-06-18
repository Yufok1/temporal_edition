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

class GranularSynthProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.sampleRate = sampleRate;
    this.bufferSize = this.sampleRate * 2; // 2 seconds at 44.1kHz
    this.buffer = new Float32Array(this.bufferSize);
    this.writeIndex = 0;
    this.grainSize = 0.1; // 100ms grains
    this.grainSpacing = 0.05; // 50ms between grains
    this.grainPosition = 0;
    this.grainEnvelope = this.createGrainEnvelope();
    this.lastGrainSize = this.grainSize;
  }

  static get parameterDescriptors() {
    return [{
      name: 'grainSize',
      defaultValue: 0.1,
      minValue: 0.01,
      maxValue: 0.5,
      automationRate: 'k-rate'
    }, {
      name: 'grainSpacing',
      defaultValue: 0.05,
      minValue: 0.01,
      maxValue: 0.2,
      automationRate: 'k-rate'
    }, {
      name: 'grainPosition',
      defaultValue: 0,
      minValue: 0,
      maxValue: 1,
      automationRate: 'k-rate'
    }];
  }

  createGrainEnvelope() {
    try {
      const envelopeSize = Math.floor(this.sampleRate * this.grainSize);
      const envelope = new Float32Array(envelopeSize);
      const attackTime = Math.floor(envelopeSize * 0.1);
      const releaseTime = Math.floor(envelopeSize * 0.1);
      const sustainTime = envelopeSize - attackTime - releaseTime;

      // Attack
      for (let i = 0; i < attackTime; i++) {
        envelope[i] = i / attackTime;
      }

      // Sustain
      for (let i = 0; i < sustainTime; i++) {
        envelope[attackTime + i] = 1;
      }

      // Release
      for (let i = 0; i < releaseTime; i++) {
        envelope[attackTime + sustainTime + i] = 1 - (i / releaseTime);
      }

      return envelope;
    } catch (error) {
      console.error('Error creating grain envelope:', error);
      throw error;
    }
  }

  process(inputs, outputs, parameters) {
    try {
      const input = inputs[0];
      const output = outputs[0];
      const grainSize = parameters.grainSize[0];
      const grainSpacing = parameters.grainSpacing[0];
      const grainPosition = parameters.grainPosition[0];

      if (!input || !output || input.length === 0 || output.length === 0) {
        return true;
      }

      // Update parameters
      if (grainSize !== this.lastGrainSize) {
        this.grainSize = grainSize;
        this.lastGrainSize = grainSize;
        this.grainEnvelope = this.createGrainEnvelope();
      }
      this.grainSpacing = grainSpacing;
      this.grainPosition = grainPosition;

      for (let channel = 0; channel < input.length; channel++) {
        const inputChannel = input[channel];
        const outputChannel = output[channel];

        if (!inputChannel || !outputChannel) {
          continue;
        }

        // Clear output channel
        outputChannel.fill(0);

        // Write to buffer
        for (let i = 0; i < inputChannel.length; i++) {
          this.buffer[this.writeIndex] = inputChannel[i];
          this.writeIndex = (this.writeIndex + 1) % this.bufferSize;
        }

        // Generate grains
        const grainStart = Math.floor(this.grainPosition * this.bufferSize);
        const grainLength = Math.floor(this.grainSize * this.sampleRate);
        const envelopeLength = this.grainEnvelope.length;

        for (let i = 0; i < outputChannel.length; i++) {
          let sample = 0;

          // Apply grain envelope
          for (let j = 0; j < grainLength; j++) {
            const bufferIndex = (grainStart + j) % this.bufferSize;
            const envelopeIndex = Math.floor((j / grainLength) * envelopeLength);
            sample += this.buffer[bufferIndex] * this.grainEnvelope[envelopeIndex];
          }

          outputChannel[i] = sample;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in granular synth processor:', error);
      return false;
    }
  }
}

registerProcessor('granular-synth-processor', GranularSynthProcessor); 