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

import { getSecurityConfig } from '../utils/environment';
import { error, warn } from '../utils/environment';
import { cryptographer } from './CryptographerCore';

export const generateSessionId = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const encryptData = async (data: string, publicKey: Uint8Array): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  return cryptographer.encrypt(encoder.encode(data), publicKey);
};

export const decryptData = async (encryptedData: Uint8Array, privateKey: Uint8Array): Promise<string> => {
  const decoder = new TextDecoder();
  const decrypted = await cryptographer.decrypt(encryptedData, privateKey);
  return decoder.decode(decrypted);
};

export const signData = async (data: string, privateKey: Uint8Array): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  return cryptographer.sign(encoder.encode(data), privateKey);
};

export const verifySignature = async (data: string, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean> => {
  const encoder = new TextEncoder();
  return cryptographer.verify(encoder.encode(data), signature, publicKey);
};

export const resolveAnchor = (kernelId: string): string | undefined => {
  return cryptographer.resolveAnchor(kernelId);
};

export const recordEcho = (glyph: string): void => {
  cryptographer.recordEcho(glyph);
};

export const getGlyphState = (glyph: string) => {
  return cryptographer.getGlyphState(glyph);
};

export const hashData = async (data: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    error('Hashing failed:', err);
    throw new Error('Failed to hash data');
  }
};

export const verifySession = (sessionId: string, timestamp: number): boolean => {
  const now = Date.now();
  const sessionAge = now - timestamp;
  const sessionTimeout = getSecurityConfig().sessionTimeout;

  if (sessionAge > sessionTimeout) {
    warn('Session expired:', { sessionId, age: sessionAge, timeout: sessionTimeout });
    return false;
  }

  return true;
};

export const validateInput = (input: string): boolean => {
  // Basic input validation
  if (!input || typeof input !== 'string') {
    return false;
  }

  // Remove any potentially dangerous characters
  const sanitized = input.replace(/[<>'"]/g, '');
  return sanitized === input;
}; 