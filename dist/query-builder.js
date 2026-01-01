"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
exports.sanitizeIdentifier = sanitizeIdentifier;
// Safe identifier pattern for table/column names
const SAFE_IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
function sanitizeIdentifier(name) {
    if (!SAFE_IDENTIFIER.test(name)) {
        throw new Error(`Invalid SQL identifier: ${name}`);
    }
    return name;
}
class QueryBuilder {
    constructor(table, adapter, dialect = 'postgres') {
        this.conditions = [];
        this.params = [];
        this.selectFields = ['*'];
        this.table = sanitizeIdentifier(table);
        this.adapter = adapter;
        this.dialect = dialect;
    }
    select(...fields) {
        this.selectFields = fields.map(f => f === '*' ? f : sanitizeIdentifier(f));
        return this;
    }
    where(column, operator, value) {
        const safeColumn = sanitizeIdentifier(column);
        const placeholder = this.dialect === 'postgres'
            ? `$${this.params.length + 1}`
            : '?';
        this.conditions.push(`${safeColumn} ${operator} ${placeholder}`);
        this.params.push(value);
        return this;
    }
    orderBy(column, direction = 'ASC') {
        this.orderByClause = `ORDER BY ${column} ${direction}`;
        return this;
    }
    limit(count) {
        this.limitClause = count;
        return this;
    }
    offset(count) {
        this.offsetClause = count;
        return this;
    }
    build() {
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
    async execute() {
        if (!this.adapter) {
            throw new Error('Adapter not provided');
        }
        const sql = this.build();
        return this.adapter.query(sql, this.params);
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=query-builder.js.map