import { IDatabaseAdapter } from './adapters';

export type DatabaseDialect = 'postgres' | 'mysql' | 'sqlite' | 'mongodb';

// Safe identifier pattern for table/column names
const SAFE_IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export function sanitizeIdentifier(name: string): string {
  if (!SAFE_IDENTIFIER.test(name)) {
    throw new Error(`Invalid SQL identifier: ${name}`);
  }
  return name;
}

export class QueryBuilder {
  private table: string;
  private conditions: string[] = [];
  private params: any[] = [];
  private adapter?: IDatabaseAdapter;
  private dialect: DatabaseDialect;
  private selectFields: string[] = ['*'];
  private orderByClause?: string;
  private limitClause?: number;
  private offsetClause?: number;

  constructor(table: string, adapter?: IDatabaseAdapter, dialect: DatabaseDialect = 'postgres') {
    this.table = sanitizeIdentifier(table);
    this.adapter = adapter;
    this.dialect = dialect;
  }

  select(...fields: string[]): QueryBuilder {
    this.selectFields = fields.map(f => f === '*' ? f : sanitizeIdentifier(f));
    return this;
  }

  where(column: string, operator: string, value: any): QueryBuilder {
    const safeColumn = sanitizeIdentifier(column);
    const placeholder = this.dialect === 'postgres' 
      ? `$${this.params.length + 1}` 
      : '?';
    this.conditions.push(`${safeColumn} ${operator} ${placeholder}`);
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