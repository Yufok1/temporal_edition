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

describe('TemporalIsolation Concurrent Operations', () => {
  let isolationModule: TemporalIsolation;

  beforeEach(() => {
    isolationModule = new TemporalIsolation();
  });

  test('should handle multiple rapid isolation/reactivation cycles', async () => {
    const operations = Array.from({ length: 5 }, (_, i) => i);
    
    await Promise.all(operations.map(async (i) => {
      isolationModule.isolateExplorer(`Operation ${i}`);
      await new Promise(resolve => setTimeout(resolve, 100));
      isolationModule.reactivateExplorer();
    }));

    const status = isolationModule.getExplorerStatus();
    expect(status.isIsolated).toBe(false);
  });

  test('should handle overlapping temporal locks', async () => {
    // Apply first lock
    isolationModule.applyTemporalLock(1000);
    
    // Apply second lock before first expires
    setTimeout(() => {
      isolationModule.applyTemporalLock(2000);
    }, 500);

    // Wait for both locks to potentially expire
    await new Promise(resolve => setTimeout(resolve, 3000));

    const status = isolationModule.getExplorerStatus();
    expect(status.isIsolated).toBe(false);
  });

  test('should handle extremely short temporal locks', async () => {
    isolationModule.applyTemporalLock(1); // 1ms lock
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const status = isolationModule.getExplorerStatus();
    expect(status.isIsolated).toBe(false);
  });

  test('should handle long temporal locks', async () => {
    isolationModule.applyTemporalLock(5000); // 5s lock
    
    // Check status immediately after applying lock
    const initialStatus = isolationModule.getExplorerStatus();
    expect(initialStatus.isIsolated).toBe(true);
    
    // Wait for lock to expire
    await new Promise(resolve => setTimeout(resolve, 5100));
    
    const finalStatus = isolationModule.getExplorerStatus();
    expect(finalStatus.isIsolated).toBe(false);
  });

  test('should maintain correct state during concurrent event emissions', async () => {
    const events: string[] = [];
    
    isolationModule.on('explorerIsolated', () => events.push('isolated'));
    isolationModule.on('explorerReactivated', () => events.push('reactivated'));
    isolationModule.on('temporalLockApplied', () => events.push('lock-applied'));
    isolationModule.on('temporalLockRemoved', () => events.push('lock-removed'));

    // Perform concurrent operations
    await Promise.all([
      (async () => {
        isolationModule.isolateExplorer('Test 1');
        await new Promise(resolve => setTimeout(resolve, 100));
        isolationModule.reactivateExplorer();
      })(),
      (async () => {
        isolationModule.applyTemporalLock(200);
        await new Promise(resolve => setTimeout(resolve, 300));
      })()
    ]);

    // Verify event sequence
    expect(events).toContain('isolated');
    expect(events).toContain('lock-applied');
    expect(events).toContain('lock-removed');
    expect(events).toContain('reactivated');
  });

  test('should handle rapid state changes with temporal locks', async () => {
    const stateChanges: boolean[] = [];
    
    isolationModule.on('explorerIsolated', () => stateChanges.push(true));
    isolationModule.on('explorerReactivated', () => stateChanges.push(false));

    // Apply multiple locks in quick succession
    for (let i = 0; i < 3; i++) {
      isolationModule.applyTemporalLock(100);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Wait for all locks to expire
    await new Promise(resolve => setTimeout(resolve, 400));

    const finalStatus = isolationModule.getExplorerStatus();
    expect(finalStatus.isIsolated).toBe(false);
    expect(stateChanges.length).toBeGreaterThan(0);
  });
}); 