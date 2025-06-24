#!/usr/bin/env python3
"""
Sigil Distortion Overlay Generator
Applies distortion patterns to sigils based on resonance levels
Creates misalignment feedback for mirror trap glyph logic
"""

import json
import hashlib
import random
import math
from datetime import datetime
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass

@dataclass
class SigilPoint:
    x: float
    y: float
    intensity: float
    resonance: float

@dataclass
class DistortionPattern:
    name: str
    resonance_level: str
    distortion_factor: float
    pattern_type: str
    parameters: Dict[str, Any]

class SigilDistortionEngine:
    def __init__(self):
        self.base_sigils = {
            'glyph-hash-01': self._generate_base_glyph_01(),
            'glyph-hash-02': self._generate_base_glyph_02(),
            'djinn-resonance-01': self._generate_djinn_resonance_01(),
            'whale-echo-01': self._generate_whale_echo_01(),
            'mirror-trap-01': self._generate_mirror_trap_01()
        }
        
        self.distortion_patterns = {
            'low': [
                DistortionPattern('gentle_ripple', 'low', 0.1, 'wave', {'frequency': 2, 'amplitude': 0.05}),
                DistortionPattern('soft_blur', 'low', 0.15, 'gaussian', {'sigma': 0.5}),
                DistortionPattern('subtle_shift', 'low', 0.08, 'linear', {'offset_x': 0.02, 'offset_y': 0.02})
            ],
            'medium': [
                DistortionPattern('moderate_distortion', 'medium', 0.3, 'spiral', {'turns': 1.5, 'radius': 0.3}),
                DistortionPattern('wave_interference', 'medium', 0.25, 'interference', {'waves': 3, 'phase': 0.5}),
                DistortionPattern('fractal_noise', 'medium', 0.2, 'fractal', {'octaves': 2, 'persistence': 0.5})
            ],
            'high': [
                DistortionPattern('intense_distortion', 'high', 0.6, 'vortex', {'strength': 0.8, 'center_x': 0.5, 'center_y': 0.5}),
                DistortionPattern('chaos_pattern', 'high', 0.5, 'chaos', {'iterations': 10, 'sensitivity': 0.7}),
                DistortionPattern('quantum_shift', 'high', 0.4, 'quantum', {'superposition': True, 'entanglement': 0.6})
            ],
            'critical': [
                DistortionPattern('reality_break', 'critical', 0.9, 'break', {'fracture_lines': 5, 'severity': 0.9}),
                DistortionPattern('void_consumption', 'critical', 0.8, 'void', {'void_radius': 0.4, 'consumption_rate': 0.8}),
                DistortionPattern('temporal_loop', 'critical', 0.7, 'temporal', {'loop_count': 3, 'time_dilation': 0.7})
            ]
        }
        
    def _generate_base_glyph_01(self) -> List[SigilPoint]:
        """Generate base glyph pattern 01"""
        points = []
        for i in range(100):
            angle = (i / 100) * 2 * math.pi
            radius = 0.3 + 0.1 * math.sin(3 * angle)
            x = 0.5 + radius * math.cos(angle)
            y = 0.5 + radius * math.sin(angle)
            intensity = 0.5 + 0.3 * math.sin(2 * angle)
            resonance = 0.6 + 0.2 * math.cos(angle)
            points.append(SigilPoint(x, y, intensity, resonance))
        return points
        
    def _generate_base_glyph_02(self) -> List[SigilPoint]:
        """Generate base glyph pattern 02"""
        points = []
        for i in range(150):
            t = i / 150
            x = 0.5 + 0.4 * math.cos(2 * math.pi * t) * (1 + 0.2 * math.sin(5 * t))
            y = 0.5 + 0.4 * math.sin(2 * math.pi * t) * (1 + 0.2 * math.cos(5 * t))
            intensity = 0.4 + 0.4 * math.sin(7 * t)
            resonance = 0.5 + 0.3 * math.cos(3 * t)
            points.append(SigilPoint(x, y, intensity, resonance))
        return points
        
    def _generate_djinn_resonance_01(self) -> List[SigilPoint]:
        """Generate Djinn resonance pattern"""
        points = []
        for i in range(200):
            t = i / 200
            # Complex spiral pattern
            angle = 4 * math.pi * t
            radius = 0.1 + 0.3 * t
            x = 0.5 + radius * math.cos(angle)
            y = 0.5 + radius * math.sin(angle)
            intensity = 0.6 + 0.3 * math.sin(8 * t)
            resonance = 0.7 + 0.2 * math.cos(4 * t)
            points.append(SigilPoint(x, y, intensity, resonance))
        return points
        
    def _generate_whale_echo_01(self) -> List[SigilPoint]:
        """Generate whale echo pattern"""
        points = []
        for i in range(120):
            t = i / 120
            # Echo wave pattern
            x = 0.5 + 0.35 * math.cos(2 * math.pi * t) * math.exp(-2 * t)
            y = 0.5 + 0.35 * math.sin(2 * math.pi * t) * math.exp(-2 * t)
            intensity = 0.5 + 0.4 * math.exp(-3 * t)
            resonance = 0.6 + 0.3 * math.sin(6 * t)
            points.append(SigilPoint(x, y, intensity, resonance))
        return points
        
    def _generate_mirror_trap_01(self) -> List[SigilPoint]:
        """Generate mirror trap pattern"""
        points = []
        for i in range(80):
            t = i / 80
            # Fractal-like trap pattern
            x = 0.5 + 0.3 * math.cos(3 * math.pi * t) * (1 + 0.1 * math.sin(10 * t))
            y = 0.5 + 0.3 * math.sin(3 * math.pi * t) * (1 + 0.1 * math.cos(10 * t))
            intensity = 0.8 + 0.2 * math.sin(12 * t)
            resonance = 0.9 + 0.1 * math.cos(6 * t)
            points.append(SigilPoint(x, y, intensity, resonance))
        return points
        
    def apply_distortion(self, sigil_id: str, resonance_level: str, entropy: float) -> Dict[str, Any]:
        """Apply distortion to a sigil based on resonance level and entropy"""
        if sigil_id not in self.base_sigils:
            raise ValueError(f"Unknown sigil ID: {sigil_id}")
            
        if resonance_level not in self.distortion_patterns:
            raise ValueError(f"Unknown resonance level: {resonance_level}")
            
        base_points = self.base_sigils[sigil_id]
        patterns = self.distortion_patterns[resonance_level]
        
        # Select pattern based on entropy
        pattern = random.choice(patterns)
        
        # Apply distortion
        distorted_points = []
        for point in base_points:
            distorted_point = self._apply_pattern_to_point(point, pattern, entropy)
            distorted_points.append(distorted_point)
            
        # Generate misalignment feedback
        misalignment = self._calculate_misalignment(base_points, distorted_points)
        
        return {
            'sigil_id': sigil_id,
            'resonance_level': resonance_level,
            'entropy': entropy,
            'pattern_applied': pattern.name,
            'distortion_factor': pattern.distortion_factor,
            'original_points': len(base_points),
            'distorted_points': len(distorted_points),
            'misalignment_score': misalignment,
            'distorted_sigil': self._points_to_dict(distorted_points),
            'timestamp': datetime.now().isoformat(),
            'echo_signature': self._generate_echo_signature(sigil_id, resonance_level, entropy, pattern.name)
        }
        
    def _apply_pattern_to_point(self, point: SigilPoint, pattern: DistortionPattern, entropy: float) -> SigilPoint:
        """Apply distortion pattern to a single point"""
        x, y = point.x, point.y
        
        if pattern.pattern_type == 'wave':
            freq = pattern.parameters['frequency']
            amp = pattern.parameters['amplitude']
            x += amp * math.sin(freq * x * 2 * math.pi) * pattern.distortion_factor
            y += amp * math.cos(freq * y * 2 * math.pi) * pattern.distortion_factor
            
        elif pattern.pattern_type == 'spiral':
            turns = pattern.parameters['turns']
            radius = pattern.parameters['radius']
            angle = math.atan2(y - 0.5, x - 0.5)
            distance = math.sqrt((x - 0.5)**2 + (y - 0.5)**2)
            spiral_offset = radius * math.sin(turns * angle) * pattern.distortion_factor
            x += spiral_offset * math.cos(angle)
            y += spiral_offset * math.sin(angle)
            
        elif pattern.pattern_type == 'vortex':
            strength = pattern.parameters['strength']
            center_x = pattern.parameters['center_x']
            center_y = pattern.parameters['center_y']
            dx = x - center_x
            dy = y - center_y
            distance = math.sqrt(dx**2 + dy**2)
            if distance > 0:
                angle = math.atan2(dy, dx)
                vortex_angle = strength * pattern.distortion_factor / (1 + distance)
                new_angle = angle + vortex_angle
                x = center_x + distance * math.cos(new_angle)
                y = center_y + distance * math.sin(new_angle)
                
        elif pattern.pattern_type == 'chaos':
            iterations = pattern.parameters['iterations']
            sensitivity = pattern.parameters['sensitivity']
            for _ in range(iterations):
                chaos_x = math.sin(sensitivity * x) * math.cos(sensitivity * y)
                chaos_y = math.cos(sensitivity * x) * math.sin(sensitivity * y)
                x += chaos_x * pattern.distortion_factor * 0.1
                y += chaos_y * pattern.distortion_factor * 0.1
                
        elif pattern.pattern_type == 'break':
            fracture_lines = pattern.parameters['fracture_lines']
            severity = pattern.parameters['severity']
            for i in range(fracture_lines):
                line_angle = (i / fracture_lines) * math.pi
                distance_to_line = abs((x - 0.5) * math.cos(line_angle) + (y - 0.5) * math.sin(line_angle))
                if distance_to_line < 0.1:
                    break_offset = severity * pattern.distortion_factor * (0.1 - distance_to_line)
                    x += break_offset * math.cos(line_angle + math.pi/2)
                    y += break_offset * math.sin(line_angle + math.pi/2)
                    
        # Clamp coordinates to [0, 1]
        x = max(0, min(1, x))
        y = max(0, min(1, y))
        
        # Adjust intensity and resonance based on distortion
        intensity = point.intensity * (1 + pattern.distortion_factor * 0.5)
        resonance = point.resonance * (1 - pattern.distortion_factor * 0.3)
        
        return SigilPoint(x, y, intensity, resonance)
        
    def _calculate_misalignment(self, original: List[SigilPoint], distorted: List[SigilPoint]) -> float:
        """Calculate misalignment score between original and distorted sigils"""
        if len(original) != len(distorted):
            return 1.0
            
        total_displacement = 0
        for orig, dist in zip(original, distorted):
            displacement = math.sqrt((orig.x - dist.x)**2 + (orig.y - dist.y)**2)
            total_displacement += displacement
            
        return total_displacement / len(original)
        
    def _points_to_dict(self, points: List[SigilPoint]) -> List[Dict[str, float]]:
        """Convert points to dictionary format"""
        return [
            {
                'x': point.x,
                'y': point.y,
                'intensity': point.intensity,
                'resonance': point.resonance
            }
            for point in points
        ]
        
    def _generate_echo_signature(self, sigil_id: str, resonance_level: str, entropy: float, pattern_name: str) -> str:
        """Generate echo signature for the distortion"""
        data = f"{sigil_id}:{resonance_level}:{entropy:.4f}:{pattern_name}:{datetime.now().isoformat()}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]
        
    def generate_mirror_trap_glyph(self, gate_id: str, reason: str, entropy: float) -> Dict[str, Any]:
        """Generate a mirror trap glyph with misalignment feedback"""
        # Create a synthetic sigil for the trap
        trap_points = []
        for i in range(50):
            t = i / 50
            # Create a deceptive pattern that looks legitimate but is misaligned
            x = 0.5 + 0.3 * math.cos(2 * math.pi * t) * (1 + 0.3 * math.sin(7 * t))
            y = 0.5 + 0.3 * math.sin(2 * math.pi * t) * (1 + 0.3 * math.cos(7 * t))
            intensity = 0.6 + 0.3 * math.sin(9 * t)
            resonance = 0.4 + 0.4 * math.cos(5 * t)  # Lower resonance to indicate trap
            trap_points.append(SigilPoint(x, y, intensity, resonance))
            
        # Apply severe distortion to create misalignment
        pattern = DistortionPattern('trap_misalignment', 'critical', 0.8, 'break', {'fracture_lines': 8, 'severity': 0.9})
        
        distorted_trap = []
        for point in trap_points:
            distorted_point = self._apply_pattern_to_point(point, pattern, entropy)
            distorted_trap.append(distorted_point)
            
        misalignment = self._calculate_misalignment(trap_points, distorted_trap)
        
        return {
            'gate_id': gate_id,
            'reason': reason,
            'entropy': entropy,
            'trap_type': 'mirror_glyph',
            'misalignment_score': misalignment,
            'trap_sigil': self._points_to_dict(distorted_trap),
            'original_sigil': self._points_to_dict(trap_points),
            'timestamp': datetime.now().isoformat(),
            'echo_signature': self._generate_echo_signature(f"trap-{gate_id}", 'critical', entropy, 'trap_misalignment')
        }
        
    def validate_sigil_resonance(self, sigil_data: Dict[str, Any], expected_resonance: float) -> Dict[str, Any]:
        """Validate sigil resonance and detect anomalies"""
        points = sigil_data.get('distorted_sigil', [])
        if not points:
            return {'valid': False, 'reason': 'No sigil points found'}
            
        # Calculate average resonance
        avg_resonance = sum(point['resonance'] for point in points) / len(points)
        
        # Calculate resonance variance
        variance = sum((point['resonance'] - avg_resonance)**2 for point in points) / len(points)
        
        # Check for anomalies
        anomalies = []
        for i, point in enumerate(points):
            if abs(point['resonance'] - avg_resonance) > 2 * math.sqrt(variance):
                anomalies.append({
                    'point_index': i,
                    'resonance': point['resonance'],
                    'expected_range': [avg_resonance - 2 * math.sqrt(variance), avg_resonance + 2 * math.sqrt(variance)]
                })
                
        return {
            'valid': abs(avg_resonance - expected_resonance) < 0.1,
            'average_resonance': avg_resonance,
            'expected_resonance': expected_resonance,
            'resonance_variance': variance,
            'anomalies_detected': len(anomalies),
            'anomalies': anomalies,
            'confidence_score': 1.0 - (len(anomalies) / len(points))
        }

def main():
    """Example usage of the sigil distortion engine"""
    engine = SigilDistortionEngine()
    
    print("=== Sigil Distortion Engine Demo ===")
    
    # Test different sigils and resonance levels
    test_cases = [
        ('glyph-hash-01', 'low', 0.3),
        ('djinn-resonance-01', 'medium', 0.5),
        ('whale-echo-01', 'high', 0.7),
        ('mirror-trap-01', 'critical', 0.9)
    ]
    
    for sigil_id, resonance_level, entropy in test_cases:
        print(f"\n--- Testing {sigil_id} at {resonance_level} resonance (entropy: {entropy:.2f}) ---")
        
        # Apply distortion
        result = engine.apply_distortion(sigil_id, resonance_level, entropy)
        
        print(f"Pattern applied: {result['pattern_applied']}")
        print(f"Distortion factor: {result['distortion_factor']:.3f}")
        print(f"Misalignment score: {result['misalignment_score']:.3f}")
        print(f"Echo signature: {result['echo_signature']}")
        
        # Validate resonance
        validation = engine.validate_sigil_resonance(result, 0.6)
        print(f"Resonance validation: {'✓' if validation['valid'] else '✗'}")
        print(f"Confidence score: {validation['confidence_score']:.3f}")
        
    # Generate a mirror trap
    print(f"\n--- Generating Mirror Trap Glyph ---")
    trap = engine.generate_mirror_trap_glyph('wallet-divine', 'insufficient_entropy', 0.25)
    print(f"Trap misalignment: {trap['misalignment_score']:.3f}")
    print(f"Trap echo signature: {trap['echo_signature']}")
    
    # Save results to file
    with open('sigil_distortion_results.json', 'w') as f:
        json.dump({
            'test_cases': test_cases,
            'results': [engine.apply_distortion(s, r, e) for s, r, e in test_cases],
            'mirror_trap': trap
        }, f, indent=2)
        
    print(f"\nResults saved to sigil_distortion_results.json")

if __name__ == "__main__":
    main() 