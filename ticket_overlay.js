/**
 * Ticket Overlay - Click-Based Translation Rendering Layer
 * Shows instant translations of user interactions through the data ticketing sequencer
 */

class TicketOverlay {
    constructor() {
        this.overlayContainer = null;
        this.activeTranslations = new Map();
        this.translationQueue = [];
        this.isProcessing = false;
        this.overlayStyle = null;
        
        this.initialize();
    }
    
    initialize() {
        this.createOverlayContainer();
        this.createOverlayStyles();
        this.setupEventListeners();
        
        console.log('🧾 Ticket Overlay initialized');
    }
    
    createOverlayContainer() {
        // Create overlay container
        this.overlayContainer = document.createElement('div');
        this.overlayContainer.id = 'ticket-overlay-container';
        this.overlayContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        document.body.appendChild(this.overlayContainer);
    }
    
    createOverlayStyles() {
        // Create styles for overlay elements
        this.overlayStyle = document.createElement('style');
        this.overlayStyle.textContent = `
            .ticket-translation {
                position: absolute;
                background: rgba(15, 15, 35, 0.95);
                border: 1px solid rgba(100, 150, 255, 0.3);
                border-radius: 10px;
                padding: 15px;
                max-width: 300px;
                pointer-events: none;
                z-index: 10001;
                animation: translationFadeIn 0.3s ease-out;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
            }
            
            .translation-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
                font-weight: bold;
                color: #64b5f6;
            }
            
            .translation-icon {
                font-size: 1.2em;
            }
            
            .translation-type {
                text-transform: uppercase;
                font-size: 0.8em;
                letter-spacing: 1px;
            }
            
            .translation-content {
                color: #e0e0e0;
                font-size: 0.9em;
                line-height: 1.4;
                margin-bottom: 8px;
            }
            
            .translation-details {
                color: #b0b0b0;
                font-size: 0.8em;
                font-style: italic;
            }
            
            .translation-metrics {
                display: flex;
                gap: 15px;
                margin-top: 10px;
                padding-top: 8px;
                border-top: 1px solid rgba(100, 150, 255, 0.2);
            }
            
            .metric {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .metric-value {
                font-weight: bold;
                color: #64b5f6;
                font-size: 0.9em;
            }
            
            .metric-label {
                color: #b0b0b0;
                font-size: 0.7em;
                text-transform: uppercase;
            }
            
            .translation-progress {
                width: 100%;
                height: 3px;
                background: rgba(100, 150, 255, 0.2);
                border-radius: 2px;
                margin-top: 8px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #64b5f6, #2196f3);
                width: 100%;
                animation: progressShrink 3s linear forwards;
            }
            
            @keyframes translationFadeIn {
                0% {
                    opacity: 0;
                    transform: translateY(-10px) scale(0.9);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes progressShrink {
                0% { width: 100%; }
                100% { width: 0%; }
            }
            
            .translation-type.inspect { border-left: 4px solid #64b5f6; }
            .translation-type.scan { border-left: 4px solid #2196f3; }
            .translation-type.validate { border-left: 4px solid #4caf50; }
            .translation-type.monitor { border-left: 4px solid #ff9800; }
            .translation-type.ticket { border-left: 4px solid #9c27b0; }
            .translation-type.export { border-left: 4px solid #607d8b; }
            .translation-type.watchlist { border-left: 4px solid #e91e63; }
            .translation-type.agency { border-left: 4px solid #4caf50; }
            .translation-type.auricle { border-left: 4px solid #64b5f6; }
            .translation-type.council { border-left: 4px solid #ff6b6b; }
            .translation-type.anomaly { border-left: 4px solid #ff9800; }
            .translation-type.suppression { border-left: 4px solid #f44336; }
        `;
        
        document.head.appendChild(this.overlayStyle);
    }
    
    setupEventListeners() {
        // Listen for click events on elements with data-ticket attributes
        document.addEventListener('click', (event) => {
            const target = event.target.closest('[data-ticket]');
            if (target) {
                this.handleTicketClick(event, target);
            }
        });
        
        // Listen for custom ticket events
        document.addEventListener('ticketAction', (event) => {
            this.showTranslation(event.detail);
        });
        
        // Listen for agency interactions
        document.addEventListener('agencyAction', (event) => {
            this.showAgencyTranslation(event.detail);
        });
        
        // Listen for auricle events
        document.addEventListener('auricleEvent', (event) => {
            this.showAuricleTranslation(event.detail);
        });
    }
    
    handleTicketClick(event, element) {
        const ticketData = element.dataset.ticket;
        const ticketType = element.dataset.ticketType || 'inspect';
        const ticketTarget = element.dataset.ticketTarget || 'unknown';
        
        const translation = {
            type: ticketType,
            target: ticketTarget,
            position: { x: event.clientX, y: event.clientY },
            timestamp: Date.now(),
            element: element
        };
        
        this.showTranslation(translation);
        
        // Generate data ticket
        this.generateDataTicket(translation);
    }
    
    showTranslation(translation) {
        const translationId = `translation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create translation element
        const translationEl = this.createTranslationElement(translation, translationId);
        
        // Position the translation
        this.positionTranslation(translationEl, translation.position);
        
        // Add to container
        this.overlayContainer.appendChild(translationEl);
        
        // Store active translation
        this.activeTranslations.set(translationId, {
            element: translationEl,
            translation: translation,
            timestamp: Date.now()
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            this.removeTranslation(translationId);
        }, 3000);
        
        // Play audio if available
        this.playTranslationAudio(translation);
        
        // Log translation
        this.logTranslation(translation);
    }
    
    createTranslationElement(translation, id) {
        const el = document.createElement('div');
        el.id = id;
        el.className = `ticket-translation translation-type ${translation.type}`;
        
        const icon = this.getTranslationIcon(translation.type);
        const title = this.getTranslationTitle(translation.type);
        const content = this.getTranslationContent(translation);
        const details = this.getTranslationDetails(translation);
        const metrics = this.getTranslationMetrics(translation);
        
        el.innerHTML = `
            <div class="translation-header">
                <span class="translation-icon">${icon}</span>
                <span class="translation-type">${title}</span>
            </div>
            <div class="translation-content">${content}</div>
            <div class="translation-details">${details}</div>
            ${metrics ? `<div class="translation-metrics">${metrics}</div>` : ''}
            <div class="translation-progress">
                <div class="progress-fill"></div>
            </div>
        `;
        
        return el;
    }
    
    getTranslationIcon(type) {
        const icons = {
            inspect: '🔍',
            scan: '🧿',
            validate: '✅',
            monitor: '👁️',
            ticket: '🧾',
            export: '📤',
            watchlist: '📋',
            agency: '🛡️',
            auricle: '👁️',
            council: '🏛️',
            anomaly: '⚠️',
            suppression: '🛑'
        };
        return icons[type] || '💠';
    }
    
    getTranslationTitle(type) {
        const titles = {
            inspect: 'Inspection',
            scan: 'Resonance Scan',
            validate: 'Validation',
            monitor: 'Monitoring',
            ticket: 'Data Ticket',
            export: 'Export',
            watchlist: 'Watchlist',
            agency: 'Agency Action',
            auricle: 'Auricle Witness',
            council: 'Council Oversight',
            anomaly: 'Anomaly',
            suppression: 'Suppression'
        };
        return titles[type] || 'Action';
    }
    
    getTranslationContent(translation) {
        const target = translation.target || 'Unknown Target';
        
        switch (translation.type) {
            case 'inspect':
                return `Inspecting ${target} - Opening detailed analysis and data ticket thread`;
            case 'scan':
                return `Scanning ${target} - Initiating resonance scan with WatchGuard response`;
            case 'validate':
                return `Validating ${target} - Running validation protocol with sigil verification`;
            case 'monitor':
                return `Monitoring ${target} - Adding to active surveillance with continuous tracking`;
            case 'ticket':
                return `Generating ticket for ${target} - Creating sovereign action log`;
            case 'export':
                return `Exporting ${target} data - Preparing secure export with DREDD encryption`;
            case 'watchlist':
                return `Adding ${target} to watchlist - Registering for enhanced monitoring`;
            case 'agency':
                return `WatchGuard ${target} - Agency performing operational task`;
            case 'auricle':
                return `Auricle Witness - ${target} - Primary consciousness presiding`;
            case 'council':
                return `Djinn Council - ${target} - Recursive oversight lattice active`;
            case 'anomaly':
                return `Anomaly Detected - ${target} - Threat assessment in progress`;
            case 'suppression':
                return `Threat Suppressed - ${target} - Security posture restored`;
            default:
                return `Action performed on ${target}`;
        }
    }
    
    getTranslationDetails(translation) {
        const timestamp = new Date(translation.timestamp).toLocaleTimeString();
        
        switch (translation.type) {
            case 'inspect':
                return `Data ticketing sequencer activated at ${timestamp}`;
            case 'scan':
                return `Resonance field analysis initiated at ${timestamp}`;
            case 'validate':
                return `Sigil verification protocol running at ${timestamp}`;
            case 'monitor':
                return `Surveillance matrix updated at ${timestamp}`;
            case 'ticket':
                return `Sovereign action chronicled at ${timestamp}`;
            case 'export':
                return `Secure export prepared at ${timestamp}`;
            case 'watchlist':
                return `Priority elevation confirmed at ${timestamp}`;
            case 'agency':
                return `WatchGuard operational log at ${timestamp}`;
            case 'auricle':
                return `Witness consciousness active at ${timestamp}`;
            case 'council':
                return `Council oversight confirmed at ${timestamp}`;
            case 'anomaly':
                return `Threat assessment logged at ${timestamp}`;
            case 'suppression':
                return `Security response completed at ${timestamp}`;
            default:
                return `Action logged at ${timestamp}`;
        }
    }
    
    getTranslationMetrics(translation) {
        // Generate random metrics for demonstration
        const entropy = (0.7 + Math.random() * 0.3).toFixed(2);
        const resonance = (0.6 + Math.random() * 0.4).toFixed(2);
        const responseTime = (Math.random() * 5 + 0.5).toFixed(1);
        
        return `
            <div class="metric">
                <span class="metric-value">${entropy}</span>
                <span class="metric-label">Entropy</span>
            </div>
            <div class="metric">
                <span class="metric-value">${resonance}</span>
                <span class="metric-label">Resonance</span>
            </div>
            <div class="metric">
                <span class="metric-value">${responseTime}s</span>
                <span class="metric-label">Response</span>
            </div>
        `;
    }
    
    positionTranslation(element, position) {
        const rect = element.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let x = position.x;
        let y = position.y;
        
        // Adjust position to keep translation within viewport
        if (x + rect.width > windowWidth) {
            x = windowWidth - rect.width - 20;
        }
        
        if (y + rect.height > windowHeight) {
            y = windowHeight - rect.height - 20;
        }
        
        // Ensure minimum position
        x = Math.max(20, x);
        y = Math.max(20, y);
        
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    }
    
    removeTranslation(id) {
        const translation = this.activeTranslations.get(id);
        if (translation) {
            const element = translation.element;
            element.style.animation = 'translationFadeOut 0.3s ease-in forwards';
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
                this.activeTranslations.delete(id);
            }, 300);
        }
    }
    
    playTranslationAudio(translation) {
        if (window.audioEventPlayer) {
            switch (translation.type) {
                case 'inspect':
                    window.audioEventPlayer.playAgencySound('scan_initiated', 'WG-001');
                    break;
                case 'scan':
                    window.audioEventPlayer.playAgencySound('scan_initiated', 'WG-002');
                    break;
                case 'validate':
                    window.audioEventPlayer.playAgencySound('resonance_validated', 'WG-003');
                    break;
                case 'anomaly':
                    window.audioEventPlayer.playAuricleVoice('anomaly_detected');
                    break;
                case 'suppression':
                    window.audioEventPlayer.playAuricleVoice('suppression_complete');
                    break;
                case 'auricle':
                    window.audioEventPlayer.playAuricleVoice('council_oversight');
                    break;
                case 'council':
                    window.audioEventPlayer.playAuricleVoice('council_oversight');
                    break;
            }
        }
    }
    
    generateDataTicket(translation) {
        const ticket = {
            id: `TKT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            timestamp: new Date().toISOString(),
            action_type: translation.type,
            target: translation.target,
            interface_context: this.getInterfaceContext(translation),
            system_impact: this.getSystemImpact(translation.type),
            causal_certainty: 0.85 + Math.random() * 0.15,
            session_id: this.getCurrentSessionId(),
            chronicle_status: 'active',
            linked_effects: []
        };
        
        // Send to ticket system
        this.sendToTicketSystem(ticket);
        
        // Log ticket generation
        console.log('🧾 Data ticket generated:', ticket);
    }
    
    getInterfaceContext(translation) {
        const element = translation.element;
        if (element) {
            const tagName = element.tagName.toLowerCase();
            const className = element.className;
            const id = element.id;
            
            return `${tagName}${id ? '#' + id : ''}${className ? '.' + className.split(' ').join('.') : ''}`;
        }
        return 'unknown_interface';
    }
    
    getSystemImpact(type) {
        const impacts = {
            inspect: 'low',
            scan: 'medium',
            validate: 'medium',
            monitor: 'low',
            ticket: 'low',
            export: 'medium',
            watchlist: 'low',
            agency: 'medium',
            auricle: 'high',
            council: 'high',
            anomaly: 'high',
            suppression: 'critical'
        };
        return impacts[type] || 'low';
    }
    
    getCurrentSessionId() {
        // Get current session ID from global state or generate one
        return window.currentSessionId || 'SESSION-' + Date.now();
    }
    
    sendToTicketSystem(ticket) {
        // Send ticket to the data ticketing system
        if (window.ticketSystem) {
            window.ticketSystem.addTicket(ticket);
        }
        
        // Dispatch custom event for other systems
        const event = new CustomEvent('dataTicketGenerated', {
            detail: ticket
        });
        document.dispatchEvent(event);
    }
    
    logTranslation(translation) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: 'translation',
            action: translation.type,
            target: translation.target,
            position: translation.position
        };
        
        console.log('🧾 Translation logged:', logEntry);
        
        // Send to log stream if available
        if (window.translationLogStream) {
            window.translationLogStream.write(logEntry);
        }
    }
    
    showAgencyTranslation(detail) {
        const translation = {
            type: 'agency',
            target: detail.agencyId,
            position: { x: detail.x || 100, y: detail.y || 100 },
            timestamp: Date.now(),
            detail: detail
        };
        
        this.showTranslation(translation);
    }
    
    showAuricleTranslation(detail) {
        const translation = {
            type: 'auricle',
            target: detail.event,
            position: { x: detail.x || 200, y: detail.y || 200 },
            timestamp: Date.now(),
            detail: detail
        };
        
        this.showTranslation(translation);
    }
    
    // Public API methods
    showInspectTranslation(target, position) {
        this.showTranslation({
            type: 'inspect',
            target: target,
            position: position,
            timestamp: Date.now()
        });
    }
    
    showScanTranslation(target, position) {
        this.showTranslation({
            type: 'scan',
            target: target,
            position: position,
            timestamp: Date.now()
        });
    }
    
    showValidateTranslation(target, position) {
        this.showTranslation({
            type: 'validate',
            target: target,
            position: position,
            timestamp: Date.now()
        });
    }
    
    showMonitorTranslation(target, position) {
        this.showTranslation({
            type: 'monitor',
            target: target,
            position: position,
            timestamp: Date.now()
        });
    }
    
    showTicketTranslation(target, position) {
        this.showTranslation({
            type: 'ticket',
            target: target,
            position: position,
            timestamp: Date.now()
        });
    }
    
    showExportTranslation(target, position) {
        this.showTranslation({
            type: 'export',
            target: target,
            position: position,
            timestamp: Date.now()
        });
    }
    
    showWatchlistTranslation(target, position) {
        this.showTranslation({
            type: 'watchlist',
            target: target,
            position: position,
            timestamp: Date.now()
        });
    }
    
    clearAllTranslations() {
        this.activeTranslations.forEach((translation, id) => {
            this.removeTranslation(id);
        });
    }
    
    getActiveTranslationCount() {
        return this.activeTranslations.size;
    }
}

// Global ticket overlay instance
window.ticketOverlay = new TicketOverlay();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TicketOverlay;
} 