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

// Djinn Council Service - Manages the mystical network of Djinn entities
export class DjinnCouncilService {
    private djinnCouncil: Map<string, DjinnEntity> = new Map();
    private activeDecisions: Map<string, CouncilDecision> = new Map();
    private governanceRules: GovernanceRule[] = [];

    // Browser-safe metrics
    private metrics = {
        totalDjinn: 0,
        activeDjinn: 0,
        decisionsTotal: 0,
        decisionsApproved: 0,
        governanceViolations: 0,
        consensusSuccess: 0,
        wisdomQueries: 0
    };

    constructor() {
        this.initializeCouncil();
        console.log('🧞 Djinn Council Service initialized (browser-safe)');
    }

    private initializeCouncil(): void {
        // Initialize primary djinn entities
        this.registerDjinn({
            id: 'MARID_PRIME',
            name: 'Marid the Wise',
            type: 'water',
            power: 100,
            wisdom: 95,
            status: 'active',
            specialization: 'temporal_flow'
        });

        this.registerDjinn({
            id: 'IFRIT_GUARDIAN',
            name: 'Ifrit the Protector',
            type: 'fire',
            power: 95,
            wisdom: 80,
            status: 'active',
            specialization: 'security'
        });

        this.registerDjinn({
            id: 'JANN_OBSERVER',
            name: 'Jann the Watcher',
            type: 'air',
            power: 85,
            wisdom: 90,
            status: 'active',
            specialization: 'monitoring'
        });

        // Initialize governance rules
        this.initializeGovernanceRules();
    }

    private initializeGovernanceRules(): void {
        this.governanceRules = [
            {
                id: 'RULE_001',
                name: 'Consensus Requirement',
                type: 'consensus',
                threshold: 0.66,
                description: 'Major decisions require 66% djinn approval'
            },
            {
                id: 'RULE_002',
                name: 'Wisdom Threshold',
                type: 'wisdom',
                threshold: 80,
                description: 'Decision makers must have wisdom >= 80'
            },
            {
                id: 'RULE_003',
                name: 'Emergency Override',
                type: 'emergency',
                threshold: 0.9,
                description: '90% consensus can override standard protocols'
            }
        ];
    }

    public registerDjinn(djinn: DjinnEntity): void {
        this.djinnCouncil.set(djinn.id, djinn);
        this.metrics.totalDjinn++;
        if (djinn.status === 'active') {
            this.metrics.activeDjinn++;
        }
        console.log(`🧞 Djinn registered: ${djinn.name} (${djinn.type})`);
    }

    public async requestDecision(request: DecisionRequest): Promise<CouncilDecision> {
        const decision: CouncilDecision = {
            id: `DECISION_${Date.now()}`,
            request,
            status: 'pending',
            votes: new Map(),
            timestamp: Date.now()
        };

        this.activeDecisions.set(decision.id, decision);
        this.metrics.decisionsTotal++;

        // Gather votes from active djinn
        const activeDjinn = Array.from(this.djinnCouncil.values())
            .filter(d => d.status === 'active');

        for (const djinn of activeDjinn) {
            const vote = await this.getDjinnVote(djinn, request);
            decision.votes.set(djinn.id, vote);
        }

        // Calculate consensus
        const approvals = Array.from(decision.votes.values())
            .filter(v => v.decision === 'approve').length;
        const consensus = approvals / activeDjinn.length;

        // Check governance rules
        const meetsConsensus = consensus >= 0.66;
        const meetsWisdom = activeDjinn.every(d => d.wisdom >= 80);

        if (meetsConsensus && meetsWisdom) {
            decision.status = 'approved';
            decision.consensus = consensus;
            this.metrics.decisionsApproved++;
            this.metrics.consensusSuccess++;
        } else {
            decision.status = 'rejected';
            decision.consensus = consensus;
            if (!meetsConsensus) {
                console.log(`❌ Decision rejected: insufficient consensus (${(consensus * 100).toFixed(1)}%)`);
            }
            if (!meetsWisdom) {
                console.log('❌ Decision rejected: wisdom threshold not met');
                this.metrics.governanceViolations++;
            }
        }

        return decision;
    }

    private async getDjinnVote(djinn: DjinnEntity, request: DecisionRequest): Promise<DjinnVote> {
        // Simulate djinn decision-making based on their attributes
        const wisdomFactor = djinn.wisdom / 100;
        const powerFactor = djinn.power / 100;
        const urgencyFactor = request.urgency === 'critical' ? 0.9 : 0.5;

        const approvalScore = (wisdomFactor * 0.6 + powerFactor * 0.2 + urgencyFactor * 0.2);

        return {
            djinnId: djinn.id,
            decision: approvalScore > 0.6 ? 'approve' : 'reject',
            reasoning: this.generateReasoning(djinn, approvalScore),
            confidence: approvalScore
        };
    }

    private generateReasoning(djinn: DjinnEntity, score: number): string {
        const reasons = {
            water: [
                'The flow of time supports this action',
                'Temporal currents are favorable',
                'The cosmic tide is aligned'
            ],
            fire: [
                'This action strengthens our defenses',
                'Security protocols are maintained',
                'Protection is assured'
            ],
            air: [
                'Observations indicate positive outcomes',
                'Monitoring suggests approval',
                'Patterns favor this decision'
            ],
            earth: [
                'Foundation remains stable',
                'Structural integrity maintained',
                'Grounded approach confirmed'
            ]
        };

        const typeReasons = reasons[djinn.type] || reasons.air;
        const reasonIndex = Math.floor(score * typeReasons.length);
        return typeReasons[Math.min(reasonIndex, typeReasons.length - 1)];
    }

    public async seekDjinnWisdom(query: string, context: any): Promise<any> {
        this.metrics.wisdomQueries++;
        
        // Find the wisest available djinn
        const wisestDjinn = Array.from(this.djinnCouncil.values())
            .filter(d => d.status === 'active')
            .sort((a, b) => b.wisdom - a.wisdom)[0];

        if (!wisestDjinn) {
            return {
                wisdom: 'No djinn available for consultation',
                source: 'none'
            };
        }

        return {
            wisdom: this.generateWisdom(wisestDjinn, query),
            source: wisestDjinn.name,
            confidence: wisestDjinn.wisdom / 100,
            pattern: this.detectPattern(query),
            cosmicResonance: Math.random() * 0.3 + 0.7 // 0.7-1.0
        };
    }

    private generateWisdom(djinn: DjinnEntity, query: string): string {
        const wisdomTemplates = {
            water: [
                'Like water, let your actions flow with purpose',
                'The tide of destiny ebbs and flows',
                'In stillness, find clarity'
            ],
            fire: [
                'Let passion guide but not consume',
                'From ashes rises strength',
                'The flame that burns twice as bright...'
            ],
            air: [
                'Observe the patterns in the wind',
                'Knowledge flows on unseen currents',
                'Rise above to see clearly'
            ],
            earth: [
                'Build upon solid foundations',
                'Patience shapes mountains',
                'Deep roots weather any storm'
            ]
        };

        const typeWisdom = wisdomTemplates[djinn.type] || wisdomTemplates.air;
        return typeWisdom[Math.floor(Math.random() * typeWisdom.length)];
    }

    private detectPattern(query: string): string {
        const patterns = [
            'question_answer',
            'wisdom_application', 
            'collaborative_discovery',
            'synchronized_insight'
        ];
        
        // Simple pattern detection based on query keywords
        if (query.includes('?')) return 'question_answer';
        if (query.includes('wisdom') || query.includes('guide')) return 'wisdom_application';
        if (query.includes('together') || query.includes('collaborate')) return 'collaborative_discovery';
        
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    public getCouncilStatus(): CouncilStatus {
        const activeDjinn = Array.from(this.djinnCouncil.values())
            .filter(d => d.status === 'active');

        return {
            totalMembers: this.djinnCouncil.size,
            activeMembers: activeDjinn.length,
            pendingDecisions: Array.from(this.activeDecisions.values())
                .filter(d => d.status === 'pending').length,
            governanceHealth: this.calculateGovernanceHealth(),
            metrics: { ...this.metrics }
        };
    }

    private calculateGovernanceHealth(): number {
        const factors = [
            this.metrics.activeDjinn / Math.max(this.metrics.totalDjinn, 1),
            this.metrics.decisionsApproved / Math.max(this.metrics.decisionsTotal, 1),
            this.metrics.consensusSuccess / Math.max(this.metrics.decisionsTotal, 1),
            1 - (this.metrics.governanceViolations / Math.max(this.metrics.decisionsTotal, 1))
        ];

        return factors.reduce((a, b) => a + b, 0) / factors.length;
    }
}

// Type definitions
interface DjinnEntity {
    id: string;
    name: string;
    type: 'water' | 'fire' | 'air' | 'earth';
    power: number; // 0-100
    wisdom: number; // 0-100
    status: 'active' | 'dormant' | 'banished';
    specialization: string;
}

interface DecisionRequest {
    id: string;
    type: string;
    description: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    requester: string;
    context: any;
}

interface DjinnVote {
    djinnId: string;
    decision: 'approve' | 'reject' | 'abstain';
    reasoning: string;
    confidence: number;
}

interface CouncilDecision {
    id: string;
    request: DecisionRequest;
    status: 'pending' | 'approved' | 'rejected';
    votes: Map<string, DjinnVote>;
    consensus?: number;
    timestamp: number;
}

interface GovernanceRule {
    id: string;
    name: string;
    type: string;
    threshold: number;
    description: string;
}

interface CouncilStatus {
    totalMembers: number;
    activeMembers: number;
    pendingDecisions: number;
    governanceHealth: number;
    metrics: any;
} 