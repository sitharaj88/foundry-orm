import { Connection } from './connection';
import { BaseModel, ModelConstructor } from './model';
import { QueryBuilder, DatabaseDialect, sanitizeIdentifier } from './query-builder';
import { QueryResult } from './adapters';

/**
 * Options for finding records
 */
export interface FindOptions {
    where?: Record<string, any>;
    limit?: number;
    offset?: number;
    orderBy?: { column: string; direction?: 'ASC' | 'DESC' };
}

/**
 * Repository Pattern Implementation
 * 
 * Provides a clean separation between the data access layer and the business logic.
 * Unlike static BaseModel methods, Repository allows using multiple database connections.
 * 
 * @example
 * ```typescript
 * const userRepo = new Repository(User, primaryConnection, 'postgres');
 * const analyticsRepo = new Repository(Event, analyticsConnection, 'mysql');
 * 
 * const user = await userRepo.find(1);
 * const events = await analyticsRepo.findAll({ where: { userId: user.id } });
 * ```
 */
export class Repository<T extends BaseModel> {
    private tableName: string;

    constructor(
        private modelClass: ModelConstructor<T>,
        private connection: Connection,
        private dialect: DatabaseDialect = 'sqlite'
    ) {
        this.tableName = Reflect.getMetadata('tableName', modelClass);
        if (!this.tableName) {
            throw new Error(`Model ${modelClass.name} must have @Entity decorator`);
        }
    }

    /**
     * Get the underlying connection
     */
    getConnection(): Connection {
        return this.connection;
    }

    /**
     * Get the database dialect
     */
    getDialect(): DatabaseDialect {
        return this.dialect;
    }

    /**
     * Find a record by ID
     */
    async find(id: number): Promise<T | null> {
        const qb = new QueryBuilder(this.tableName, this.connection.getAdapter(), this.dialect);
        qb.where('id', '=', id);
        const result = await qb.execute();

        if (!result.rows[0]) {
            return null;
        }

        const instance = new this.modelClass() as T;
        Object.assign(instance, result.rows[0]);
        return instance;
    }

    /**
     * Find all records with optional filtering
     */
    async findAll(options?: FindOptions): Promise<T[]> {
        const qb = new QueryBuilder(this.tableName, this.connection.getAdapter(), this.dialect);

        if (options?.where) {
            for (const [column, value] of Object.entries(options.where)) {
                qb.where(column, '=', value);
            }
        }

        if (options?.orderBy) {
            qb.orderBy(options.orderBy.column, options.orderBy.direction || 'ASC');
        }

        if (options?.limit !== undefined) {
            qb.limit(options.limit);
        }

        if (options?.offset !== undefined) {
            qb.offset(options.offset);
        }

        const result = await qb.execute();

        return result.rows.map((row: any) => {
            const instance = new this.modelClass() as T;
            Object.assign(instance, row);
            return instance;
        });
    }

    /**
     * Find one record matching criteria
     */
    async findOne(where: Record<string, any>): Promise<T | null> {
        const results = await this.findAll({ where, limit: 1 });
        return results[0] || null;
    }

    /**
     * Create a new record
     */
    async create(data: Partial<T>): Promise<T> {
        const instance = new this.modelClass() as T;
        Object.assign(instance, data);

        // Set the connection for the instance to use in save()
        (this.modelClass as any).connection = this.connection;
        (this.modelClass as any).dialect = this.dialect;

        await instance.save();
        return instance;
    }

    /**
     * Update a record by ID
     */
    async update(id: number, data: Partial<T>): Promise<T | null> {
        const instance = await this.find(id);
        if (!instance) {
            return null;
        }

        Object.assign(instance, data);

        // Set the connection for the instance to use in save()
        (this.modelClass as any).connection = this.connection;
        (this.modelClass as any).dialect = this.dialect;

        await instance.save();
        return instance;
    }

    /**
     * Delete a record by ID
     */
    async delete(id: number): Promise<boolean> {
        const instance = await this.find(id);
        if (!instance) {
            return false;
        }

        // Set the connection for the instance to use in delete()
        (this.modelClass as any).connection = this.connection;
        (this.modelClass as any).dialect = this.dialect;

        await instance.delete();
        return true;
    }

    /**
     * Count records matching criteria
     */
    async count(where?: Record<string, any>): Promise<number> {
        const adapter = this.connection.getAdapter();
        const safeTable = sanitizeIdentifier(this.tableName);

        let sql = `SELECT COUNT(*) as count FROM ${safeTable}`;
        const params: any[] = [];

        if (where) {
            const conditions: string[] = [];
            for (const [column, value] of Object.entries(where)) {
                const safeColumn = sanitizeIdentifier(column);
                const placeholder = this.dialect === 'postgres' ? `$${params.length + 1}` : '?';
                conditions.push(`${safeColumn} = ${placeholder}`);
                params.push(value);
            }
            if (conditions.length > 0) {
                sql += ` WHERE ${conditions.join(' AND ')}`;
            }
        }

        const result = await adapter.query(sql, params);
        return result.rows[0]?.count || 0;
    }

    /**
     * Check if a record exists
     */
    async exists(id: number): Promise<boolean> {
        const record = await this.find(id);
        return record !== null;
    }
}
