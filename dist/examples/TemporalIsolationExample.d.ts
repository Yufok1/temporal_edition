export declare class SystemFlow {
    private isolationModule;
    private activeTasks;
    constructor();
    private setupEventListeners;
    executeSystemTask(taskName: string, duration: number): Promise<void>;
    executeConcurrentTasks(tasks: Array<{
        name: string;
        duration: number;
    }>): Promise<void>;
    getExplorerStatus(): import("../services/TemporalIsolation").IsolationState;
    getActiveTasks(): string[];
    cancelTask(taskName: string): void;
}
