"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORMErrors = exports.ConsoleLogger = void 0;
class ConsoleLogger {
    info(message, meta) {
        console.log(`[INFO] ${message}`, meta || '');
    }
    warn(message, meta) {
        console.warn(`[WARN] ${message}`, meta || '');
    }
    error(message, meta) {
        console.error(`[ERROR] ${message}`, meta || '');
    }
    debug(message, meta) {
        console.debug(`[DEBUG] ${message}`, meta || '');
    }
}
exports.ConsoleLogger = ConsoleLogger;
class ORMErrors {
}
exports.ORMErrors = ORMErrors;
ORMErrors.ConnectionError = class extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConnectionError';
    }
};
ORMErrors.QueryError = class extends Error {
    constructor(message, sql) {
        super(message);
        this.name = 'QueryError';
        this.sql = sql;
    }
};
ORMErrors.ValidationError = class extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
};
//# sourceMappingURL=logger.js.map