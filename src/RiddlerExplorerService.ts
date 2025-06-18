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