"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
exports.Entity = Entity;
exports.Column = Column;
require("reflect-metadata");
const query_builder_1 = require("./query-builder");
function Entity(tableName) {
    return function (target) {
        Reflect.defineMetadata('tableName', tableName || target.name.toLowerCase(), target);
    };
}
function Column(nameOrOptions) {
    return function (target, propertyKey) {
        const columns = Reflect.getMetadata('columns', target.constructor) || [];
        let name;
        let type = 'string';
        if (typeof nameOrOptions === 'string') {
            name = nameOrOptions;
        }
        else if (nameOrOptions) {
            name = nameOrOptions.name || propertyKey;
            type = nameOrOptions.type || 'string';
        }
        else {
            name = propertyKey;
        }
        columns.push({
            propertyKey,
            name,
            type
        });
        Reflect.defineMetadata('columns', columns, target.constructor);
    };
}
class BaseModel {
    static setConnection(connection) {
        this.connection = connection;
    }
    static async find(id) {
        const tableName = Reflect.getMetadata('tableName', this);
        const qb = new query_builder_1.QueryBuilder(tableName, this.connection.getAdapter());
        qb.where('id', '=', id);
        const result = await qb.execute();
        if (!result.rows[0]) {
            return null;
        }
        const instance = new this();
        Object.assign(instance, result.rows[0]);
        return instance;
    }
    static async findAll() {
        const tableName = Reflect.getMetadata('tableName', this);
        const qb = new query_builder_1.QueryBuilder(tableName, this.connection.getAdapter());
        const result = await qb.execute();
        return result.rows.map((row) => {
            const instance = new this();
            Object.assign(instance, row);
            return instance;
        });
    }
    static async create(data) {
        const instance = new this();
        Object.assign(instance, data);
        await instance.save();
        return instance;
    }
    async save() {
        const tableName = Reflect.getMetadata('tableName', this.constructor);
        const columns = Reflect.getMetadata('columns', this.constructor) || [];
        const adapter = this.constructor.connection.getAdapter();
        const values = [];
        const placeholders = [];
        const updates = [];
        const insertCols = [];
        columns.forEach((col, index) => {
            const value = this[col.propertyKey];
            // Skip id on insert, include all fields on update
            if (this.id) {
                // Update - include all fields except id
                if (col.propertyKey !== 'id' && value !== undefined) {
                    values.push(value);
                    updates.push(`${col.name} = ?`);
                }
            }
            else {
                // Insert - skip id if it's undefined (autoincrement)
                if (col.propertyKey !== 'id' && value !== undefined) {
                    insertCols.push(col.name);
                    values.push(value);
                    placeholders.push('?');
                }
            }
        });
        let sql;
        if (this.id) {
            // Update
            sql = `UPDATE ${tableName} SET ${updates.join(', ')} WHERE id = ?`;
            values.push(this.id);
        }
        else {
            // Insert
            sql = `INSERT INTO ${tableName} (${insertCols.join(', ')}) VALUES (${placeholders.join(', ')})`;
        }
        try {
            const result = await adapter.query(sql, values);
            // For SQLite, get the last inserted ID
            if (!this.id && result.lastID) {
                this.id = result.lastID;
            }
            else if (!this.id && result.rows && result.rows[0]) {
                this.id = result.rows[0].id;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async delete() {
        if (!this.id) {
            throw new Error('Cannot delete model without id');
        }
        const tableName = Reflect.getMetadata('tableName', this.constructor);
        const adapter = this.constructor.connection.getAdapter();
        const sql = `DELETE FROM ${tableName} WHERE id = ?`;
        await adapter.query(sql, [this.id]);
    }
}
exports.BaseModel = BaseModel;
//# sourceMappingURL=model.js.map