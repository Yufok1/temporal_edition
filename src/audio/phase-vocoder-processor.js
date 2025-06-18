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

class PhaseVocoderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.fftSize = 2048;
    this.bufferSize = this.fftSize / 2;
    this.real = new Float32Array(this.bufferSize);
    this.imag = new Float32Array(this.bufferSize);
    this.window = new Float32Array(this.bufferSize);
    this.overlap = 0.75;
    this.hopSize = Math.floor(this.bufferSize * (1 - this.overlap));
    this.overlapBuffer = new Float32Array(this.bufferSize);
    this.overlapIndex = 0;
    this.phaseAccumulator = new Float32Array(this.bufferSize);
    this.lastPhase = new Float32Array(this.bufferSize);
    this.synthesisBuffer = new Float32Array(this.bufferSize);

    // Create Hann window
    for (let i = 0; i < this.bufferSize; i++) {
      this.window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (this.bufferSize - 1)));
    }

    // Initialize parameters
    this.timeStretch = 1.0;
    this.pitchShift = 1.0;

    // Pre-calculate constants
    this.twoPi = 2 * Math.PI;
    this.pi = Math.PI;
    this.sampleRate = sampleRate;
  }

  static get parameterDescriptors() {
    return [
      {
        name: 'timeStretch',
        defaultValue: 1.0,
        minValue: 0.25,
        maxValue: 4.0,
        automationRate: 'k-rate'
      },
      {
        name: 'pitchShift',
        defaultValue: 1.0,
        minValue: 0.5,
        maxValue: 2.0,
        automationRate: 'k-rate'
      }
    ];
  }

  process(inputs, outputs, parameters) {
    try {
      const input = inputs[0];
      const output = outputs[0];

      if (!input || !input[0] || !output || !output[0]) {
        return true;
      }

      const inputChannel = input[0];
      const outputChannel = output[0];

      // Process each sample
      for (let i = 0; i < inputChannel.length; i++) {
        // Add sample to overlap buffer
        this.overlapBuffer[this.overlapIndex] = inputChannel[i];
        this.overlapIndex++;

        // When we have enough samples, process the buffer
        if (this.overlapIndex >= this.hopSize) {
          this.processBuffer();
        }

        // Output the processed sample
        outputChannel[i] = this.synthesisBuffer[0];
      }

      return true;
    } catch (error) {
      console.error('Error in phase vocoder processor:', error);
      return false;
    }
  }

  processBuffer() {
    try {
      // Apply window
      for (let j = 0; j < this.bufferSize; j++) {
        this.real[j] = this.overlapBuffer[j] * this.window[j];
        this.imag[j] = 0;
      }

      // Perform FFT
      this.fft(this.real, this.imag);

      // Process phase
      this.processPhase();

      // Perform inverse FFT
      this.ifft(this.real, this.imag);

      // Apply window and overlap-add
      for (let j = 0; j < this.bufferSize; j++) {
        this.synthesisBuffer[j] = this.real[j] * this.window[j];
      }

      // Shift buffer
      for (let j = 0; j < this.bufferSize - this.hopSize; j++) {
        this.overlapBuffer[j] = this.overlapBuffer[j + this.hopSize];
      }
      this.overlapIndex = this.bufferSize - this.hopSize;
    } catch (error) {
      console.error('Error processing buffer:', error);
      throw error;
    }
  }

  fft(real, imag) {
    const n = real.length;
    if (n <= 1) return;

    // Bit reversal
    for (let i = 0; i < n; i++) {
      const j = this.reverseBits(i, Math.log2(n));
      if (j > i) {
        [real[i], real[j]] = [real[j], real[i]];
        [imag[i], imag[j]] = [imag[j], imag[i]];
      }
    }

    // Cooley-Tukey FFT
    for (let size = 2; size <= n; size *= 2) {
      const halfsize = size / 2;
      const tablestep = n / size;
      for (let i = 0; i < n; i += size) {
        for (let j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
          const angle = this.twoPi * k / n;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const tpre = real[j + halfsize] * cos + imag[j + halfsize] * sin;
          const tpim = -real[j + halfsize] * sin + imag[j + halfsize] * cos;
          real[j + halfsize] = real[j] - tpre;
          imag[j + halfsize] = imag[j] - tpim;
          real[j] += tpre;
          imag[j] += tpim;
        }
      }
    }
  }

  ifft(real, imag) {
    // Conjugate
    for (let i = 0; i < imag.length; i++) {
      imag[i] = -imag[i];
    }

    // Forward FFT
    this.fft(real, imag);

    // Conjugate and scale
    const n = real.length;
    for (let i = 0; i < n; i++) {
      real[i] /= n;
      imag[i] = -imag[i] / n;
    }
  }

  processPhase() {
    const n = this.real.length;
    const hopSize = this.hopSize * this.timeStretch;

    for (let i = 0; i < n; i++) {
      // Calculate magnitude and phase
      const magnitude = Math.sqrt(this.real[i] * this.real[i] + this.imag[i] * this.imag[i]);
      const phase = Math.atan2(this.imag[i], this.real[i]);

      // Calculate phase difference
      let phaseDiff = phase - this.lastPhase[i];
      this.lastPhase[i] = phase;

      // Phase unwrapping
      while (phaseDiff > this.pi) phaseDiff -= this.twoPi;
      while (phaseDiff < -this.pi) phaseDiff += this.twoPi;

      // Update phase accumulator
      this.phaseAccumulator[i] += phaseDiff * this.pitchShift;

      // Calculate new phase
      const newPhase = this.phaseAccumulator[i];

      // Update real and imaginary parts
      this.real[i] = magnitude * Math.cos(newPhase);
      this.imag[i] = magnitude * Math.sin(newPhase);
    }
  }

  reverseBits(x, bits) {
    let y = 0;
    for (let i = 0; i < bits; i++) {
      y = (y << 1) | (x & 1);
      x >>>= 1;
    }
    return y;
  }
}

registerProcessor('phase-vocoder-processor', PhaseVocoderProcessor); 