import { IDatabaseAdapter } from './adapters';
import { ILogger } from './logger';
export type DatabaseType = 'postgres' | 'mysql' | 'sqlite' | 'mongodb';
export declare class Connection {
    private adapter;
    constructor(type: DatabaseType, config: any, logger?: ILogger);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getAdapter(): IDatabaseAdapter;
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=connection.d.ts.map