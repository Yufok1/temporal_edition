#!/usr/bin/env node
// Professional CLI for Marine Biology Watchtower
// Integrates with fd, ripgrep, bat, entr, taskwarrior, and other pro tools

import { MarineBiologyWatchtower, Observer, MarineSignal } from '../core/MarineBiologyWatchtower';
import { WatchtowerMetrics } from '../integrations/WatchtowerMetrics';
import { WatchtowerDataAPI } from '../integrations/WatchtowerDataAPI';
import * as childProcess from 'child_process';
import * as util from 'util';
import * as fs from 'fs';

const execAsync = util.promisify(childProcess.exec);

export interface CLICommand {
    name: string;
    description: string;
    usage: string;
    handler: (args: string[]) => Promise<void>;
}

export interface SystemTool {
    name: string;
    available: boolean;
    version?: string;
    path?: string;
}

export class WatchtowerCLI {
    private watchtower: MarineBiologyWatchtower;
    private metrics: WatchtowerMetrics;
    private dataAPI: WatchtowerDataAPI;
    private commands: Map<string, CLICommand> = new Map();
    private tools: Map<string, SystemTool> = new Map();

    constructor() {
        this.watchtower = new MarineBiologyWatchtower();
        this.metrics = new WatchtowerMetrics(this.watchtower);
        this.dataAPI = new WatchtowerDataAPI(this.watchtower, this.metrics);
        this.initializeCommands();
        this.detectSystemTools();
    }

    private initializeCommands(): void {
        const commands: CLICommand[] = [
            {
                name: 'status',
                description: 'Show watchtower system status',
                usage: 'watchtower status [--json]',
                handler: this.handleStatus.bind(this)
            },
            {
                name: 'nazar',
                description: 'Nazar oversight operations',
                usage: 'watchtower nazar <check|log|analysis> [options]',
                handler: this.handleNazar.bind(this)
            },
            {
                name: 'search',
                description: 'Search logs and data using ripgrep',
                usage: 'watchtower search <pattern> [--type=<type>] [--since=<time>]',
                handler: this.handleSearch.bind(this)
            },
            {
                name: 'monitor',
                description: 'Real-time monitoring with auto-refresh',
                usage: 'watchtower monitor [--interval=<seconds>]',
                handler: this.handleMonitor.bind(this)
            },
            {
                name: 'export',
                description: 'Export data for BI tools',
                usage: 'watchtower export <format> [--output=<file>]',
                handler: this.handleExport.bind(this)
            },
            {
                name: 'hierarchy',
                description: 'Hierarchy and pecking order analysis',
                usage: 'watchtower hierarchy <analysis|report|validate>',
                handler: this.handleHierarchy.bind(this)
            },
            {
                name: 'signals',
                description: 'Marine signal processing and analysis',
                usage: 'watchtower signals <analyze|patterns|simulate>',
                handler: this.handleSignals.bind(this)
            },
            {
                name: 'tools',
                description: 'Check available system tools',
                usage: 'watchtower tools [--install-missing]',
                handler: this.handleTools.bind(this)
            }
        ];

        commands.forEach(cmd => this.commands.set(cmd.name, cmd));
    }

    private async detectSystemTools(): Promise<void> {
        const toolChecks = [
            'fd', 'rg', 'bat', 'entr', 'task', 'htop', 'nmap', 'jq'
        ];

        for (const tool of toolChecks) {
            try {
                const { stdout } = await execAsync(`which ${tool}`);
                const path = stdout.trim();
                
                // Get version if possible
                let version: string | undefined;
                try {
                    const versionResult = await execAsync(`${tool} --version`);
                    version = versionResult.stdout.split('\n')[0];
                } catch {
                    // Version detection failed, but tool exists
                }

                this.tools.set(tool, {
                    name: tool,
                    available: true,
                    version,
                    path
                });
            } catch {
                this.tools.set(tool, {
                    name: tool,
                    available: false
                });
            }
        }
    }

    async run(args: string[]): Promise<void> {
        if (args.length === 0) {
            this.showHelp();
            return;
        }

        const commandName = args[0];
        const command = this.commands.get(commandName);

        if (!command) {
            console.error(`Unknown command: ${commandName}`);
            this.showHelp();
            if (typeof process !== 'undefined') {
                process.exit(1);
            }
            return;
        }

        try {
            await command.handler(args.slice(1));
        } catch (error) {
            console.error(`Error executing ${commandName}:`, error);
            if (typeof process !== 'undefined') {
                process.exit(1);
            }
        }
    }

    private async handleStatus(args: string[]): Promise<void> {
        const isJson = args.includes('--json');
        const status = this.watchtower.getHierarchyStatus();
        const metrics = {
            hierarchy: this.metrics.collectHierarchyMetrics(),
            signals: this.metrics.collectSignalMetrics(),
            nazar: this.metrics.collectNazarMetrics()
        };

        if (isJson) {
            console.log(JSON.stringify({ status, metrics }, null, 2));
        } else {
            console.log('🔭 Marine Biology Watchtower Status\n');
            console.log(`Observers: ${status.observers.length} total, ${status.observers.filter(o => o.status === 'active').length} active`);
            console.log(`Recent Events: ${status.recentEvents.length}`);
            console.log(`Signal Rate: ${metrics.signals.signals_per_minute.toFixed(1)}/min`);
            console.log(`Nazar Quality: ${metrics.nazar.response_time_ms.toFixed(1)}ms response time`);
            
            if (this.tools.get('bat')?.available) {
                // Use bat to syntax highlight the JSON output
                await this.pipeToBat(JSON.stringify({ status, metrics }, null, 2), 'json');
            }
        }
    }

    private async handleNazar(args: string[]): Promise<void> {
        const action = args[0];
        
        switch (action) {
            case 'check':
                const observerId = args[1] || 'cli-user';
                const checkAction = args[2] || 'observe';
                const result = this.watchtower.nazarCheckpoint(observerId, checkAction);
                console.log(`Nazar checkpoint: ${result ? '✅ ALLOWED' : '❌ DENIED'}`);
                break;
                
            case 'log':
                await this.showNazarLog(args.slice(1));
                break;
                
            case 'analysis':
                await this.showNazarAnalysis();
                break;
                
            default:
                console.log('Usage: watchtower nazar <check|log|analysis>');
        }
    }

    private async handleSearch(args: string[]): Promise<void> {
        const pattern = args[0];
        if (!pattern) {
            console.error('Search pattern required');
            return;
        }

        const rg = this.tools.get('rg');
        if (!rg?.available) {
            console.error('ripgrep (rg) not available. Install with: cargo install ripgrep');
            return;
        }

        // Search through watchtower data
        const searchData = this.dataAPI.exportData('json');
        
        // Use ripgrep to search the JSON data
        const tempFile = `/tmp/watchtower_data_${Date.now()}.json`;
        await this.writeToFile(tempFile, searchData);
        
        try {
            const { stdout } = await execAsync(`rg "${pattern}" ${tempFile} --color=always --json`);
            console.log(stdout);
        } catch (error) {
            console.log('No matches found');
        }
    }

    private async handleMonitor(args: string[]): Promise<void> {
        const intervalArg = args.find(arg => arg.startsWith('--interval='));
        const interval = intervalArg ? parseInt(intervalArg.split('=')[1]) : 5;

        console.log(`🔭 Real-time monitoring (${interval}s intervals). Press Ctrl+C to stop.\n`);

        const entr = this.tools.get('entr');
        if (entr?.available) {
            console.log('Using entr for file-based monitoring...');
            // Would set up entr-based file watching
        }

        // Fallback to basic interval monitoring
        const monitor = setInterval(async () => {
            console.clear();
            await this.handleStatus(['--json']);
        }, interval * 1000);

        if (typeof process !== 'undefined') {
            process.on('SIGINT', () => {
                clearInterval(monitor);
                console.log('\nMonitoring stopped.');
                process.exit(0);
            });
        }
    }

    private async handleExport(args: string[]): Promise<void> {
        const format = args[0] || 'json';
        const outputArg = args.find(arg => arg.startsWith('--output='));
        const outputFile = outputArg ? outputArg.split('=')[1] : undefined;

        const data = this.dataAPI.exportData(format as any);

        if (outputFile) {
            await this.writeToFile(outputFile, data);
            console.log(`Data exported to ${outputFile}`);
        } else {
            console.log(data);
        }
    }

    private async handleHierarchy(args: string[]): Promise<void> {
        const action = args[0];

        switch (action) {
            case 'analysis':
                const analysis = await this.dataAPI.getHierarchyAnalysis('24h');
                console.log('📊 Hierarchy Analysis (24h)');
                analysis.rows.forEach(row => {
                    analysis.columns.forEach((col, i) => {
                        console.log(`${col}: ${row[i]}`);
                    });
                });
                break;

            case 'report':
                await this.generateHierarchyReport();
                break;

            case 'validate':
                await this.validateHierarchyIntegrity();
                break;

            default:
                console.log('Usage: watchtower hierarchy <analysis|report|validate>');
        }
    }

    private async handleSignals(args: string[]): Promise<void> {
        const action = args[0];

        switch (action) {
            case 'analyze':
                const patterns = this.watchtower.analyzeSignalPatterns();
                console.log('🐋 Signal Pattern Analysis');
                patterns.forEach(pattern => {
                    console.log(`${pattern.pattern}: ${(pattern.confidence * 100).toFixed(1)}% confidence`);
                    if (pattern.alert) console.log(`  ⚠️  ${pattern.alert}`);
                });
                break;

            case 'simulate':
                await this.simulateMarineSignals();
                break;

            default:
                console.log('Usage: watchtower signals <analyze|patterns|simulate>');
        }
    }

    private async handleTools(args: string[]): Promise<void> {
        const installMissing = args.includes('--install-missing');

        console.log('🛠️  System Tools Status\n');
        
        for (const [name, tool] of this.tools) {
            const status = tool.available ? '✅' : '❌';
            const version = tool.version ? ` (${tool.version})` : '';
            console.log(`${status} ${name}${version}`);
            
            if (!tool.available && installMissing) {
                console.log(`  Installing ${name}...`);
                await this.installTool(name);
            }
        }
    }

    private async pipeToBat(content: string, language: string): Promise<void> {
        return new Promise((resolve) => {
            const bat = childProcess.spawn('bat', ['--language', language, '--style', 'numbers,changes']);
            bat.stdin.write(content);
            bat.stdin.end();
            bat.stdout.pipe(process.stdout);
            bat.on('close', () => resolve());
        });
    }

    private async writeToFile(path: string, content: string): Promise<void> {
        fs.writeFileSync(path, content);
    }

    private async showNazarLog(args: string[]): Promise<void> {
        const events = await this.dataAPI.getNazarEvents();
        console.log('👁️  Nazar Event Log\n');
        
        events.rows.forEach(row => {
            const [timestamp, observerId, action, target, result, tier] = row;
            const status = result === 'allowed' ? '✅' : result === 'denied' ? '❌' : '⚠️';
            console.log(`${status} ${timestamp} | T${tier} ${observerId} → ${action} ${target || ''} (${result})`);
        });
    }

    private async showNazarAnalysis(): Promise<void> {
        const metrics = this.metrics.collectNazarMetrics();
        console.log('🔍 Nazar Analysis\n');
        console.log(`Total Events: ${metrics.total_events}`);
        console.log(`Denied Actions: ${metrics.denied_actions}`);
        console.log(`Escalations: ${metrics.escalated_actions}`);
        console.log(`Response Time: ${metrics.response_time_ms}ms`);
    }

    private async generateHierarchyReport(): Promise<void> {
        const status = this.watchtower.getHierarchyStatus();
        const metrics = this.metrics.collectHierarchyMetrics();
        
        console.log('📋 Hierarchy Report\n');
        console.log('Tier Distribution:');
        Object.entries(metrics.observers_by_tier).forEach(([tier, count]) => {
            console.log(`  ${tier}: ${count} observers`);
        });
        
        console.log(`\nPrivilege Violations: ${metrics.privilege_violations}`);
        console.log(`Escalations: ${metrics.escalations}`);
    }

    private async validateHierarchyIntegrity(): Promise<void> {
        const status = this.watchtower.getHierarchyStatus();
        let issues = 0;

        console.log('🔒 Hierarchy Integrity Check\n');

        // Check for orphaned events
        status.recentEvents.forEach(event => {
            const observer = status.observers.find(o => o.id === event.observerId);
            if (!observer) {
                console.log(`⚠️  Orphaned event: ${event.action} from unknown observer ${event.observerId}`);
                issues++;
            }
        });

        // Check for tier consistency
        status.observers.forEach(observer => {
            if (observer.tier < 1 || observer.tier > 5) {
                console.log(`⚠️  Invalid tier: Observer ${observer.id} has tier ${observer.tier}`);
                issues++;
            }
        });

        console.log(`\n${issues === 0 ? '✅' : '❌'} Found ${issues} integrity issues`);
    }

    private async simulateMarineSignals(): Promise<void> {
        console.log('🌊 Simulating marine signals...\n');
        
        for (let i = 0; i < 5; i++) {
            const signal: MarineSignal = {
                timestamp: Date.now(),
                source: `whale_${i + 1}`,
                type: ['vocal', 'movement', 'environmental'][Math.floor(Math.random() * 3)] as any,
                frequency: 20 + Math.random() * 200,
                intensity: Math.random(),
                confidence: 0.7 + Math.random() * 0.3,
                location: {
                    lat: 40 + Math.random() * 10,
                    lon: -70 + Math.random() * 10,
                    depth: Math.random() * 100
                }
            };

            this.watchtower.recordMarineSignal(signal);
            console.log(`📡 ${signal.type} signal from ${signal.source} (${(signal.intensity * 100).toFixed(1)}% intensity)`);
        }
    }

    private async installTool(toolName: string): Promise<void> {
        const installCommands: Record<string, string> = {
            'fd': 'cargo install fd-find',
            'rg': 'cargo install ripgrep',
            'bat': 'cargo install bat',
            'entr': 'apt install entr || brew install entr',
            'task': 'apt install taskwarrior || brew install task'
        };

        const command = installCommands[toolName];
        if (command) {
            try {
                await execAsync(command);
                console.log(`✅ ${toolName} installed successfully`);
            } catch (error) {
                console.log(`❌ Failed to install ${toolName}: ${error}`);
            }
        } else {
            console.log(`❌ No install command found for ${toolName}`);
        }
    }

    private showHelp(): void {
        console.log('🔭 Marine Biology Watchtower CLI\n');
        console.log('Available commands:\n');
        
        for (const [name, cmd] of this.commands) {
            console.log(`  ${cmd.usage}`);
            console.log(`    ${cmd.description}\n`);
        }
        
        console.log('Integration with professional tools:');
        console.log('  • fd, ripgrep, bat for file operations');
        console.log('  • entr for file watching');
        console.log('  • taskwarrior for task management');
        console.log('  • Prometheus/Grafana for monitoring');
        console.log('  • PostgreSQL/ClickHouse for data storage');
    }
}

// CLI entry point
if (require.main === module) {
    const cli = new WatchtowerCLI();
    cli.run(process.argv.slice(2));
}