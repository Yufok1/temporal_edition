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

import { EventEmitter } from 'events';

interface RiddlerMarker {
  id: string;
  content: string;
  createdAt: number;
  expiresAt: number;
  isArchived: boolean;
}

export class RiddlerExplorerService extends EventEmitter {
  private markers: Map<string, RiddlerMarker> = new Map();
  private expiryInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.startExpiryCheck();
  }

  public createMarker(content: string, lifespanMs: number): RiddlerMarker {
    const now = Date.now();
    const marker: RiddlerMarker = {
      id: `riddler-${now}`,
      content,
      createdAt: now,
      expiresAt: now + lifespanMs,
      isArchived: false,
    };
    this.markers.set(marker.id, marker);
    this.emit('markerCreated', marker);
    return marker;
  }

  public getActiveMarkers(): RiddlerMarker[] {
    return Array.from(this.markers.values()).filter(marker => !marker.isArchived && marker.expiresAt > Date.now());
  }

  public archiveMarker(id: string): void {
    const marker = this.markers.get(id);
    if (marker && !marker.isArchived) {
      marker.isArchived = true;
      this.emit('markerArchived', marker);
    }
  }

  private startExpiryCheck(): void {
    this.expiryInterval = setInterval(() => {
      const now = Date.now();
      this.markers.forEach((marker, id) => {
        if (!marker.isArchived && marker.expiresAt <= now) {
          this.archiveMarker(id);
        }
      });
    }, 60000); // Check every minute
  }

  public stopExpiryCheck(): void {
    if (this.expiryInterval) {
      clearInterval(this.expiryInterval);
      this.expiryInterval = null;
    }
  }
} 