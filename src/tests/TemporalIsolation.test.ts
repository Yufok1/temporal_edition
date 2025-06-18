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

describe('TemporalIsolation', () => {
  let isolationModule: TemporalIsolation;
  let isolatedEvents: any[] = [];
  let reactivatedEvents: any[] = [];
  let lockAppliedEvents: any[] = [];
  let lockRemovedEvents: any[] = [];

  beforeEach(() => {
    isolationModule = new TemporalIsolation();
    isolatedEvents = [];
    reactivatedEvents = [];
    lockAppliedEvents = [];
    lockRemovedEvents = [];

    isolationModule.on('explorerIsolated', (state) => isolatedEvents.push(state));
    isolationModule.on('explorerReactivated', (state) => reactivatedEvents.push(state));
    isolationModule.on('temporalLockApplied', (data) => lockAppliedEvents.push(data));
    isolationModule.on('temporalLockRemoved', (data) => lockRemovedEvents.push(data));
  });

  it('should initialize with default state', () => {
    const status = isolationModule.getExplorerStatus();
    expect(status.isIsolated).toBe(false);
    expect(status.timestamp).toBeDefined();
  });

  it('should isolate explorer and emit event', () => {
    const reason = 'Testing isolation';
    isolationModule.isolateExplorer(reason);
    
    expect(isolatedEvents.length).toBe(1);
    expect(isolatedEvents[0].isIsolated).toBe(true);
    expect(isolatedEvents[0].reason).toBe(reason);
    
    const status = isolationModule.getExplorerStatus();
    expect(status.isIsolated).toBe(true);
    expect(status.reason).toBe(reason);
  });

  it('should reactivate explorer and emit event', () => {
    isolationModule.isolateExplorer();
    isolationModule.reactivateExplorer();
    
    expect(reactivatedEvents.length).toBe(1);
    expect(reactivatedEvents[0].isIsolated).toBe(false);
    
    const status = isolationModule.getExplorerStatus();
    expect(status.isIsolated).toBe(false);
  });

  it('should apply and remove temporal lock', () => {
    const duration = 5000;
    isolationModule.applyTemporalLock(duration);
    isolationModule.removeTemporalLock();
    
    expect(lockAppliedEvents.length).toBe(1);
    expect(lockAppliedEvents[0].duration).toBe(duration);
    
    expect(lockRemovedEvents.length).toBe(1);
    expect(lockRemovedEvents[0].timestamp).toBeDefined();
  });

  it('should maintain state history through multiple operations', () => {
    isolationModule.isolateExplorer('First isolation');
    const firstStatus = isolationModule.getExplorerStatus();
    
    isolationModule.reactivateExplorer();
    const secondStatus = isolationModule.getExplorerStatus();
    
    isolationModule.isolateExplorer('Second isolation');
    const thirdStatus = isolationModule.getExplorerStatus();
    
    expect(firstStatus.isIsolated).toBe(true);
    expect(secondStatus.isIsolated).toBe(false);
    expect(thirdStatus.isIsolated).toBe(true);
    
    expect(isolatedEvents.length).toBe(2);
    expect(reactivatedEvents.length).toBe(1);
  });
}); 