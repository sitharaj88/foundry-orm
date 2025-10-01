"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const logger_1 = require("./logger");
class Validator {
    static validateConnectionConfig(type, config) {
        if (!config) {
            throw new logger_1.ORMErrors.ValidationError('Configuration is required');
        }
        switch (type) {
            case 'postgres':
            case 'mysql':
                if (!config.host || !config.port || !config.database || !config.user || !config.password) {
                    throw new logger_1.ORMErrors.ValidationError(`Invalid config for ${type}: missing required fields`);
                }
                break;
            case 'sqlite':
                if (!config.filename) {
                    throw new logger_1.ORMErrors.ValidationError('Invalid config for sqlite: missing filename');
                }
                break;
            case 'mongodb':
                if (!config.url || !config.database) {
                    throw new logger_1.ORMErrors.ValidationError('Invalid config for mongodb: missing url or database');
                }
                break;
            default:
                throw new logger_1.ORMErrors.ValidationError(`Unsupported database type: ${type}`);
        }
    }
    static validateModel(model) {
        const tableName = Reflect.getMetadata('tableName', model.constructor);
        const columns = Reflect.getMetadata('columns', model.constructor);
        if (!tableName) {
            throw new logger_1.ORMErrors.ValidationError('Model must have @Entity decorator');
        }
        if (!columns || columns.length === 0) {
            throw new logger_1.ORMErrors.ValidationError('Model must have at least one @Column');
        }
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map