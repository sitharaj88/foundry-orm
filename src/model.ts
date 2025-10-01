import 'reflect-metadata';
import { Connection } from './connection';
import { QueryBuilder } from './query-builder';

export function Entity(tableName?: string) {
  return function (target: Function) {
    Reflect.defineMetadata('tableName', tableName || target.name.toLowerCase(), target);
  };
}

export function Column(nameOrOptions?: string | { name?: string; type?: string }) {
  return function (target: any, propertyKey: string | symbol) {
    const columns = Reflect.getMetadata('columns', target.constructor) || [];
    let name: string;
    let type: string = 'string';
    if (typeof nameOrOptions === 'string') {
      name = nameOrOptions;
    } else if (nameOrOptions) {
      name = nameOrOptions.name || (propertyKey as string);
      type = nameOrOptions.type || 'string';
    } else {
      name = propertyKey as string;
    }
    columns.push({
      propertyKey,
      name,
      type
    });
    Reflect.defineMetadata('columns', columns, target.constructor);
  };
}

export class BaseModel {
  static connection: Connection;

  static setConnection(connection: Connection) {
    this.connection = connection;
  }

  static async find(id: number): Promise<any> {
    const tableName = Reflect.getMetadata('tableName', this);
    const qb = new QueryBuilder(tableName, this.connection.getAdapter());
    qb.where('id', '=', id);
    const result = await qb.execute();
    if (!result.rows[0]) {
      return null;
    }
    const instance = new this();
    Object.assign(instance, result.rows[0]);
    return instance;
  }

  static async findAll(): Promise<any[]> {
    const tableName = Reflect.getMetadata('tableName', this);
    const qb = new QueryBuilder(tableName, this.connection.getAdapter());
    const result = await qb.execute();
    return result.rows.map((row: any) => {
      const instance = new this();
      Object.assign(instance, row);
      return instance;
    });
  }

  static async create(data: Partial<any>): Promise<any> {
    const instance = new this();
    Object.assign(instance, data);
    await instance.save();
    return instance;
  }

  async save(): Promise<void> {
    const tableName = Reflect.getMetadata('tableName', this.constructor);
    const columns = Reflect.getMetadata('columns', this.constructor) || [];
    const adapter = (this.constructor as any).connection.getAdapter();

    const values: any[] = [];
    const placeholders: string[] = [];
    const updates: string[] = [];
    const insertCols: string[] = [];

    columns.forEach((col: any, index: number) => {
      const value = (this as any)[col.propertyKey];
      // Skip id on insert, include all fields on update
      if ((this as any).id) {
        // Update - include all fields except id
        if (col.propertyKey !== 'id' && value !== undefined) {
          values.push(value);
          updates.push(`${col.name} = ?`);
        }
      } else {
        // Insert - skip id if it's undefined (autoincrement)
        if (col.propertyKey !== 'id' && value !== undefined) {
          insertCols.push(col.name);
          values.push(value);
          placeholders.push('?');
        }
      }
    });

    let sql: string;
    if ((this as any).id) {
      // Update
      sql = `UPDATE ${tableName} SET ${updates.join(', ')} WHERE id = ?`;
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
    const tableName = Reflect.getMetadata('tableName', this.constructor);
    const adapter = (this.constructor as any).connection.getAdapter();
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;
    await adapter.query(sql, [(this as any).id]);
  }
}