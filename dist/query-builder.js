"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    constructor(table, adapter) {
        this.conditions = [];
        this.params = [];
        this.selectFields = ['*'];
        this.table = table;
        this.adapter = adapter;
    }
    select(...fields) {
        this.selectFields = fields;
        return this;
    }
    where(column, operator, value) {
        const paramIndex = this.params.length + 1;
        this.conditions.push(`${column} ${operator} $${paramIndex}`);
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