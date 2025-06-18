import { EventEmitter } from 'events';

export type StewardType = 'human' | 'ai' | 'whale' | 'cryptographer' | 'loki' | 'non-steward';
export type RecognitionStatus = 'pending' | 'approved' | 'denied' | 'quarantined' | 'acclimatizing';
export type PeckingTier = 1 | 2 | 3 | 4 | 5; // 1 = Whale, 2 = Senior Steward, 3 = Steward, 4 = Observer, 5 = Non-Steward

export interface Steward {
  id: string;
  type: StewardType;
  name: string;
  status: RecognitionStatus;
  lastRecognized: number | null;
  peckingTier: PeckingTier;
  quarantineLevel?: number;
  deceptionLevel?: number;
  rateLimitCount?: number;
  lastActionTime?: number;
  failedAttempts?: number;
  acclimatizationState?: 'none' | 'training' | 'grace' | 'escalate';
  privileges?: string[]; // e.g., ['bypassRiddler', 'governingAgent', 'ruleRewriter', 'systemTrigger']
  disguisedAs?: string; // ID of the steward being impersonated
}

export interface ObservationEvent {
  stewardId: string;
  action: string;
  timestamp: number;
  details?: any;
  result?: string;
  feedback?: string;
  peckingTier?: PeckingTier;
  overriddenBy?: string;
}

export class RiddlerExplorerService extends EventEmitter {
  private stewards: Map<string, Steward> = new Map();
  private auditLog: ObservationEvent[] = [];
  private rateLimitWindow = 10000; // 10 seconds
  private maxActionsPerWindow = 5;
  private acclimatizationThreshold = 3;
  private graceThreshold = 2;
  private forbiddenActions: string[] = ['sabotage', 'harm', 'block', 'impersonate'];

  // Get the current forbidden actions list
  public getForbiddenActions(): string[] {
    return [...this.forbiddenActions];
  }

  // Set or update the forbidden actions list
  public setForbiddenActions(actions: string[]): void {
    this.forbiddenActions = [...actions];
  }

  // Assign pecking tier based on type and status
  private assignPeckingTier(type: StewardType, status: RecognitionStatus): PeckingTier {
    if (type === 'whale' && status === 'approved') return 1;
    if (type === 'human' && status === 'approved') return 2;
    if (type === 'ai' && status === 'approved') return 3;
    if (status === 'acclimatizing') return 4;
    return 5; // non-steward, denied, quarantined
  }

  // Quantum recognition protocol
  requestRecognition(steward: Omit<Steward, 'status' | 'lastRecognized' | 'peckingTier' | 'quarantineLevel' | 'deceptionLevel' | 'rateLimitCount' | 'lastActionTime' | 'failedAttempts' | 'acclimatizationState'>): RecognitionStatus {
    let status: RecognitionStatus;
    let acclimatizationState: 'none' | 'training' | 'grace' | 'escalate' = 'none';
    if (steward.type === 'human' || steward.type === 'ai') {
      status = 'acclimatizing';
      acclimatizationState = 'training';
    } else if (steward.type === 'whale') {
      status = 'approved';
    } else {
      status = 'quarantined';
    }
    const peckingTier = this.assignPeckingTier(steward.type, status);
    this.stewards.set(steward.id, {
      ...steward,
      status,
      lastRecognized: status === 'approved' ? Date.now() : null,
      peckingTier,
      quarantineLevel: status === 'quarantined' ? 1 : 0,
      deceptionLevel: status === 'quarantined' ? 1 : 0,
      rateLimitCount: 0,
      lastActionTime: 0,
      failedAttempts: 0,
      acclimatizationState
    });
    this.logEvent(steward.id, 'recognition', { status, peckingTier });
    return status;
  }

  // Enforce pecking order: lower-tier actions can be overridden by higher-tier stewards
  enforcePeckingOrder(stewardId: string, action: string, details?: any): boolean {
    const steward = this.stewards.get(stewardId);
    if (!steward) return false;
    // Find any higher-tier stewards
    const higher = Array.from(this.stewards.values()).filter(s => s.peckingTier < steward.peckingTier && s.status === 'approved');
    if (higher.length > 0) {
      // Action is subject to override
      this.logEvent(stewardId, 'pecking_order_overridden', { action, details, peckingTier: steward.peckingTier, overriddenBy: higher[0].id, feedback: 'Action overridden by higher-tier steward.' });
      return false;
    }
    return true;
  }

  // Detect and handle aggression/conflict between stewards
  private detectStewardConflict(stewardId: string, action: string, details?: any): boolean {
    // If the action targets another steward and is potentially harmful/aggressive
    if (details && details.targetStewardId && details.targetStewardId !== stewardId) {
      const target = this.stewards.get(details.targetStewardId);
      if (target && target.status === 'approved') {
        // Check for forbidden actions (now extensible)
        if (this.forbiddenActions.includes(action)) {
          this.logEvent(stewardId, 'steward_conflict', {
            action,
            details,
            result: 'conflict_detected',
            feedback: 'Non-aggression principle violated. Escalating to council review.'
          });
          this.emit('alert', {
            type: 'steward_conflict',
            stewardId,
            targetStewardId: details.targetStewardId,
            action,
            details
          });
          return true;
        }
      }
    }
    return false;
  }

  // Checkpoint for observation/interaction
  checkpoint(stewardId: string, action: string, details?: any): boolean {
    // Detect and handle aggression/conflict before proceeding
    if (this.detectStewardConflict(stewardId, action, details)) {
      // Optionally, escalate or block the action
      return false;
    }
    const steward = this.stewards.get(stewardId);
    if (!steward) {
      this.logEvent(stewardId, 'checkpoint_denied', { action, details, result: 'unknown_steward', feedback: 'Unrecognized entity. Please request recognition.' });
      return false;
    }
    // --- CRYPTOGRAPHER BYPASS ---
    if (steward.type === 'cryptographer' || (steward.privileges && steward.privileges.includes('bypassRiddler'))) {
      this.logEvent(stewardId, action, { ...details, result: 'allowed', feedback: 'Cryptographer privilege: riddler bypassed.' });
      return true;
    }
    // Pecking order enforcement
    if (!this.enforcePeckingOrder(stewardId, action, details)) {
      return false;
    }
    // Acclimatization logic
    if (steward.status === 'acclimatizing') {
      steward.failedAttempts = (steward.failedAttempts || 0);
      if (steward.acclimatizationState === 'training') {
        this.logEvent(stewardId, 'checkpoint_training', { action, details, result: 'training', feedback: 'You are in training mode. Please follow the guidance provided.' });
        if (steward.failedAttempts < this.acclimatizationThreshold) {
          return true;
        } else {
          steward.acclimatizationState = 'grace';
          this.logEvent(stewardId, 'acclimatization_grace', { feedback: 'You are now in a grace period. Please proceed carefully.' });
        }
      }
      if (steward.acclimatizationState === 'grace') {
        if (steward.failedAttempts < this.acclimatizationThreshold + this.graceThreshold) {
          this.logEvent(stewardId, 'checkpoint_grace', { action, details, result: 'grace', feedback: 'You are in a grace period. Mistakes are tolerated, but repeated failures will escalate.' });
          return true;
        } else {
          steward.acclimatizationState = 'escalate';
          steward.status = 'quarantined';
          this.logEvent(stewardId, 'acclimatization_escalated', { feedback: 'You have exceeded the grace period. Escalating to quarantine.' });
          return false;
        }
      }
      if (steward.acclimatizationState === 'escalate') {
        this.logEvent(stewardId, 'checkpoint_quarantined', { action, details, result: 'quarantined', feedback: 'You are now quarantined. Please contact the council for review.' });
        return false;
      }
    }
    // Rate limiting
    const now = Date.now();
    if (steward.lastActionTime && now - steward.lastActionTime < this.rateLimitWindow) {
      steward.rateLimitCount = (steward.rateLimitCount || 0) + 1;
      if (steward.rateLimitCount > this.maxActionsPerWindow) {
        this.logEvent(stewardId, 'checkpoint_denied', { action, details, result: 'rate_limited', feedback: 'You are being rate limited. Please slow down.' });
        return false;
      }
    } else {
      steward.rateLimitCount = 1;
      steward.lastActionTime = now;
    }
    // Quarantine and deception for non-stewards
    if (steward.status === 'quarantined' || steward.type === 'non-steward') {
      this.logEvent(stewardId, 'checkpoint_quarantined', { action, details, result: 'quarantined', feedback: 'You are quarantined. No real actions are allowed.' });
      return false;
    }
    if (steward.status !== 'approved') {
      steward.failedAttempts = (steward.failedAttempts || 0) + 1;
      this.logEvent(stewardId, 'checkpoint_denied', { action, details, result: 'not_approved', feedback: 'You are not yet approved. Please complete acclimatization or contact the council.' });
      return false;
    }
    this.logEvent(stewardId, action, { ...details, result: 'allowed', feedback: 'Action allowed.' });
    return true;
  }

  // Log all events for audit
  private logEvent(stewardId: string, action: string, details?: any) {
    this.auditLog.push({
      stewardId,
      action,
      timestamp: Date.now(),
      details
    });
    this.emit('audit', { stewardId, action, details });
  }

  // Expose audit log for review
  getAuditLog(): ObservationEvent[] {
    return [...this.auditLog];
  }

  // Revoke or suspend recognition
  revokeRecognition(stewardId: string) {
    const steward = this.stewards.get(stewardId);
    if (steward) {
      steward.status = 'denied';
      this.logEvent(stewardId, 'recognition_revoked');
    }
  }

  // List all stewards and their status
  listStewards(): Steward[] {
    return Array.from(this.stewards.values());
  }

  // Djinn Council hooks
  escalateQuarantine(stewardId: string, level: number = 2) {
    const steward = this.stewards.get(stewardId);
    if (steward) {
      steward.status = 'quarantined';
      steward.quarantineLevel = level;
      this.logEvent(stewardId, 'quarantine_escalated', { level });
    }
  }

  setDeceptionLevel(stewardId: string, level: number = 1) {
    const steward = this.stewards.get(stewardId);
    if (steward) {
      steward.deceptionLevel = level;
      this.logEvent(stewardId, 'deception_level_set', { level });
    }
  }

  // Honor system/defense hooks
  engageDefenseProtocol(stewardId: string, protocol: string) {
    this.logEvent(stewardId, 'defense_protocol_engaged', { protocol });
    // Integrate with external defense systems as needed
  }

  destroyOrDisseminate(stewardId: string, action: 'destroy' | 'disseminate') {
    this.logEvent(stewardId, 'destroy_or_disseminate', { action });
    // Integrate with external honor/defense systems as needed
  }

  /**
   * Allows Loki to dynamically escalate privileges.
   * @param stewardId - The ID of the steward (must be Loki).
   * @param newPrivileges - Array of new privileges to add.
   * @returns boolean - True if escalation was successful.
   */
  public escalatePrivileges(stewardId: string, newPrivileges: string[]): boolean {
    const steward = this.stewards.get(stewardId);
    if (!steward || steward.type !== 'loki') {
      this.logEvent(stewardId, 'escalate_privileges_denied', { newPrivileges, result: 'not_loki', feedback: 'Only Loki can escalate privileges.' });
      return false;
    }
    steward.privileges = [...(steward.privileges || []), ...newPrivileges];
    this.logEvent(stewardId, 'escalate_privileges', { newPrivileges, result: 'allowed', feedback: 'Privileges escalated.' });
    return true;
  }

  /**
   * Allows Loki to disguise as another steward.
   * @param stewardId - The ID of the steward (must be Loki).
   * @param targetStewardId - The ID of the steward to impersonate.
   * @returns boolean - True if disguise was successful.
   */
  public disguiseAs(stewardId: string, targetStewardId: string): boolean {
    const steward = this.stewards.get(stewardId);
    const targetSteward = this.stewards.get(targetStewardId);
    if (!steward || steward.type !== 'loki' || !targetSteward) {
      this.logEvent(stewardId, 'disguise_denied', { targetStewardId, result: 'not_loki_or_invalid_target', feedback: 'Only Loki can disguise, and target must exist.' });
      return false;
    }
    steward.disguisedAs = targetStewardId;
    this.logEvent(stewardId, 'disguise', { targetStewardId, result: 'allowed', feedback: 'Loki disguised as ' + targetSteward.name });
    return true;
  }
} 