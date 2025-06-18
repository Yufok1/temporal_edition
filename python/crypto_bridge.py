# Copyright 2024 The Temporal Editioner Contributors
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# 

#!/usr/bin/env python3

import json
import sys
import base64
import asyncio
import logging
from typing import Dict, List, Optional, Union, Any
from dataclasses import dataclass
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, ec
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
import os
import liboqs
from liboqs import KeyEncapsulation, Signature

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class CryptoPrimitive:
    name: str
    type: str
    securityLevel: int
    keySize: int
    isQuantumResistant: bool

@dataclass
class KeyPair:
    publicKey: bytes
    privateKey: bytes
    algorithm: str
    securityLevel: int

class PostQuantumCrypto:
    def __init__(self):
        self.kem = liboqs.KeyEncapsulation
        self.sig = liboqs.Signature
        self.available_kems = liboqs.get_enabled_KEM_mechanisms()
        self.available_sigs = liboqs.get_enabled_SIG_mechanisms()
        
        # Initialize recommended algorithms
        self.recommended_kem = 'Kyber768'
        self.recommended_sig = 'Dilithium3'
        
        # Initialize algorithm instances
        self.kem_instances = {}
        self.sig_instances = {}
        
        # Initialize with recommended algorithms
        self._initialize_algorithm(self.recommended_kem, 'kem')
        self._initialize_algorithm(self.recommended_sig, 'sig')

    def _initialize_algorithm(self, algorithm: str, algo_type: str):
        try:
            if algo_type == 'kem':
                self.kem_instances[algorithm] = self.kem(algorithm)
            elif algo_type == 'sig':
                self.sig_instances[algorithm] = self.sig(algorithm)
        except Exception as e:
            logging.error(f"Failed to initialize {algo_type} algorithm {algorithm}: {e}")

    def get_kem(self, algorithm: str = None) -> liboqs.KeyEncapsulation:
        if algorithm is None:
            algorithm = self.recommended_kem
        if algorithm not in self.kem_instances:
            self._initialize_algorithm(algorithm, 'kem')
        return self.kem_instances[algorithm]

    def get_sig(self, algorithm: str = None) -> liboqs.Signature:
        if algorithm is None:
            algorithm = self.recommended_sig
        if algorithm not in self.sig_instances:
            self._initialize_algorithm(algorithm, 'sig')
        return self.sig_instances[algorithm]

    def generate_kem_keypair(self, algorithm: str = None) -> Dict[str, bytes]:
        kem = self.get_kem(algorithm)
        public_key = kem.generate_keypair()
        return {
            'public_key': public_key,
            'private_key': kem.export_secret_key()
        }

    def generate_sig_keypair(self, algorithm: str = None) -> Dict[str, bytes]:
        sig = self.get_sig(algorithm)
        public_key = sig.generate_keypair()
        return {
            'public_key': public_key,
            'private_key': sig.export_secret_key()
        }

    def encapsulate(self, public_key: bytes, algorithm: str = None) -> Dict[str, bytes]:
        kem = self.get_kem(algorithm)
        ciphertext, shared_secret = kem.encap_secret(public_key)
        return {
            'ciphertext': ciphertext,
            'shared_secret': shared_secret
        }

    def decapsulate(self, ciphertext: bytes, private_key: bytes, algorithm: str = None) -> bytes:
        kem = self.get_kem(algorithm)
        return kem.decap_secret(ciphertext, private_key)

    def sign(self, message: bytes, private_key: bytes, algorithm: str = None) -> bytes:
        sig = self.get_sig(algorithm)
        return sig.sign(message, private_key)

    def verify(self, message: bytes, signature: bytes, public_key: bytes, algorithm: str = None) -> bool:
        sig = self.get_sig(algorithm)
        return sig.verify(message, signature, public_key)

    def get_available_algorithms(self) -> Dict[str, List[str]]:
        return {
            'kem': self.available_kems,
            'sig': self.available_sigs
        }

    def get_recommended_algorithms(self) -> Dict[str, str]:
        return {
            'kem': self.recommended_kem,
            'sig': self.recommended_sig
        }

class CryptoBridge:
    def __init__(self):
        self.pq = PostQuantumCrypto()
        self.available_primitives = [
            CryptoPrimitive('RSA', 'classical', 2048, False),
            CryptoPrimitive('AES', 'classical', 256, False),
            CryptoPrimitive('Kyber768', 'post-quantum', 256, True),
            CryptoPrimitive('Dilithium3', 'post-quantum', 256, True),
            CryptoPrimitive('Falcon-512', 'post-quantum', 256, True),
            CryptoPrimitive('Classic-McEliece-348864', 'post-quantum', 256, True)
        ]

    async def handle_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        try:
            operation = request.get('operation')
            if not operation:
                return self._error_response('No operation specified')

            if operation == 'generate_keypair':
                return await self._handle_keypair_generation(request)
            elif operation == 'encrypt':
                return await self._handle_encryption(request)
            elif operation == 'decrypt':
                return await self._handle_decryption(request)
            elif operation == 'get_primitives':
                return self._success_response({
                    'primitives': [p.__dict__ for p in self.available_primitives]
                })
            else:
                return self._error_response(f'Unknown operation: {operation}')

        except Exception as e:
            logging.error(f"Error handling request: {e}")
            return self._error_response(str(e))

    async def _handle_keypair_generation(self, request: Dict[str, Any]) -> Dict[str, Any]:
        algorithm = request.get('algorithm')
        if not algorithm:
            return self._error_response('No algorithm specified')

        try:
            if algorithm.startswith('Kyber'):
                keypair = self.pq.generate_kem_keypair(algorithm)
            elif algorithm.startswith('Dilithium'):
                keypair = self.pq.generate_sig_keypair(algorithm)
            elif algorithm.startswith('Falcon'):
                keypair = self.pq.generate_sig_keypair(algorithm)
            elif algorithm.startswith('Classic-McEliece'):
                keypair = self.pq.generate_kem_keypair(algorithm)
            else:
                return self._error_response(f'Unsupported algorithm: {algorithm}')

            return self._success_response({
                'public_key': base64.b64encode(keypair['public_key']).decode(),
                'private_key': base64.b64encode(keypair['private_key']).decode()
            })
        except Exception as e:
            return self._error_response(f'Key generation failed: {str(e)}')

    async def _handle_encryption(self, request: Dict[str, Any]) -> Dict[str, Any]:
        algorithm = request.get('algorithm')
        data = request.get('data')
        public_key = request.get('public_key')

        if not all([algorithm, data, public_key]):
            return self._error_response('Missing required parameters')

        try:
            data_bytes = base64.b64decode(data)
            public_key_bytes = base64.b64decode(public_key)

            if algorithm.startswith('Kyber') or algorithm.startswith('Classic-McEliece'):
                result = self.pq.encapsulate(public_key_bytes, algorithm)
                return self._success_response({
                    'ciphertext': base64.b64encode(result['ciphertext']).decode(),
                    'shared_secret': base64.b64encode(result['shared_secret']).decode()
                })
            else:
                return self._error_response(f'Unsupported algorithm: {algorithm}')

        except Exception as e:
            return self._error_response(f'Encryption failed: {str(e)}')

    async def _handle_decryption(self, request: Dict[str, Any]) -> Dict[str, Any]:
        algorithm = request.get('algorithm')
        ciphertext = request.get('ciphertext')
        private_key = request.get('private_key')

        if not all([algorithm, ciphertext, private_key]):
            return self._error_response('Missing required parameters')

        try:
            ciphertext_bytes = base64.b64decode(ciphertext)
            private_key_bytes = base64.b64decode(private_key)

            if algorithm.startswith('Kyber') or algorithm.startswith('Classic-McEliece'):
                shared_secret = self.pq.decapsulate(ciphertext_bytes, private_key_bytes, algorithm)
                return self._success_response({
                    'shared_secret': base64.b64encode(shared_secret).decode()
                })
            else:
                return self._error_response(f'Unsupported algorithm: {algorithm}')

        except Exception as e:
            return self._error_response(f'Decryption failed: {str(e)}')

    def _success_response(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'status': 'success',
            'data': data
        }

    def _error_response(self, message: str) -> Dict[str, Any]:
        return {
            'status': 'error',
            'error': message
        }

async def main():
    bridge = CryptoBridge()
    
    while True:
        try:
            request = json.loads(sys.stdin.readline())
            response = await bridge.handle_request(request)
            print(json.dumps(response))
            sys.stdout.flush()
        except EOFError:
            break
        except Exception as e:
            logger.error(f"Error in main loop: {str(e)}")
            print(json.dumps({
                'success': False,
                'error': str(e)
            }))
            sys.stdout.flush()

if __name__ == "__main__":
    asyncio.run(main()) 