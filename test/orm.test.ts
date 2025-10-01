import { Connection, Entity, Column, BaseModel, ConsoleLogger } from '../src/index';

describe('ORM Tests', () => {
  let connection: Connection;

  beforeAll(async () => {
    // Use SQLite for testing
    connection = new Connection('sqlite', { filename: ':memory:' }, new ConsoleLogger());
    await connection.connect();
    BaseModel.setConnection(connection);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  test('Connection health check', async () => {
    const healthy = await connection.healthCheck();
    expect(healthy).toBe(true);
  });

  test('Model validation', () => {
    @Entity('test_users')
    class TestUser extends BaseModel {
      @Column('id')
      id!: number;

      @Column('name')
      name!: string;
    }

    expect(() => {
      // Should not throw
      const user = new TestUser();
    }).not.toThrow();
  });

  test('Query builder', () => {
    const qb = new (require('../src/query-builder').QueryBuilder)('users', connection.getAdapter());
    qb.where('id', '=', 1);
    const sql = qb.build();
    expect(sql).toContain('SELECT * FROM users WHERE id = $1');
  });
});