"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiddlerExplorer = void 0;
const events_1 = require("events");
const logger_1 = require("../utils/logger");
class RiddlerExplorer extends events_1.EventEmitter {
    constructor() {
        super();
        this.riddleCount = 0;
        this.complexityLevel = 0;
        this.theme = "Batman";
        this.state = {
            complexity: 0,
            count: 0,
            lastRiddle: '',
            timestamp: new Date().toISOString()
        };
    }
    generateRiddle() {
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
        logger_1.logger.info('New riddle generated', {
            riddle,
            complexity: this.complexityLevel,
            count: this.riddleCount
        });
        return riddle;
    }
    createRiddle(depth) {
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
    processRiddle(riddle) {
        logger_1.logger.info('Processing riddle', { riddle });
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
                logger_1.logger.info('Riddle solved', { question, answer });
                return true;
            }
            return false;
        });
        if (!solved) {
            this.emit('unsolved', {
                riddle,
                state: this.state
            });
            logger_1.logger.info('Riddle unsolved', { riddle });
        }
        return solved;
    }
    startRiddleBattle() {
        logger_1.logger.info('Starting riddle battle', {
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
    getState() {
        return { ...this.state };
    }
    reset() {
        this.riddleCount = 0;
        this.complexityLevel = 0;
        this.state = {
            complexity: 0,
            count: 0,
            lastRiddle: '',
            timestamp: new Date().toISOString()
        };
        this.emit('reset', this.state);
        logger_1.logger.info('Riddler state reset');
    }
}
exports.RiddlerExplorer = RiddlerExplorer;
//# sourceMappingURL=RiddlerExplorer.js.map