import { IDatabaseAdapter, PostgresAdapter, MySQLAdapter, SQLiteAdapter, MongoDBAdapter } from './adapters';
import { ILogger, ConsoleLogger } from './logger';
import { Validator } from './validator';

export type DatabaseType = 'postgres' | 'mysql' | 'sqlite' | 'mongodb';

export class Connection {
  private adapter: IDatabaseAdapter;

  constructor(type: DatabaseType, config: any, logger: ILogger = new ConsoleLogger()) {
    Validator.validateConnectionConfig(type, config);

    switch (type) {
      case 'postgres':
        this.adapter = new PostgresAdapter(config, logger);
        break;
      case 'mysql':
        this.adapter = new MySQLAdapter(config, logger);
        break;
      case 'sqlite':
        this.adapter = new SQLiteAdapter(config, logger);
        break;
      case 'mongodb':
        this.adapter = new MongoDBAdapter(config, logger);
        break;
      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }

  connect(): Promise<void> {
    return this.adapter.connect();
  }

  disconnect(): Promise<void> {
    return this.adapter.disconnect();
  }

  getAdapter(): IDatabaseAdapter {
    return this.adapter;
  }

  async healthCheck(): Promise<boolean> {
    return this.adapter.healthCheck();
  }
}