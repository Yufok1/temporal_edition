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

class VocoderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bands = 16;
    this.bandBuffers = Array(this.bands).fill().map(() => new Float32Array(128));
    this.carrierBuffers = Array(this.bands).fill().map(() => new Float32Array(128));
    this.modulatorBuffers = Array(this.bands).fill().map(() => new Float32Array(128));
    this.bandGains = new Float32Array(this.bands);
    this.bandFrequencies = this.calculateBandFrequencies();
    this.sampleRate = sampleRate;
    this.twoPi = 2 * Math.PI;
  }

  static get parameterDescriptors() {
    return [{
      name: 'bandGains',
      defaultValue: new Float32Array(16).fill(1),
      minValue: 0,
      maxValue: 1,
      automationRate: 'k-rate'
    }, {
      name: 'qFactor',
      defaultValue: 1,
      minValue: 0.1,
      maxValue: 10,
      automationRate: 'k-rate'
    }];
  }

  calculateBandFrequencies() {
    try {
      const frequencies = new Float32Array(this.bands);
      const minFreq = 50;
      const maxFreq = 8000;
      const ratio = Math.pow(maxFreq / minFreq, 1 / (this.bands - 1));

      for (let i = 0; i < this.bands; i++) {
        frequencies[i] = minFreq * Math.pow(ratio, i);
      }
      return frequencies;
    } catch (error) {
      console.error('Error calculating band frequencies:', error);
      throw error;
    }
  }

  process(inputs, outputs, parameters) {
    try {
      const carrier = inputs[0];
      const modulator = inputs[1];
      const output = outputs[0];
      const bandGains = parameters.bandGains[0];
      const qFactor = parameters.qFactor[0];

      if (!carrier || !modulator || !output || 
          carrier.length === 0 || modulator.length === 0 || output.length === 0) {
        return true;
      }

      for (let channel = 0; channel < output.length; channel++) {
        const carrierChannel = carrier[channel];
        const modulatorChannel = modulator[channel];
        const outputChannel = output[channel];

        if (!carrierChannel || !modulatorChannel || !outputChannel) {
          continue;
        }

        // Clear output channel
        outputChannel.fill(0);

        // Process each frequency band
        for (let band = 0; band < this.bands; band++) {
          const centerFreq = this.bandFrequencies[band];
          const bandwidth = centerFreq / qFactor;

          // Filter carrier and modulator signals
          this.filterSignal(carrierChannel, this.carrierBuffers[band], centerFreq, bandwidth);
          this.filterSignal(modulatorChannel, this.modulatorBuffers[band], centerFreq, bandwidth);

          // Calculate envelope of modulator
          const envelope = this.calculateEnvelope(this.modulatorBuffers[band]);

          // Apply envelope to carrier and mix
          for (let i = 0; i < outputChannel.length; i++) {
            const carrierSample = this.carrierBuffers[band][i];
            const modulatorSample = this.modulatorBuffers[band][i];
            const gain = bandGains[band] * envelope[i];

            outputChannel[i] += carrierSample * gain;
          }
        }

        // Normalize output
        const maxGain = Math.max(...bandGains);
        if (maxGain > 0) {
          for (let i = 0; i < outputChannel.length; i++) {
            outputChannel[i] /= maxGain;
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error in vocoder processor:', error);
      return false;
    }
  }

  filterSignal(input, output, centerFreq, bandwidth) {
    try {
      const q = centerFreq / bandwidth;
      const w0 = this.twoPi * centerFreq / this.sampleRate;
      const alpha = Math.sin(w0) / (2 * q);

      const a0 = 1 + alpha;
      const a1 = -2 * Math.cos(w0);
      const a2 = 1 - alpha;
      const b0 = alpha;
      const b1 = 0;
      const b2 = -alpha;

      // Initialize previous samples
      let prevInput1 = 0;
      let prevInput2 = 0;
      let prevOutput1 = 0;
      let prevOutput2 = 0;

      for (let i = 0; i < input.length; i++) {
        const currentInput = input[i];
        output[i] = (b0 * currentInput + b1 * prevInput1 + b2 * prevInput2 -
                     a1 * prevOutput1 - a2 * prevOutput2) / a0;

        // Update previous samples
        prevInput2 = prevInput1;
        prevInput1 = currentInput;
        prevOutput2 = prevOutput1;
        prevOutput1 = output[i];
      }
    } catch (error) {
      console.error('Error in filter signal:', error);
      throw error;
    }
  }

  calculateEnvelope(signal) {
    try {
      const envelope = new Float32Array(signal.length);
      const attackTime = 0.01;
      const releaseTime = 0.1;
      const attackRate = 1 / (attackTime * this.sampleRate);
      const releaseRate = 1 / (releaseTime * this.sampleRate);
      let currentEnvelope = 0;

      for (let i = 0; i < signal.length; i++) {
        const amplitude = Math.abs(signal[i]);
        if (amplitude > currentEnvelope) {
          currentEnvelope = Math.min(amplitude, currentEnvelope + attackRate);
        } else {
          currentEnvelope = Math.max(amplitude, currentEnvelope - releaseRate);
        }
        envelope[i] = currentEnvelope;
      }

      return envelope;
    } catch (error) {
      console.error('Error calculating envelope:', error);
      throw error;
    }
  }
}

registerProcessor('vocoder-processor', VocoderProcessor); 