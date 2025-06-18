import { RedisClient } from '../utils/redis';
import { NotificationService } from './NotificationService';
export interface RemediationAction {
    type: string;
    severity: 'critical' | 'warning' | 'info';
    condition: string;
    action: () => Promise<void>;
    cooldown: number;
}
export declare class RemediationService {
    private redisClient;
    private notificationService;
    private lastActionTime;
    private actions;
    constructor(redisClient: RedisClient, notificationService: NotificationService);
    private initializeActions;
    handleAlert(alert: {
        type: string;
        severity: string;
        condition: string;
    }): Promise<void>;
    getRemediationStatus(): Promise<Record<string, any>>;
}
