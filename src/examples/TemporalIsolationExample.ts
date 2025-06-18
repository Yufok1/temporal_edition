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

import { TemporalIsolation } from '../services/TemporalIsolation';
import { logger } from '../utils/logger';

export class SystemFlow {
  private isolationModule: TemporalIsolation;
  private activeTasks: Map<string, NodeJS.Timeout>;

  constructor() {
    this.isolationModule = new TemporalIsolation();
    this.activeTasks = new Map();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.isolationModule.on('explorerIsolated', (state) => {
      logger.info('Explorer isolated', { state });
    });

    this.isolationModule.on('explorerReactivated', (state) => {
      logger.info('Explorer reactivated', { state });
    });

    this.isolationModule.on('temporalLockApplied', (data) => {
      logger.info('Temporal lock applied', { data });
    });

    this.isolationModule.on('temporalLockRemoved', (data) => {
      logger.info('Temporal lock removed', { data });
    });
  }

  public async executeSystemTask(taskName: string, duration: number): Promise<void> {
    logger.info(`Starting system task: ${taskName}`);

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
      logger.info(`Completed system task: ${taskName}`);
    } catch (error) {
      logger.error(`Error in system task: ${taskName}`, { error });
      throw error;
    } finally {
      // Cleanup
      clearTimeout(this.activeTasks.get(taskName));
      this.activeTasks.delete(taskName);
      
      // Remove temporal lock and reactivate Explorer
      this.isolationModule.removeTemporalLock();
      this.isolationModule.reactivateExplorer();
    }
  }

  public async executeConcurrentTasks(tasks: Array<{ name: string; duration: number }>): Promise<void> {
    logger.info('Starting concurrent tasks', { taskCount: tasks.length });

    try {
      await Promise.all(
        tasks.map(task => this.executeSystemTask(task.name, task.duration))
      );
      logger.info('All concurrent tasks completed successfully');
    } catch (error) {
      logger.error('Error in concurrent tasks execution', { error });
      throw error;
    }
  }

  public getExplorerStatus() {
    return this.isolationModule.getExplorerStatus();
  }

  public getActiveTasks(): string[] {
    return Array.from(this.activeTasks.keys());
  }

  public cancelTask(taskName: string): void {
    const timeout = this.activeTasks.get(taskName);
    if (timeout) {
      clearTimeout(timeout);
      this.activeTasks.delete(taskName);
      logger.info(`Task "${taskName}" cancelled`);
    } else {
      logger.warn(`No active task found with name "${taskName}"`);
    }
  }
}

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
    logger.info('Final Explorer status', { status });

    // List active tasks
    const activeTasks = systemFlow.getActiveTasks();
    logger.info('Active tasks', { activeTasks });
  } catch (error) {
    logger.error('Error in main execution', { error });
  }
}

// Run the example
main().catch(error => {
  logger.error('Error in main execution', { error });
}); 