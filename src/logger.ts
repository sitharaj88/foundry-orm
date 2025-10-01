export interface ILogger {
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

export class ConsoleLogger implements ILogger {
  info(message: string, meta?: any): void {
    console.log(`[INFO] ${message}`, meta || '');
  }

  warn(message: string, meta?: any): void {
    console.warn(`[WARN] ${message}`, meta || '');
  }

  error(message: string, meta?: any): void {
    console.error(`[ERROR] ${message}`, meta || '');
  }

  debug(message: string, meta?: any): void {
    console.debug(`[DEBUG] ${message}`, meta || '');
  }
}

export class ORMErrors {
  static ConnectionError = class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ConnectionError';
    }
  };

  static QueryError = class extends Error {
    constructor(message: string, sql?: string) {
      super(message);
      this.name = 'QueryError';
      (this as any).sql = sql;
    }
  };

  static ValidationError = class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
    }
  };
}