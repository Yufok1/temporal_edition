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

class PitchShifterProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this.buffer = new Float32Array(this.bufferSize);
    this.writeIndex = 0;
    this.readIndex = 0;
    this.pitchRatio = 1.0;
    this.lastPitchRatio = 1.0;
    this.sampleRate = sampleRate;
  }

  static get parameterDescriptors() {
    return [{
      name: 'pitchRatio',
      defaultValue: 1.0,
      minValue: 0.5,
      maxValue: 2.0,
      automationRate: 'k-rate'
    }];
  }

  process(inputs, outputs, parameters) {
    try {
      const input = inputs[0];
      const output = outputs[0];
      const pitchRatio = parameters.pitchRatio[0];

      if (!input || !output || input.length === 0 || output.length === 0) {
        return true;
      }

      if (pitchRatio !== this.lastPitchRatio) {
        this.pitchRatio = pitchRatio;
        this.lastPitchRatio = pitchRatio;
      }

      for (let channel = 0; channel < input.length; channel++) {
        const inputChannel = input[channel];
        const outputChannel = output[channel];

        if (!inputChannel || !outputChannel) {
          continue;
        }

        // Clear output channel
        outputChannel.fill(0);

        // Write to circular buffer
        for (let i = 0; i < inputChannel.length; i++) {
          this.buffer[this.writeIndex] = inputChannel[i];
          this.writeIndex = (this.writeIndex + 1) % this.bufferSize;
        }

        // Read from circular buffer with pitch shifting
        for (let i = 0; i < outputChannel.length; i++) {
          const readIndex = Math.floor(this.readIndex);
          const fraction = this.readIndex - readIndex;
          const nextIndex = (readIndex + 1) % this.bufferSize;

          // Linear interpolation
          outputChannel[i] = this.buffer[readIndex] * (1 - fraction) + 
                            this.buffer[nextIndex] * fraction;

          this.readIndex = (this.readIndex + this.pitchRatio) % this.bufferSize;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in pitch shifter processor:', error);
      return false;
    }
  }
}

registerProcessor('pitch-shifter-processor', PitchShifterProcessor); 