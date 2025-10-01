import { IDatabaseAdapter } from './adapters';

export class QueryBuilder {
  private table: string;
  private conditions: string[] = [];
  private params: any[] = [];
  private adapter?: IDatabaseAdapter;
  private selectFields: string[] = ['*'];
  private orderByClause?: string;
  private limitClause?: number;
  private offsetClause?: number;

  constructor(table: string, adapter?: IDatabaseAdapter) {
    this.table = table;
    this.adapter = adapter;
  }

  select(...fields: string[]): QueryBuilder {
    this.selectFields = fields;
    return this;
  }

  where(column: string, operator: string, value: any): QueryBuilder {
    const paramIndex = this.params.length + 1;
    this.conditions.push(`${column} ${operator} $${paramIndex}`);
    this.params.push(value);
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): QueryBuilder {
    this.orderByClause = `ORDER BY ${column} ${direction}`;
    return this;
  }

  limit(count: number): QueryBuilder {
    this.limitClause = count;
    return this;
  }

  offset(count: number): QueryBuilder {
    this.offsetClause = count;
    return this;
  }

  build(): string {
    let query = `SELECT ${this.selectFields.join(', ')} FROM ${this.table}`;
    if (this.conditions.length > 0) {
      query += ` WHERE ${this.conditions.join(' AND ')}`;
    }
    if (this.orderByClause) {
      query += ` ${this.orderByClause}`;
    }
    if (this.limitClause !== undefined) {
      query += ` LIMIT ${this.limitClause}`;
    }
    if (this.offsetClause !== undefined) {
      query += ` OFFSET ${this.offsetClause}`;
    }
    return query;
  }

  async execute(): Promise<any> {
    if (!this.adapter) {
      throw new Error('Adapter not provided');
    }
    const sql = this.build();
    return this.adapter.query(sql, this.params);
  }
}