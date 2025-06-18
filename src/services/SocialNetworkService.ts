import { EmotionalAnalysis, EnvironmentalContext } from '../types/whale';

interface WhaleNode {
  id: string;
  name: string;
  emotionalState: EmotionalAnalysis;
  position: { x: number; y: number };
  lastInteraction: Date;
}

interface SocialBond {
  sourceId: string;
  targetId: string;
  strength: number;
  type: 'mentoring' | 'caregiving' | 'play' | 'social';
  lastInteraction: Date;
  interactionCount: number;
  emotionalInvestment: number;
}

interface SocialNetwork {
  nodes: WhaleNode[];
  bonds: SocialBond[];
  lastUpdated: Date;
}

export class SocialNetworkService {
  private network: SocialNetwork = {
    nodes: [],
    bonds: [],
    lastUpdated: new Date()
  };

  private readonly maxNodes: number = 20; // Maximum number of whales to track
  private readonly bondDecayRate: number = 0.1; // Rate at which bond strength decays over time

  public updateNetwork(
    whaleId: string,
    emotionalAnalysis: EmotionalAnalysis,
    environmentalContext: EnvironmentalContext
  ): void {
    // Update or create whale node
    const nodeIndex = this.network.nodes.findIndex(node => node.id === whaleId);
    const node: WhaleNode = {
      id: whaleId,
      name: `Whale ${whaleId}`,
      emotionalState: emotionalAnalysis,
      position: this.calculateNodePosition(whaleId),
      lastInteraction: new Date()
    };

    if (nodeIndex === -1) {
      if (this.network.nodes.length < this.maxNodes) {
        this.network.nodes.push(node);
      }
    } else {
      this.network.nodes[nodeIndex] = node;
    }

    // Update bonds based on environmental context
    this.updateBonds(whaleId, environmentalContext);
    
    // Decay old bonds
    this.decayBonds();
    
    this.network.lastUpdated = new Date();
  }

  public getNetwork(): SocialNetwork {
    return this.network;
  }

  public getBondStrength(whaleId1: string, whaleId2: string): number {
    const bond = this.network.bonds.find(
      b => (b.sourceId === whaleId1 && b.targetId === whaleId2) ||
           (b.sourceId === whaleId2 && b.targetId === whaleId1)
    );
    return bond ? bond.strength : 0;
  }

  private calculateNodePosition(whaleId: string): { x: number; y: number } {
    // Use a deterministic algorithm to position nodes
    const index = this.network.nodes.findIndex(node => node.id === whaleId);
    if (index === -1) {
      // New node - position in a circle
      const angle = (this.network.nodes.length * 2 * Math.PI) / this.maxNodes;
      return {
        x: 0.5 + 0.4 * Math.cos(angle),
        y: 0.5 + 0.4 * Math.sin(angle)
      };
    }
    return this.network.nodes[index].position;
  }

  private updateBonds(whaleId: string, environmentalContext: EnvironmentalContext): void {
    const otherWhales = this.network.nodes.filter(node => node.id !== whaleId);
    
    otherWhales.forEach(otherWhale => {
      const existingBond = this.network.bonds.find(
        b => (b.sourceId === whaleId && b.targetId === otherWhale.id) ||
             (b.sourceId === otherWhale.id && b.targetId === whaleId)
      );

      if (existingBond) {
        // Strengthen existing bond
        existingBond.strength = Math.min(1, existingBond.strength + 0.1);
        existingBond.lastInteraction = new Date();
        existingBond.interactionCount++;
      } else {
        // Create new bond
        const bond: SocialBond = {
          sourceId: whaleId,
          targetId: otherWhale.id,
          strength: 0.3, // Initial bond strength
          type: this.determineBondType(environmentalContext),
          lastInteraction: new Date(),
          interactionCount: 1,
          emotionalInvestment: 0.5
        };
        this.network.bonds.push(bond);
      }
    });
  }

  private determineBondType(context: EnvironmentalContext): 'mentoring' | 'caregiving' | 'play' | 'social' {
    // Determine bond type based on environmental context and group dynamics
    if (context.socialContext.groupSize > 5) {
      return 'social';
    }
    // Add more sophisticated logic based on other context factors
    return 'social';
  }

  private decayBonds(): void {
    const now = new Date();
    this.network.bonds.forEach(bond => {
      const timeSinceLastInteraction = (now.getTime() - bond.lastInteraction.getTime()) / 1000;
      const decay = this.bondDecayRate * (timeSinceLastInteraction / 3600); // Decay per hour
      bond.strength = Math.max(0, bond.strength - decay);
    });

    // Remove very weak bonds
    this.network.bonds = this.network.bonds.filter(bond => bond.strength > 0.1);
  }

  public getNodeMetrics(whaleId: string): {
    centrality: number;
    bondCount: number;
    averageBondStrength: number;
  } {
    const bonds = this.network.bonds.filter(
      b => b.sourceId === whaleId || b.targetId === whaleId
    );

    const bondCount = bonds.length;
    const averageBondStrength = bondCount > 0
      ? bonds.reduce((sum, b) => sum + b.strength, 0) / bondCount
      : 0;

    // Calculate centrality (simplified version)
    const centrality = bondCount / (this.network.nodes.length - 1);

    return {
      centrality,
      bondCount,
      averageBondStrength
    };
  }
} 