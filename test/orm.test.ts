import 'reflect-metadata';
import { Entity, Column, BaseModel, ConsoleLogger } from '../src/index';
import { QueryBuilder, sanitizeIdentifier } from '../src/query-builder';
import { Validator } from '../src/validator';

describe('ORM Core Tests', () => {
  describe('Model Decorators', () => {
    test('@Entity decorator sets table name metadata', () => {
      @Entity('test_users')
      class TestUser extends BaseModel {
        @Column({ primary: true })
        id!: number;
      }

      const tableName = Reflect.getMetadata('tableName', TestUser);
      expect(tableName).toBe('test_users');
    });

    test('@Entity decorator defaults to lowercase class name', () => {
      @Entity()
      class MyModel extends BaseModel {
        @Column()
        id!: number;
      }

      const tableName = Reflect.getMetadata('tableName', MyModel);
      expect(tableName).toBe('mymodel');
    });

    test('@Column decorator stores column metadata', () => {
      @Entity('test_users')
      class TestUser extends BaseModel {
        @Column({ primary: true, autoIncrement: true })
        id!: number;

        @Column({ type: 'varchar', length: 255 })
        name!: string;
      }

      const columns = Reflect.getMetadata('columns', TestUser);
      expect(columns).toHaveLength(2);
      expect(columns[0].propertyKey).toBe('id');
      expect(columns[0].primary).toBe(true);
      expect(columns[1].propertyKey).toBe('name');
      expect(columns[1].type).toBe('varchar');
    });

    test('Model instance can be created', () => {
      @Entity('test_users')
      class TestUser extends BaseModel {
        @Column('id')
        id!: number;

        @Column('name')
        name!: string;
      }

      expect(() => {
        const user = new TestUser();
        user.name = 'Test';
      }).not.toThrow();
    });
  });

  describe('QueryBuilder', () => {
    test('builds basic SELECT query', () => {
      const qb = new QueryBuilder('users');
      const sql = qb.build();
      expect(sql).toBe('SELECT * FROM users');
    });

    test('uses PostgreSQL placeholders by default', () => {
      const qb = new QueryBuilder('users', undefined, 'postgres');
      qb.where('id', '=', 1);
      const sql = qb.build();
      expect(sql).toBe('SELECT * FROM users WHERE id = $1');
    });

    test('uses MySQL/SQLite placeholders when specified', () => {
      const qb = new QueryBuilder('users', undefined, 'mysql');
      qb.where('id', '=', 1);
      const sql = qb.build();
      expect(sql).toBe('SELECT * FROM users WHERE id = ?');
    });
  });

  describe('Validator', () => {
    test('validates postgres config', () => {
      expect(() => {
        Validator.validateConnectionConfig('postgres', {
          host: 'localhost',
          port: 5432,
          database: 'test',
          user: 'user',
          password: 'pass'
        });
      }).not.toThrow();
    });

    test('throws on invalid postgres config', () => {
      expect(() => {
        Validator.validateConnectionConfig('postgres', {
          host: 'localhost'
          // missing required fields
        });
      }).toThrow();
    });

    test('validates sqlite config', () => {
      expect(() => {
        Validator.validateConnectionConfig('sqlite', {
          filename: ':memory:'
        });
      }).not.toThrow();
    });

    test('throws on unsupported database type', () => {
      expect(() => {
        Validator.validateConnectionConfig('unknown', {});
      }).toThrow('Unsupported database type');
    });
  });

  describe('Logger', () => {
    test('ConsoleLogger methods exist', () => {
      const logger = new ConsoleLogger();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });
  });
});