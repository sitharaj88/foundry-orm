import 'reflect-metadata';
import { Connection } from './connection';
import { DatabaseDialect } from './query-builder';
export declare function Entity(tableName?: string): (target: Function) => void;
export interface ColumnOptions {
    name?: string;
    type?: string;
    primary?: boolean;
    autoIncrement?: boolean;
    nullable?: boolean;
    unique?: boolean;
    default?: any;
    length?: number;
    precision?: number;
    scale?: number;
}
export declare function Column(nameOrOptions?: string | ColumnOptions): (target: any, propertyKey: string | symbol) => void;
export type ModelConstructor<T extends BaseModel> = {
    new (): T;
    connection: Connection;
    dialect: DatabaseDialect;
    setConnection(connection: Connection, dialect?: DatabaseDialect): void;
    find<M extends BaseModel>(this: ModelConstructor<M>, id: number): Promise<M | null>;
    findAll<M extends BaseModel>(this: ModelConstructor<M>): Promise<M[]>;
    create<M extends BaseModel>(this: ModelConstructor<M>, data: Partial<M>): Promise<M>;
};
export declare class BaseModel {
    static connection: Connection;
    static dialect: DatabaseDialect;
    static setConnection(connection: Connection, dialect?: DatabaseDialect): void;
    static find<T extends BaseModel>(this: ModelConstructor<T>, id: number): Promise<T | null>;
    static findAll<T extends BaseModel>(this: ModelConstructor<T>): Promise<T[]>;
    static create<T extends BaseModel>(this: ModelConstructor<T>, data: Partial<T>): Promise<T>;
    save(): Promise<void>;
    delete(): Promise<void>;
}
//# sourceMappingURL=model.d.ts.map