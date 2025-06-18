export declare class RedisClient {
    private client;
    constructor();
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
    close(): Promise<void>;
}
