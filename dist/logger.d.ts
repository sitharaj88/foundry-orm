export interface ILogger {
    info(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
}
export declare class ConsoleLogger implements ILogger {
    info(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
}
export declare class ORMErrors {
    static ConnectionError: {
        new (message: string): {
            name: string;
            message: string;
            stack?: string;
        };
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    static QueryError: {
        new (message: string, sql?: string): {
            name: string;
            message: string;
            stack?: string;
        };
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    static ValidationError: {
        new (message: string): {
            name: string;
            message: string;
            stack?: string;
        };
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
}
//# sourceMappingURL=logger.d.ts.map