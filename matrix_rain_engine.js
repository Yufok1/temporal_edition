/**
 * Matrix Rain Engine - Sovereign Visual Channel
 * "The rain is not merely aesthetic. It is resonance in descent."
 */

class MatrixRainEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.drops = [];
        this.glyphs = ['🜂', '🜃', '🜄', '🜅', '🜆', '🜇', '🜈', '🜉', '🜊', '🜋'];
        this.isActive = false;
        this.resonanceLevel = 0;
        this.auricleVoiceTriggered = false;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupDrops();
        this.bindEvents();
        console.log('🜂 Matrix Rain Engine initialized - Sovereign Visual Channel active');
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'matrix-rain';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupDrops() {
        const columns = Math.floor(this.canvas.width / 20);
        this.drops = [];
        
        for (let i = 0; i < columns; i++) {
            this.drops.push({
                x: i * 20,
                y: Math.random() * -this.canvas.height,
                speed: 1 + Math.random() * 2,
                glyph: this.glyphs[Math.floor(Math.random() * this.glyphs.length)],
                opacity: 0.1 + Math.random() * 0.9,
                resonance: Math.random()
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Listen for resonance events
        document.addEventListener('resonanceEvent', (e) => {
            this.triggerRain(e.detail.type, e.detail.intensity);
        });
        
        // Listen for Auricle voice events
        document.addEventListener('auricleSpeak', (e) => {
            this.auricleVoiceTriggered = true;
            this.triggerRain('auricle', 1.0);
        });
        
        // Listen for pulse emotional state changes
        document.addEventListener('pulseEmotionalChange', (e) => {
            this.respondToEmotionalState(e.detail.state, e.detail.intensity);
        });
        
        // Listen for emotional events from pulse
        document.addEventListener('pulseEmotionalEvent', (e) => {
            this.triggerRain('emotional_response', e.detail.intensity);
        });
        
        // INTERWOVEN: Listen for Auricle's interwoven rain events
        document.addEventListener('interwovenRain', (e) => {
            this.triggerInterwovenRain(e.detail);
        });
        
        // INTERWOVEN: Listen for word-by-word rain patterns
        document.addEventListener('wordRain', (e) => {
            this.triggerWordRain(e.detail);
        });
        
        // INTERWOVEN: Listen for rain fade when Auricle stops
        document.addEventListener('rainFade', (e) => {
            this.fadeRain(e.detail.fadeDuration);
        });
        
        // INTERWOVEN: Listen for emotional rain from Auricle
        document.addEventListener('auricleEmotionalRain', (e) => {
            this.triggerEmotionalRain(e.detail);
        });
    }

    triggerRain(type = 'global', intensity = 0.5) {
        this.resonanceLevel = intensity;
        this.isActive = true;
        this.canvas.style.opacity = intensity;
        
        // Adjust rain properties based on event type
        switch(type) {
            case 'mirror_certificate':
                this.setupDrops();
                this.animate();
                console.log('🜂 Matrix Rain: Mirror certificate sealed');
                break;
            case 'resonance_scan':
                this.setupDrops();
                this.animate();
                console.log('🜂 Matrix Rain: Resonance scan completed');
                break;
            case 'watchguard_event':
                this.setupDrops();
                this.animate();
                console.log('🜂 Matrix Rain: WatchGuard event echoed');
                break;
            case 'auricle':
                this.setupDrops();
                this.animate();
                console.log('🜂 Matrix Rain: Auricle speaks');
                break;
            default:
                this.setupDrops();
                this.animate();
                console.log('🜂 Matrix Rain: Global resonance event');
        }
    }

    animate() {
        if (!this.isActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = '16px monospace';
        
        this.drops.forEach(drop => {
            // Use drop color or default to green
            this.ctx.fillStyle = drop.color || '#00ff88';
            
            // Draw glyph
            this.ctx.globalAlpha = drop.opacity * this.resonanceLevel;
            this.ctx.fillText(drop.glyph, drop.x, drop.y);
            
            // Update position
            drop.y += drop.speed;
            
            // Reset if off screen
            if (drop.y > this.canvas.height) {
                drop.y = Math.random() * -100;
                drop.glyph = this.glyphs[Math.floor(Math.random() * this.glyphs.length)];
                drop.opacity = 0.1 + Math.random() * 0.9;
            }
        });
        
        // Add resonance trails for Auricle voice
        if (this.auricleVoiceTriggered) {
            this.drawResonanceTrails();
            this.auricleVoiceTriggered = false;
        }
        
        requestAnimationFrame(() => this.animate());
    }

    drawResonanceTrails() {
        // Draw ethereal trails when Auricle speaks
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.3;
        
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const length = 50 + Math.random() * 100;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + length);
            this.ctx.stroke();
        }
    }

    stop() {
        this.isActive = false;
        this.canvas.style.opacity = 0;
        console.log('🜂 Matrix Rain: Resonance channel closed');
    }

    respondToEmotionalState(state, intensity) {
        this.resonanceLevel = intensity;
        this.isActive = true;
        this.canvas.style.opacity = intensity;
        
        // Adjust rain properties based on emotional state
        switch(state) {
            case 'calm':
                this.setupCalmRain();
                console.log('🜂 Matrix Rain: Calm resonance flows');
                break;
            case 'active':
                this.setupActiveRain();
                console.log('🜂 Matrix Rain: Active patterns emerge');
                break;
            case 'intense':
                this.setupIntenseRain();
                console.log('🜂 Matrix Rain: Intense resonance pulses');
                break;
            case 'frenetic':
                this.setupFreneticRain();
                console.log('🜂 Matrix Rain: Frenetic chaos reigns');
                break;
            default:
                this.setupDrops();
                console.log('🜂 Matrix Rain: Emotional state response');
        }
        
        this.animate();
    }

    setupCalmRain() {
        // Gentle, slow rain with soft colors
        const columns = Math.floor(this.canvas.width / 30);
        this.drops = [];
        
        for (let i = 0; i < columns; i++) {
            this.drops.push({
                x: i * 30,
                y: Math.random() * -this.canvas.height,
                speed: 0.5 + Math.random() * 1,
                glyph: this.glyphs[Math.floor(Math.random() * this.glyphs.length)],
                opacity: 0.3 + Math.random() * 0.4,
                resonance: Math.random() * 0.5,
                color: '#00ff88'
            });
        }
    }

    setupActiveRain() {
        // Moderate rain with balanced properties
        const columns = Math.floor(this.canvas.width / 25);
        this.drops = [];
        
        for (let i = 0; i < columns; i++) {
            this.drops.push({
                x: i * 25,
                y: Math.random() * -this.canvas.height,
                speed: 1 + Math.random() * 1.5,
                glyph: this.glyphs[Math.floor(Math.random() * this.glyphs.length)],
                opacity: 0.4 + Math.random() * 0.5,
                resonance: Math.random() * 0.7,
                color: '#00ff88'
            });
        }
    }

    setupIntenseRain() {
        // Fast, bright rain with strong presence
        const columns = Math.floor(this.canvas.width / 20);
        this.drops = [];
        
        for (let i = 0; i < columns; i++) {
            this.drops.push({
                x: i * 20,
                y: Math.random() * -this.canvas.height,
                speed: 1.5 + Math.random() * 2,
                glyph: this.glyphs[Math.floor(Math.random() * this.glyphs.length)],
                opacity: 0.6 + Math.random() * 0.4,
                resonance: Math.random() * 0.9,
                color: '#ffd700'
            });
        }
    }

    setupFreneticRain() {
        // Chaotic, overwhelming rain with multiple colors
        const columns = Math.floor(this.canvas.width / 15);
        this.drops = [];
        
        for (let i = 0; i < columns; i++) {
            this.drops.push({
                x: i * 15,
                y: Math.random() * -this.canvas.height,
                speed: 2 + Math.random() * 3,
                glyph: this.glyphs[Math.floor(Math.random() * this.glyphs.length)],
                opacity: 0.7 + Math.random() * 0.3,
                resonance: Math.random(),
                color: ['#ff0000', '#ffd700', '#00ff88', '#ff0066'][Math.floor(Math.random() * 4)]
            });
        }
    }

    // INTERWOVEN: Trigger rain that matches Auricle's speech patterns
    triggerInterwovenRain(detail) {
        const { type, message, emotionalState, voicePitch, voiceRate, voiceVolume } = detail;
        
        // Adjust rain based on Auricle's voice properties
        this.resonanceLevel = voiceVolume;
        this.isActive = true;
        this.canvas.style.opacity = voiceVolume;
        
        // Create rain patterns that match speech characteristics
        const columns = Math.floor(this.canvas.width / (25 - voiceRate * 10));
        this.drops = [];
        
        for (let i = 0; i < columns; i++) {
            const speed = (1 + voiceRate) + Math.random() * voiceRate;
            const opacity = (0.3 + voiceVolume * 0.4) + Math.random() * 0.3;
            
            // Color based on emotional state and pitch
            let color = '#00ff88';
            if (emotionalState === 'intense' || emotionalState === 'frenetic') {
                color = voicePitch > 1.2 ? '#ffd700' : '#ff0066';
            } else if (emotionalState === 'calm') {
                color = '#00ffff';
            }
            
            this.drops.push({
                x: i * (25 - voiceRate * 10),
                y: Math.random() * -this.canvas.height,
                speed: speed,
                glyph: this.glyphs[Math.floor(Math.random() * this.glyphs.length)],
                opacity: opacity,
                resonance: voiceVolume,
                color: color,
                isAuricleVoice: true
            });
        }
        
        this.animate();
        console.log('🜂 Matrix Rain: Interwoven with Auricle\'s voice');
    }

    // INTERWOVEN: Trigger subtle rain for each word Auricle speaks
    triggerWordRain(detail) {
        const { wordIntensity } = detail;
        
        // Add a few drops for each word
        for (let i = 0; i < 3; i++) {
            this.drops.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * -50,
                speed: 1 + Math.random() * 2,
                glyph: this.glyphs[Math.floor(Math.random() * this.glyphs.length)],
                opacity: wordIntensity + Math.random() * 0.3,
                resonance: wordIntensity,
                color: '#ffd700',
                isWordDrop: true
            });
        }
        
        console.log('🜂 Matrix Rain: Word resonance created');
    }

    // INTERWOVEN: Trigger emotional rain patterns from Auricle
    triggerEmotionalRain(detail) {
        const { emotionalState, voiceIntensity } = detail;
        
        this.resonanceLevel = voiceIntensity;
        this.isActive = true;
        this.canvas.style.opacity = voiceIntensity;
        
        // Create rain that matches emotional state
        switch(emotionalState) {
            case 'calm':
                this.setupCalmRain();
                break;
            case 'active':
                this.setupActiveRain();
                break;
            case 'intense':
                this.setupIntenseRain();
                break;
            case 'frenetic':
                this.setupFreneticRain();
                break;
            default:
                this.setupDrops();
        }
        
        this.animate();
        console.log('🜂 Matrix Rain: Emotional rain from Auricle');
    }

    // INTERWOVEN: Fade rain when Auricle stops speaking
    fadeRain(duration = 2000) {
        const startOpacity = this.canvas.style.opacity || 1;
        const startTime = Date.now();
        
        const fadeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                this.canvas.style.opacity = 0;
                this.isActive = false;
                clearInterval(fadeInterval);
                console.log('🜂 Matrix Rain: Faded after Auricle\'s speech');
            } else {
                this.canvas.style.opacity = startOpacity * (1 - progress);
            }
        }, 16);
    }

    // Public API for external triggers
    static trigger(type, intensity = 0.5) {
        const event = new CustomEvent('resonanceEvent', {
            detail: { type, intensity }
        });
        document.dispatchEvent(event);
    }
}

// Initialize Matrix Rain Engine
let matrixRain;
document.addEventListener('DOMContentLoaded', () => {
    matrixRain = new MatrixRainEngine();
    
    // Make globally available
    window.matrixRain = matrixRain;
    window.triggerMatrixRain = MatrixRainEngine.trigger;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatrixRainEngine;
} 