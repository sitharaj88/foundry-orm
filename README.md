# TypeScript ORM for Express.js

A reliable, enterprise-grade Object-Relational Mapping library for TypeScript applications using Express.js, supporting multiple databases including PostgreSQL, MySQL, SQLite, and MongoDB.

## Installation

```bash
npm install typescript-orm
```

## Features

- **Multi-Database Support**: PostgreSQL, MySQL, SQLite, MongoDB
- **Connection Pooling**: Efficient connection management with configurable pools
- **Transaction Support**: ACID transactions across all supported databases
- **Error Handling**: Comprehensive error handling with custom error types
- **Logging**: Pluggable logging interface with console logger included
- **Validation**: Input validation for configurations and models
- **Health Checks**: Built-in health check methods for monitoring
- **TypeScript Decorators**: Decorator-based model definition
- **Query Builder**: Fluent API for building SQL queries

## Usage

```typescript
import { Connection, Entity, Column, BaseModel, ConsoleLogger } from 'typescript-orm';

// Define a model
@Entity('users')
class User extends BaseModel {
  @Column()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}

// Connect to PostgreSQL with connection pooling
const logger = new ConsoleLogger();
const connection = new Connection('postgres', {
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'user',
  password: 'pass',
  maxConnections: 20
}, logger);

connection.connect().then(async () => {
  BaseModel.setConnection(connection);

  // Health check
  const healthy = await connection.healthCheck();
  console.log('Database healthy:', healthy);

  // Use transactions
  await connection.getAdapter().transaction(async (adapter) => {
    // Transactional operations
    const users = await User.findAll();
    const user = await User.find(1);
    const newUser = await User.create({ name: 'John', email: 'john@example.com' });
    await newUser.save();
    await newUser.delete();
  });
});

// For MySQL
const mysqlConnection = new Connection('mysql', {
  host: 'localhost',
  port: 3306,
  database: 'mydb',
  user: 'user',
  password: 'pass',
  connectionLimit: 15
}, logger);

// For SQLite
const sqliteConnection = new Connection('sqlite', {
  filename: 'database.db'
}, logger);

// For MongoDB
const mongoConnection = new Connection('mongodb', {
  url: 'mongodb://localhost:27017',
  database: 'mydb',
  maxPoolSize: 10
}, logger);
```

## Error Handling

The library provides custom error types:

- `ConnectionError`: Database connection failures
- `QueryError`: Query execution errors
- `ValidationError`: Input validation errors

```typescript
import { ORMErrors } from 'typescript-orm';

try {
  // ORM operations
} catch (error) {
  if (error instanceof ORMErrors.ConnectionError) {
    console.error('Connection failed:', error.message);
  } else if (error instanceof ORMErrors.QueryError) {
    console.error('Query failed:', error.message, 'SQL:', error.sql);
  }
}
```

## Logging

Implement the `ILogger` interface for custom logging:

```typescript
import { ILogger } from 'typescript-orm';

class CustomLogger implements ILogger {
  info(message: string, meta?: any): void {
    // Custom logging logic
  }
  // ... other methods
}

const connection = new Connection('postgres', config, new CustomLogger());
```

## Development

```bash
npm run build
npm run test
```

## License

MIT