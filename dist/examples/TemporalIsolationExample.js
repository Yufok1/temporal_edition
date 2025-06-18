"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemFlow = void 0;
const TemporalIsolation_1 = require("../services/TemporalIsolation");
const logger_1 = require("../utils/logger");
class SystemFlow {
    constructor() {
        this.isolationModule = new TemporalIsolation_1.TemporalIsolation();
        this.activeTasks = new Map();
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.isolationModule.on('explorerIsolated', (state) => {
            logger_1.logger.info('Explorer isolated', { state });
        });
        this.isolationModule.on('explorerReactivated', (state) => {
            logger_1.logger.info('Explorer reactivated', { state });
        });
        this.isolationModule.on('temporalLockApplied', (data) => {
            logger_1.logger.info('Temporal lock applied', { data });
        });
        this.isolationModule.on('temporalLockRemoved', (data) => {
            logger_1.logger.info('Temporal lock removed', { data });
        });
    }
    async executeSystemTask(taskName, duration) {
        logger_1.logger.info(`Starting system task: ${taskName}`);
        // Check if task is already running
        if (this.activeTasks.has(taskName)) {
            throw new Error(`Task "${taskName}" is already running`);
        }
        // Isolate the Explorer before starting the task
        this.isolationModule.isolateExplorer(`System task in progress: ${taskName}`);
        // Apply temporal lock for the duration of the task
        this.isolationModule.applyTemporalLock(duration);
        // Create a timeout to track task duration
        const timeout = setTimeout(() => {
            this.activeTasks.delete(taskName);
        }, duration);
        this.activeTasks.set(taskName, timeout);
        try {
            // Simulate system task execution
            await new Promise(resolve => setTimeout(resolve, duration));
            logger_1.logger.info(`Completed system task: ${taskName}`);
        }
        catch (error) {
            logger_1.logger.error(`Error in system task: ${taskName}`, { error });
            throw error;
        }
        finally {
            // Cleanup
            clearTimeout(this.activeTasks.get(taskName));
            this.activeTasks.delete(taskName);
            // Remove temporal lock and reactivate Explorer
            this.isolationModule.removeTemporalLock();
            this.isolationModule.reactivateExplorer();
        }
    }
    async executeConcurrentTasks(tasks) {
        logger_1.logger.info('Starting concurrent tasks', { taskCount: tasks.length });
        try {
            await Promise.all(tasks.map(task => this.executeSystemTask(task.name, task.duration)));
            logger_1.logger.info('All concurrent tasks completed successfully');
        }
        catch (error) {
            logger_1.logger.error('Error in concurrent tasks execution', { error });
            throw error;
        }
    }
    getExplorerStatus() {
        return this.isolationModule.getExplorerStatus();
    }
    getActiveTasks() {
        return Array.from(this.activeTasks.keys());
    }
    cancelTask(taskName) {
        const timeout = this.activeTasks.get(taskName);
        if (timeout) {
            clearTimeout(timeout);
            this.activeTasks.delete(taskName);
            logger_1.logger.info(`Task "${taskName}" cancelled`);
        }
        else {
            logger_1.logger.warn(`No active task found with name "${taskName}"`);
        }
    }
}
exports.SystemFlow = SystemFlow;
// Example usage
async function main() {
    const systemFlow = new SystemFlow();
    try {
        // Execute a single system task
        await systemFlow.executeSystemTask('Dependency Installation', 3000);
        // Execute multiple concurrent tasks
        await systemFlow.executeConcurrentTasks([
            { name: 'Task 1', duration: 2000 },
            { name: 'Task 2', duration: 3000 },
            { name: 'Task 3', duration: 1000 }
        ]);
        // Check Explorer status
        const status = systemFlow.getExplorerStatus();
        logger_1.logger.info('Final Explorer status', { status });
        // List active tasks
        const activeTasks = systemFlow.getActiveTasks();
        logger_1.logger.info('Active tasks', { activeTasks });
    }
    catch (error) {
        logger_1.logger.error('Error in main execution', { error });
    }
}
// Run the example
main().catch(error => {
    logger_1.logger.error('Error in main execution', { error });
});
//# sourceMappingURL=TemporalIsolationExample.js.map