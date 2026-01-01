import { QueryBuilder, sanitizeIdentifier, DatabaseDialect } from '../src/query-builder';

describe('QueryBuilder Tests', () => {
    describe('Dialect-aware placeholders', () => {
        test('PostgreSQL uses $1, $2 placeholders', () => {
            const qb = new QueryBuilder('users', undefined, 'postgres');
            qb.where('id', '=', 1).where('name', '=', 'test');
            const sql = qb.build();

            expect(sql).toBe('SELECT * FROM users WHERE id = $1 AND name = $2');
        });

        test('MySQL uses ? placeholders', () => {
            const qb = new QueryBuilder('users', undefined, 'mysql');
            qb.where('id', '=', 1).where('name', '=', 'test');
            const sql = qb.build();

            expect(sql).toBe('SELECT * FROM users WHERE id = ? AND name = ?');
        });

        test('SQLite uses ? placeholders', () => {
            const qb = new QueryBuilder('users', undefined, 'sqlite');
            qb.where('id', '=', 1);
            const sql = qb.build();

            expect(sql).toBe('SELECT * FROM users WHERE id = ?');
        });

        test('Default dialect is postgres', () => {
            const qb = new QueryBuilder('users');
            qb.where('id', '=', 1);
            const sql = qb.build();

            expect(sql).toContain('$1');
        });
    });

    describe('SQL Injection Prevention', () => {
        test('sanitizeIdentifier allows valid identifiers', () => {
            expect(() => sanitizeIdentifier('users')).not.toThrow();
            expect(() => sanitizeIdentifier('user_profiles')).not.toThrow();
            expect(() => sanitizeIdentifier('_private')).not.toThrow();
            expect(() => sanitizeIdentifier('Table123')).not.toThrow();
        });

        test('sanitizeIdentifier rejects invalid identifiers', () => {
            expect(() => sanitizeIdentifier('users; DROP TABLE--')).toThrow('Invalid SQL identifier');
            expect(() => sanitizeIdentifier('123users')).toThrow('Invalid SQL identifier');
            expect(() => sanitizeIdentifier('user-table')).toThrow('Invalid SQL identifier');
            expect(() => sanitizeIdentifier('user.table')).toThrow('Invalid SQL identifier');
        });

        test('QueryBuilder sanitizes table names', () => {
            expect(() => new QueryBuilder('valid_table')).not.toThrow();
            expect(() => new QueryBuilder('invalid; table')).toThrow('Invalid SQL identifier');
        });

        test('QueryBuilder sanitizes column names in where()', () => {
            const qb = new QueryBuilder('users', undefined, 'postgres');
            expect(() => qb.where('valid_column', '=', 1)).not.toThrow();
            expect(() => qb.where('invalid; column', '=', 1)).toThrow('Invalid SQL identifier');
        });

        test('QueryBuilder sanitizes column names in select()', () => {
            const qb = new QueryBuilder('users', undefined, 'postgres');
            expect(() => qb.select('id', 'name', 'email')).not.toThrow();
            expect(() => qb.select('*')).not.toThrow();
            expect(() => qb.select('invalid; column')).toThrow('Invalid SQL identifier');
        });
    });

    describe('Query building', () => {
        test('builds SELECT query', () => {
            const qb = new QueryBuilder('users', undefined, 'postgres');
            const sql = qb.build();

            expect(sql).toBe('SELECT * FROM users');
        });

        test('builds SELECT with specific columns', () => {
            const qb = new QueryBuilder('users', undefined, 'postgres');
            qb.select('id', 'name', 'email');
            const sql = qb.build();

            expect(sql).toBe('SELECT id, name, email FROM users');
        });

        test('builds SELECT with ORDER BY', () => {
            const qb = new QueryBuilder('users', undefined, 'postgres');
            qb.orderBy('name', 'DESC');
            const sql = qb.build();

            expect(sql).toBe('SELECT * FROM users ORDER BY name DESC');
        });

        test('builds SELECT with LIMIT and OFFSET', () => {
            const qb = new QueryBuilder('users', undefined, 'postgres');
            qb.limit(10).offset(20);
            const sql = qb.build();

            expect(sql).toBe('SELECT * FROM users LIMIT 10 OFFSET 20');
        });

        test('builds complex query', () => {
            const qb = new QueryBuilder('users', undefined, 'postgres');
            qb.select('id', 'name')
                .where('active', '=', true)
                .orderBy('createdAt', 'DESC')
                .limit(10)
                .offset(0);
            const sql = qb.build();

            expect(sql).toBe('SELECT id, name FROM users WHERE active = $1 ORDER BY createdAt DESC LIMIT 10 OFFSET 0');
        });
    });
});
