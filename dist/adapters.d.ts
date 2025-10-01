import { ILogger } from './logger';
export interface IDatabaseAdapter {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    query(sql: string, params?: any[]): Promise<any>;
    transaction(callback: (adapter: IDatabaseAdapter) => Promise<void>): Promise<void>;
    healthCheck(): Promise<boolean>;
}
export declare class PostgresAdapter implements IDatabaseAdapter {
    private config;
    private pool;
    private logger;
    constructor(config: {
        host: string;
        port: number;
        database: string;
        user: string;
        password: string;
        maxConnections?: number;
    }, logger: ILogger);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    query(sql: string, params?: any[]): Promise<any>;
    transaction(callback: (adapter: IDatabaseAdapter) => Promise<void>): Promise<void>;
    healthCheck(): Promise<boolean>;
}
export declare class MySQLAdapter implements IDatabaseAdapter {
    private config;
    private pool;
    private logger;
    constructor(config: {
        host: string;
        port: number;
        database: string;
        user: string;
        password: string;
        connectionLimit?: number;
    }, logger: ILogger);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    query(sql: string, params?: any[]): Promise<any>;
    transaction(callback: (adapter: IDatabaseAdapter) => Promise<void>): Promise<void>;
    healthCheck(): Promise<boolean>;
}
export declare class SQLiteAdapter implements IDatabaseAdapter {
    private config;
    private db;
    private logger;
    constructor(config: {
        filename: string;
    }, logger: ILogger);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    query(sql: string, params?: any[]): Promise<any>;
    transaction(callback: (adapter: IDatabaseAdapter) => Promise<void>): Promise<void>;
    healthCheck(): Promise<boolean>;
}
export declare class MongoDBAdapter implements IDatabaseAdapter {
    private config;
    private client;
    private db;
    private logger;
    constructor(config: {
        url: string;
        database: string;
        maxPoolSize?: number;
    }, logger: ILogger);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    query(collection: string, operation: any): Promise<any>;
    transaction(callback: (adapter: IDatabaseAdapter) => Promise<void>): Promise<void>;
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=adapters.d.ts.map