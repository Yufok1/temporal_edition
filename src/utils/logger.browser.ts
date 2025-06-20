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

// Browser-safe logger implementation
class BrowserLogger {
    private logLevel: string;
    private logs: Array<{ level: string; message: string; timestamp: string; metadata?: any }> = [];

    constructor() {
        this.logLevel = 'info';
        console.log('🔍 Browser logger initialized');
    }

    private shouldLog(level: string): boolean {
        const levels = ['error', 'warn', 'info', 'debug'];
        const currentLevelIndex = levels.indexOf(this.logLevel);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= currentLevelIndex;
    }

    private formatMessage(level: string, message: string, metadata?: any): string {
        const timestamp = new Date().toISOString();
        let formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        if (metadata && Object.keys(metadata).length > 0) {
            formatted += ` ${JSON.stringify(metadata)}`;
        }
        return formatted;
    }

    private log(level: string, message: string, metadata?: any): void {
        if (!this.shouldLog(level)) return;

        const logEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            metadata
        };

        // Store in memory (limited to last 1000 entries)
        this.logs.push(logEntry);
        if (this.logs.length > 1000) {
            this.logs.shift();
        }

        const formatted = this.formatMessage(level, message, metadata);

        // Use appropriate console method
        switch (level) {
            case 'error':
                console.error(formatted);
                break;
            case 'warn':
                console.warn(formatted);
                break;
            case 'info':
                console.info(formatted);
                break;
            case 'debug':
                console.log(formatted);
                break;
            default:
                console.log(formatted);
        }
    }

    error(message: string, metadata?: any): void {
        this.log('error', message, metadata);
    }

    warn(message: string, metadata?: any): void {
        this.log('warn', message, metadata);
    }

    info(message: string, metadata?: any): void {
        this.log('info', message, metadata);
    }

    debug(message: string, metadata?: any): void {
        this.log('debug', message, metadata);
    }

    setLevel(level: string): void {
        this.logLevel = level;
    }

    getLogs(): Array<any> {
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
    }
}

// Create singleton instance
const logger = new BrowserLogger();

// Export stream for compatibility
export const stream = {
    write: (message: string) => {
        logger.info(message.trim());
    }
};

// Export logger as default
export default logger;

// Also export as named for compatibility
export { logger };