export declare const config: {
    readonly redis: {
        readonly host: string;
        readonly port: number;
        readonly password: string | undefined;
    };
    readonly sendgrid: {
        readonly apiKey: string;
        readonly fromEmail: string;
    };
    readonly app: {
        readonly env: string;
        readonly logLevel: string;
        readonly port: number;
    };
    readonly metrics: {
        readonly prometheusPort: number;
        readonly grafanaPort: number;
    };
    readonly retry: {
        readonly maxRetries: number;
        readonly baseDelay: number;
    };
    readonly queue: {
        readonly priorities: {
            readonly URGENT: 1;
            readonly HIGH: 2;
            readonly MEDIUM: 3;
            readonly LOW: 4;
        };
    };
};
