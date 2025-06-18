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

class SpectralFilterProcessor extends AudioWorkletProcessor {
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

    // Create Hann window
    for (let i = 0; i < this.bufferSize; i++) {
      this.window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (this.bufferSize - 1)));
    }

    // Initialize filter parameters
    this.filterBands = new Float32Array(this.bufferSize);
    this.filterQ = 1.0;
    this.filterGain = 1.0;

    // Pre-calculate constants
    this.twoPi = 2 * Math.PI;
    this.sampleRate = sampleRate;
  }

  static get parameterDescriptors() {
    return [
      {
        name: 'filterBands',
        defaultValue: 1.0,
        minValue: 0.0,
        maxValue: 2.0,
        automationRate: 'k-rate'
      },
      {
        name: 'filterQ',
        defaultValue: 1.0,
        minValue: 0.1,
        maxValue: 10.0,
        automationRate: 'k-rate'
      },
      {
        name: 'filterGain',
        defaultValue: 1.0,
        minValue: 0.0,
        maxValue: 4.0,
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
        outputChannel[i] = this.overlapBuffer[0];
      }

      return true;
    } catch (error) {
      console.error('Error in spectral filter processor:', error);
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

      // Apply spectral filter
      this.applySpectralFilter();

      // Perform inverse FFT
      this.ifft(this.real, this.imag);

      // Apply window and overlap-add
      for (let j = 0; j < this.bufferSize; j++) {
        this.overlapBuffer[j] = this.real[j] * this.window[j];
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

  applySpectralFilter() {
    const n = this.real.length;
    for (let i = 0; i < n; i++) {
      const freq = i * this.sampleRate / n;
      const magnitude = Math.sqrt(this.real[i] * this.real[i] + this.imag[i] * this.imag[i]);
      const phase = Math.atan2(this.imag[i], this.real[i]);

      // Apply filter based on frequency bands
      const filterMagnitude = this.calculateFilterMagnitude(freq);
      const newMagnitude = magnitude * filterMagnitude * this.filterGain;

      // Update real and imaginary parts
      this.real[i] = newMagnitude * Math.cos(phase);
      this.imag[i] = newMagnitude * Math.sin(phase);
    }
  }

  calculateFilterMagnitude(freq) {
    // Implement filter response based on filterBands and filterQ
    let magnitude = 1.0;
    for (let i = 0; i < this.filterBands.length; i++) {
      const centerFreq = i * this.sampleRate / (2 * this.bufferSize);
      const bandwidth = centerFreq / this.filterQ;
      const distance = Math.abs(freq - centerFreq);
      magnitude *= 1.0 / (1.0 + Math.pow(distance / bandwidth, 2));
    }
    return magnitude;
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

registerProcessor('spectral-filter-processor', SpectralFilterProcessor); 