import { EventEmitter } from 'events';
import { logger } from '../utils/logger';

export interface RiddleState {
  complexity: number;
  count: number;
  lastRiddle: string;
  timestamp: string;
}

export class RiddlerExplorer extends EventEmitter {
  private riddleCount: number = 0;
  private complexityLevel: number = 0;
  private theme: string = "Batman";
  private state: RiddleState;

  constructor() {
    super();
    this.state = {
      complexity: 0,
      count: 0,
      lastRiddle: '',
      timestamp: new Date().toISOString()
    };
  }

  public generateRiddle(): string {
    this.riddleCount++;
    this.complexityLevel++;
    
    const riddle = this.createRiddle(this.complexityLevel);
    
    // Update state
    this.state = {
      complexity: this.complexityLevel,
      count: this.riddleCount,
      lastRiddle: riddle,
      timestamp: new Date().toISOString()
    };

    // Emit events
    this.emit('newRiddle', { riddle, state: this.state });
    logger.info('New riddle generated', { 
      riddle, 
      complexity: this.complexityLevel,
      count: this.riddleCount 
    });

    return riddle;
  }

  private createRiddle(depth: number): string {
    const riddles = [
      "What has keys but can't open locks?",
      "What can travel around the world while staying in the corner?",
      "The more you take, the more you leave behind. What am I?",
      "What has a head and a tail that will never meet?",
      "What has cities, but no houses; forests, but no trees; and rivers, but no water?"
    ];

    let riddle = riddles[0];
    
    // Add complexity based on depth
    if (depth > 1) {
      riddle += ` ${riddles[1]}`;
    }
    if (depth > 2) {
      riddle += ` ${riddles[2]}`;
    }
    if (depth > 3) {
      riddle += ` ${riddles[3]}`;
    }
    if (depth > 4) {
      riddle += ` ${riddles[4]}`;
    }

    return riddle;
  }

  public processRiddle(riddle: string): boolean {
    logger.info('Processing riddle', { riddle });
    
    // Simple solution check (can be expanded)
    const solutions = {
      "What has keys but can't open locks?": "A piano",
      "What can travel around the world while staying in the corner?": "A stamp",
      "The more you take, the more you leave behind. What am I?": "Footsteps",
      "What has a head and a tail that will never meet?": "A coin",
      "What has cities, but no houses; forests, but no trees; and rivers, but no water?": "A map"
    };

    // Check if any part of the riddle matches a known solution
    const solved = Object.entries(solutions).some(([question, answer]) => {
      if (riddle.includes(question)) {
        this.emit('solved', { 
          riddle: question, 
          answer,
          state: this.state 
        });
        logger.info('Riddle solved', { question, answer });
        return true;
      }
      return false;
    });

    if (!solved) {
      this.emit('unsolved', { 
        riddle, 
        state: this.state 
      });
      logger.info('Riddle unsolved', { riddle });
    }

    return solved;
  }

  public startRiddleBattle(): void {
    logger.info('Starting riddle battle', { 
      complexity: this.complexityLevel,
      count: this.riddleCount 
    });

    let riddle = this.generateRiddle();
    let solved = this.processRiddle(riddle);

    if (!solved) {
      // Generate a more complex riddle
      riddle = this.generateRiddle();
      this.processRiddle(riddle);
    }
  }

  public getState(): RiddleState {
    return { ...this.state };
  }

  public reset(): void {
    this.riddleCount = 0;
    this.complexityLevel = 0;
    this.state = {
      complexity: 0,
      count: 0,
      lastRiddle: '',
      timestamp: new Date().toISOString()
    };
    this.emit('reset', this.state);
    logger.info('Riddler state reset');
  }
} 