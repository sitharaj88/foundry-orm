import { ILogger, ORMErrors } from './logger';

export interface IDatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query(sql: string, params?: any[]): Promise<any>;
  transaction(callback: (adapter: IDatabaseAdapter) => Promise<void>): Promise<void>;
  healthCheck(): Promise<boolean>;
}

export class PostgresAdapter implements IDatabaseAdapter {
  private pool: any;
  private logger: ILogger;

  constructor(private config: { host: string; port: number; database: string; user: string; password: string; maxConnections?: number }, logger: ILogger) {
    this.logger = logger;
  }

  async connect(): Promise<void> {
    try {
      const { Pool } = require('pg');
      this.pool = new Pool({
        ...this.config,
        max: this.config.maxConnections || 10,
      });
      this.logger.info('Connected to PostgreSQL');
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new ORMErrors.ConnectionError(`PostgreSQL connection failed: ${message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.logger.info('Disconnected from PostgreSQL');
    }
  }

  async query(sql: string, params?: any[]): Promise<any> {
    try {
      this.logger.debug(`Executing query: ${sql}`, { params });
      return await this.pool.query(sql, params);
    } catch (error) {
      this.logger.error('Query failed', { sql, params, error });
      const message = error instanceof Error ? error.message : String(error);
      throw new ORMErrors.QueryError(`Query failed: ${message}`, sql);
    }
  }

  async transaction(callback: (adapter: IDatabaseAdapter) => Promise<void>): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await callback(new PostgresTransactionAdapter(client, this.logger));
      await client.query('COMMIT');
      this.logger.debug('Transaction committed');
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error('Transaction rolled back', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}

class PostgresTransactionAdapter implements IDatabaseAdapter {
  constructor(private client: any, private logger: ILogger) {}

  connect(): Promise<void> { throw new Error('Not implemented'); }
  disconnect(): Promise<void> { throw new Error('Not implemented'); }

  async query(sql: string, params?: any[]): Promise<any> {
    try {
      return await this.client.query(sql, params);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ORMErrors.QueryError(`Query failed: ${message}`, sql);
    }
  }

  async transaction(callback: (adapter: IDatabaseAdapter) => Promise<void>): Promise<void> {
    await callback(this);
  }

  async healthCheck(): Promise<boolean> { return true; }
}

export class MySQLAdapter implements IDatabaseAdapter {
  private pool: any;
  private logger: ILogger;

  constructor(private config: { host: string; port: number; database: string; user: string; password: string; connectionLimit?: number }, logger: ILogger) {
    this.logger = logger;
  }

  async connect(): Promise<void> {
    try {
      const mysql = require('mysql2/promise');
      this.pool = mysql.createPool({
        ...this.config,
        waitForConnections: true,
        connectionLimit: this.config.connectionLimit || 10,
      });
      this.logger.info('Connected to MySQL');
    } catch (error) {
      this.logger.error('Failed to connect to MySQL', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new ORMErrors.ConnectionError(`MySQL connection failed: ${message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.logger.info('Disconnected from MySQL');
    }
  }

  async query(sql: string, params?: any[]): Promise<any> {
    try {
      this.logger.debug(`Executing query: ${sql}`, { params });
      return await this.pool.execute(sql, params);
    } catch (error) {
      this.logger.error('Query failed', { sql, params, error });
      const message = error instanceof Error ? error.message : String(error);
      throw new ORMErrors.QueryError(`Query failed: ${message}`, sql);
    }
  }

  async transaction(callback: (adapter: IDatabaseAdapter) => Promise<void>): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      await callback(new MySQLTransactionAdapter(connection, this.logger));
      await connection.commit();
      this.logger.debug('Transaction committed');
    } catch (error) {
      await connection.rollback();
      this.logger.error('Transaction rolled back', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.pool.execute('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}

class MySQLTransactionAdapter implements IDatabaseAdapter {
  constructor(private connection: any, private logger: ILogger) {}

  connect(): Promise<void> { throw new Error('Not implemented'); }
  disconnect(): Promise<void> { throw new Error('Not implemented'); }

  async query(sql: string, params?: any[]): Promise<any> {
    try {
      return await this.connection.execute(sql, params);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ORMErrors.QueryError(`Query failed: ${message}`, sql);
    }
  }

  async transaction(callback: (adapter: IDatabaseAdapter) => Promise<void>): Promise<void> {
    await callback(this);
  }

  async healthCheck(): Promise<boolean> { return true; }
}

export class SQLiteAdapter implements IDatabaseAdapter {
  private db: any;
  private logger: ILogger;

  constructor(private config: { filename: string }, logger: ILogger) {
    this.logger = logger;
  }

  async connect(): Promise<void> {
    try {
      const sqlite3 = require('sqlite3').verbose();
      this.db = new sqlite3.Database(this.config.filename);
      this.logger.info('Connected to SQLite');
    } catch (error) {
      this.logger.error('Failed to connect to SQLite', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new ORMErrors.ConnectionError(`SQLite connection failed: ${message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.logger.info('Disconnected from SQLite');
    }
  }

  async query(sql: string, params?: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.logger.debug(`Executing query: ${sql}`, { params });
        
        // Check if it's an INSERT/UPDATE/DELETE query
        const isModifyQuery = /^(INSERT|UPDATE|DELETE)/i.test(sql.trim());
        
        if (isModifyQuery) {
          const self = this;
          this.db.run(sql, params || [], function(this: any, err: any) {
            if (err) {
              self.logger.error('Query failed', { sql, params, error: err });
              reject(new ORMErrors.QueryError(`Query failed: ${err.message}`, sql));
            } else {
              // 'this' context contains lastID and changes
              resolve({ lastID: this.lastID, changes: this.changes, rows: [] });
            }
          });
        } else {
          // SELECT query
          this.db.all(sql, params || [], (err: any, rows: any) => {
            if (err) {
              this.logger.error('Query failed', { sql, params, error: err });
              reject(new ORMErrors.QueryError(`Query failed: ${err.message}`, sql));
            } else {
              resolve({ rows });
            }
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async transaction(callback: (adapter: IDatabaseAdapter) => Promise<void>): Promise<void> {
    this.db.run('BEGIN TRANSACTION');
    try {
      await callback(this);
      this.db.run('COMMIT');
      this.logger.debug('Transaction committed');
    } catch (error) {
      this.db.run('ROLLBACK');
      this.logger.error('Transaction rolled back', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    return new Promise((resolve) => {
      this.db.get('SELECT 1', (err: any) => {
        resolve(!err);
      });
    });
  }
}

export class MongoDBAdapter implements IDatabaseAdapter {
  private client: any;
  private db: any;
  private logger: ILogger;

  constructor(private config: { url: string; database: string; maxPoolSize?: number }, logger: ILogger) {
    this.logger = logger;
  }

  async connect(): Promise<void> {
    try {
      const { MongoClient } = require('mongodb');
      this.client = new MongoClient(this.config.url, { maxPoolSize: this.config.maxPoolSize || 10 });
      await this.client.connect();
      this.db = this.client.db(this.config.database);
      this.logger.info('Connected to MongoDB');
    } catch (error) {
      this.logger.error('Failed to connect to MongoDB', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new ORMErrors.ConnectionError(`MongoDB connection failed: ${message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.logger.info('Disconnected from MongoDB');
    }
  }

  async query(collection: string, operation: any): Promise<any> {
    try {
      this.logger.debug(`Executing MongoDB operation on ${collection}`, operation);
      const coll = this.db.collection(collection);
      if (operation.find) {
        return coll.find(operation.find).toArray();
      } else if (operation.insertOne) {
        return coll.insertOne(operation.insertOne);
      } else if (operation.updateOne) {
        return coll.updateOne(operation.updateOne.filter, operation.updateOne.update);
      } else if (operation.deleteOne) {
        return coll.deleteOne(operation.deleteOne);
      }
      throw new Error('Unsupported operation');
    } catch (error) {
      this.logger.error('MongoDB operation failed', { collection, operation, error });
      const message = error instanceof Error ? error.message : String(error);
      throw new ORMErrors.QueryError(`MongoDB operation failed: ${message}`);
    }
  }

  async transaction(callback: (adapter: IDatabaseAdapter) => Promise<void>): Promise<void> {
    const session = this.client.startSession();
    session.startTransaction();
    try {
      await callback(this);
      await session.commitTransaction();
      this.logger.debug('MongoDB transaction committed');
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('MongoDB transaction rolled back', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.db.admin().ping();
      return true;
    } catch {
      return false;
    }
  }
}