import 'reflect-metadata';
import { Connection } from './connection';
export declare function Entity(tableName?: string): (target: Function) => void;
export declare function Column(nameOrOptions?: string | {
    name?: string;
    type?: string;
}): (target: any, propertyKey: string | symbol) => void;
export declare class BaseModel {
    static connection: Connection;
    static setConnection(connection: Connection): void;
    static find(id: number): Promise<any>;
    static findAll(): Promise<any[]>;
    static create(data: Partial<any>): Promise<any>;
    save(): Promise<void>;
    delete(): Promise<void>;
}
//# sourceMappingURL=model.d.ts.map