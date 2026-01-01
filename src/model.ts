import 'reflect-metadata';
import { Connection } from './connection';
import { QueryBuilder, DatabaseDialect, sanitizeIdentifier } from './query-builder';

export function Entity(tableName?: string) {
  return function (target: Function) {
    Reflect.defineMetadata('tableName', tableName || target.name.toLowerCase(), target);
  };
}

export interface ColumnOptions {
  name?: string;
  type?: string;
  primary?: boolean;
  autoIncrement?: boolean;
  nullable?: boolean;
  unique?: boolean;
  default?: any;
  length?: number;
  precision?: number;
  scale?: number;
}

export function Column(nameOrOptions?: string | ColumnOptions) {
  return function (target: any, propertyKey: string | symbol) {
    const columns = Reflect.getMetadata('columns', target.constructor) || [];
    let name: string;
    let options: ColumnOptions = {};

    if (typeof nameOrOptions === 'string') {
      name = nameOrOptions;
    } else if (nameOrOptions) {
      name = nameOrOptions.name || (propertyKey as string);
      options = nameOrOptions;
    } else {
      name = propertyKey as string;
    }

    columns.push({
      propertyKey,
      name,
      type: options.type || 'string',
      ...options
    });
    Reflect.defineMetadata('columns', columns, target.constructor);
  };
}

// Type helper for model constructor
export type ModelConstructor<T extends BaseModel> = {
  new(): T;
  connection: Connection;
  dialect: DatabaseDialect;
  setConnection(connection: Connection, dialect?: DatabaseDialect): void;
  find<M extends BaseModel>(this: ModelConstructor<M>, id: number): Promise<M | null>;
  findAll<M extends BaseModel>(this: ModelConstructor<M>): Promise<M[]>;
  create<M extends BaseModel>(this: ModelConstructor<M>, data: Partial<M>): Promise<M>;
};

export class BaseModel {
  static connection: Connection;
  static dialect: DatabaseDialect = 'sqlite';

  static setConnection(connection: Connection, dialect: DatabaseDialect = 'sqlite') {
    this.connection = connection;
    this.dialect = dialect;
  }

  static async find<T extends BaseModel>(this: ModelConstructor<T>, id: number): Promise<T | null> {
    const tableName = Reflect.getMetadata('tableName', this);
    const qb = new QueryBuilder(tableName, this.connection.getAdapter(), this.dialect);
    qb.where('id', '=', id);
    const result = await qb.execute();
    if (!result.rows[0]) {
      return null;
    }
    const instance = new this() as T;
    Object.assign(instance, result.rows[0]);
    return instance;
  }

  static async findAll<T extends BaseModel>(this: ModelConstructor<T>): Promise<T[]> {
    const tableName = Reflect.getMetadata('tableName', this);
    const qb = new QueryBuilder(tableName, this.connection.getAdapter(), this.dialect);
    const result = await qb.execute();
    return result.rows.map((row: any) => {
      const instance = new this() as T;
      Object.assign(instance, row);
      return instance;
    });
  }

  static async create<T extends BaseModel>(this: ModelConstructor<T>, data: Partial<T>): Promise<T> {
    const instance = new this() as T;
    Object.assign(instance, data);
    await instance.save();
    return instance;
  }

  async save(): Promise<void> {
    const tableName = sanitizeIdentifier(Reflect.getMetadata('tableName', this.constructor));
    const columns = Reflect.getMetadata('columns', this.constructor) || [];
    const adapter = (this.constructor as any).connection.getAdapter();
    const dialect: DatabaseDialect = (this.constructor as any).dialect || 'sqlite';

    const values: any[] = [];
    const placeholders: string[] = [];
    const updates: string[] = [];
    const insertCols: string[] = [];

    columns.forEach((col: any, index: number) => {
      const value = (this as any)[col.propertyKey];
      const safeColName = sanitizeIdentifier(col.name);
      const placeholder = dialect === 'postgres' ? `$${values.length + 1}` : '?';

      // Skip id on insert, include all fields on update
      if ((this as any).id) {
        // Update - include all fields except id
        if (col.propertyKey !== 'id' && value !== undefined) {
          const updatePlaceholder = dialect === 'postgres' ? `$${values.length + 1}` : '?';
          updates.push(`${safeColName} = ${updatePlaceholder}`);
          values.push(value);
        }
      } else {
        // Insert - skip id if it's undefined (autoincrement)
        if (col.propertyKey !== 'id' && value !== undefined) {
          insertCols.push(safeColName);
          values.push(value);
          const insertPlaceholder = dialect === 'postgres' ? `$${values.length}` : '?';
          placeholders.push(insertPlaceholder);
        }
      }
    });

    let sql: string;
    if ((this as any).id) {
      // Update
      const idPlaceholder = dialect === 'postgres' ? `$${values.length + 1}` : '?';
      sql = `UPDATE ${tableName} SET ${updates.join(', ')} WHERE id = ${idPlaceholder}`;
      values.push((this as any).id);
    } else {
      // Insert
      sql = `INSERT INTO ${tableName} (${insertCols.join(', ')}) VALUES (${placeholders.join(', ')})`;
    }

    try {
      const result = await adapter.query(sql, values);
      // For SQLite, get the last inserted ID
      if (!(this as any).id && result.lastID) {
        (this as any).id = result.lastID;
      } else if (!(this as any).id && result.rows && result.rows[0]) {
        (this as any).id = result.rows[0].id;
      }
    } catch (error) {
      throw error;
    }
  }

  async delete(): Promise<void> {
    if (!(this as any).id) {
      throw new Error('Cannot delete model without id');
    }
    const tableName = sanitizeIdentifier(Reflect.getMetadata('tableName', this.constructor));
    const adapter = (this.constructor as any).connection.getAdapter();
    const dialect: DatabaseDialect = (this.constructor as any).dialect || 'sqlite';
    const placeholder = dialect === 'postgres' ? '$1' : '?';
    const sql = `DELETE FROM ${tableName} WHERE id = ${placeholder}`;
    await adapter.query(sql, [(this as any).id]);
  }
}