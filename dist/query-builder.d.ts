import { IDatabaseAdapter } from './adapters';
export declare class QueryBuilder {
    private table;
    private conditions;
    private params;
    private adapter?;
    private selectFields;
    private orderByClause?;
    private limitClause?;
    private offsetClause?;
    constructor(table: string, adapter?: IDatabaseAdapter);
    select(...fields: string[]): QueryBuilder;
    where(column: string, operator: string, value: any): QueryBuilder;
    orderBy(column: string, direction?: 'ASC' | 'DESC'): QueryBuilder;
    limit(count: number): QueryBuilder;
    offset(count: number): QueryBuilder;
    build(): string;
    execute(): Promise<any>;
}
//# sourceMappingURL=query-builder.d.ts.map