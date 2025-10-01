"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const adapters_1 = require("./adapters");
const logger_1 = require("./logger");
const validator_1 = require("./validator");
class Connection {
    constructor(type, config, logger = new logger_1.ConsoleLogger()) {
        validator_1.Validator.validateConnectionConfig(type, config);
        switch (type) {
            case 'postgres':
                this.adapter = new adapters_1.PostgresAdapter(config, logger);
                break;
            case 'mysql':
                this.adapter = new adapters_1.MySQLAdapter(config, logger);
                break;
            case 'sqlite':
                this.adapter = new adapters_1.SQLiteAdapter(config, logger);
                break;
            case 'mongodb':
                this.adapter = new adapters_1.MongoDBAdapter(config, logger);
                break;
            default:
                throw new Error(`Unsupported database type: ${type}`);
        }
    }
    connect() {
        return this.adapter.connect();
    }
    disconnect() {
        return this.adapter.disconnect();
    }
    getAdapter() {
        return this.adapter;
    }
    async healthCheck() {
        return this.adapter.healthCheck();
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map