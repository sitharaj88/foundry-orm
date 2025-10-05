# FoundryORM

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![npm version](https://img.shields.io/npm/v/foundry-orm.svg?style=flat-square)](https://www.npmjs.com/package/foundry-orm)
[![npm downloads](https://img.shields.io/npm/dm/foundry-orm.svg?style=flat-square)](https://www.npmjs.com/package/foundry-orm)
[![GitHub stars](https://img.shields.io/github/stars/sitharaj88/foundry-orm.svg?style=flat-square)](https://github.com/sitharaj88/foundry-orm)

A powerful, enterprise-grade Object-Relational Mapping (ORM) library for TypeScript applications using Express.js. FoundryORM provides seamless integration with multiple databases including PostgreSQL, MySQL, SQLite, and MongoDB, offering a unified API for database operations.

> **Note**: This package is currently in **alpha** stage. APIs may change in future releases.

## ✨ Features

- 🚀 **Multi-Database Support**: PostgreSQL, MySQL, SQLite, MongoDB
- 🔄 **Connection Pooling**: Efficient connection management with configurable pools
- 🔐 **Transaction Support**: ACID transactions across all supported databases
- 🛡️ **Type Safety**: Full TypeScript support with compile-time type checking
- 🎯 **Decorator-Based**: Clean, decorator-driven model definitions
- 📊 **Query Builder**: Fluent API for complex SQL queries
- 🔍 **Health Checks**: Built-in database health monitoring
- 📝 **Comprehensive Logging**: Pluggable logging interface
- ⚡ **High Performance**: Optimized for production workloads
- 🧪 **Well Tested**: Comprehensive test coverage
- 📚 **Rich Documentation**: Complete API documentation and guides

## 📦 Installation

### Install Latest Alpha Version (Recommended for testing)

```bash
npm install foundry-orm@alpha
```

### Install Stable Version

```bash
npm install foundry-orm
```

### Peer Dependencies

```bash
npm install reflect-metadata
```

### Database Drivers

Install the driver for your database:

```bash
# PostgreSQL
npm install pg

# MySQL
npm install mysql2

# SQLite
npm install sqlite3

# MongoDB
npm install mongodb
```

## 🚀 Quick Start

```typescript
import { Connection, Entity, Column, BaseModel, ConsoleLogger } from 'foundry-orm';
import 'reflect-metadata';

// Define a model using decorators
@Entity('users')
class User extends BaseModel {
  @Column({ primary: true, autoIncrement: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

// Create connection with connection pooling
const logger = new ConsoleLogger();
const connection = new Connection('postgres', {
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'myuser',
  password: 'mypassword',
  maxConnections: 20,
  minConnections: 5
}, logger);

// Connect and use
await connection.connect();
BaseModel.setConnection(connection);

// Perform operations
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com'
});

await user.save();

const users = await User.findAll();
console.log(`Found ${users.length} users`);
```

## 📋 Requirements

- **Node.js**: >= 18.0.0
- **TypeScript**: >= 5.0.0
- **Databases**:
  - PostgreSQL >= 12
  - MySQL >= 8.0
  - SQLite >= 3.0
  - MongoDB >= 4.0

## 🗄️ Database Support

### PostgreSQL
```typescript
const connection = new Connection('postgres', {
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'user',
  password: 'pass',
  maxConnections: 20,
  ssl: true
}, logger);
```

### MySQL
```typescript
const connection = new Connection('mysql', {
  host: 'localhost',
  port: 3306,
  database: 'mydb',
  user: 'user',
  password: 'pass',
  connectionLimit: 15,
  acquireTimeout: 60000
}, logger);
```

### SQLite
```typescript
const connection = new Connection('sqlite', {
  filename: './database.db',
  mode: 0o666
}, logger);
```

### MongoDB
```typescript
const connection = new Connection('mongodb', {
  url: 'mongodb://localhost:27017',
  database: 'mydb',
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000
}, logger);
```

## 🎯 Model Definition

### Basic Model
```typescript
import { Entity, Column, BaseModel } from 'foundry-orm';

@Entity('products')
export class Product extends BaseModel {
  @Column({ primary: true, autoIncrement: true })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
```

### Relationships
```typescript
@Entity('orders')
export class Order extends BaseModel {
  @Column({ primary: true, autoIncrement: true })
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // Define relationships (future feature)
  // @BelongsTo(() => User)
  // user: User;
}
```

## 🔧 CRUD Operations

### Creating Records
```typescript
const user = await User.create({
  name: 'Jane Smith',
  email: 'jane@example.com'
});
await user.save();
```

### Reading Records
```typescript
// Find by ID
const user = await User.find(1);

// Find all
const users = await User.findAll();

// Find with conditions
const activeUsers = await User.findAll({
  where: { isActive: true },
  limit: 10,
  offset: 0
});
```

### Updating Records
```typescript
const user = await User.find(1);
user.name = 'Updated Name';
await user.save();
```

### Deleting Records
```typescript
const user = await User.find(1);
await user.delete();

// Or delete by ID
await User.destroy(1);
```

## 🔄 Transactions

```typescript
await connection.getAdapter().transaction(async (adapter) => {
  const user = await User.create({ name: 'Test', email: 'test@example.com' });
  await user.save();

  const order = await Order.create({ userId: user.id, total: 100.00 });
  await order.save();

  // If anything fails, transaction rolls back automatically
});
```

## 📊 Query Builder

```typescript
import { QueryBuilder } from 'foundry-orm';

const query = new QueryBuilder('users')
  .select('id', 'name', 'email')
  .where('isActive', '=', true)
  .where('createdAt', '>', '2023-01-01')
  .orderBy('createdAt', 'DESC')
  .limit(10)
  .offset(0);

const users = await connection.query(query.build());
```

## 🛡️ Error Handling

FoundryORM provides comprehensive error handling with custom error types:

```typescript
import { ORMErrors } from 'foundry-orm';

try {
  await connection.connect();
  const user = await User.find(999);
} catch (error) {
  if (error instanceof ORMErrors.ConnectionError) {
    console.error('Database connection failed:', error.message);
  } else if (error instanceof ORMErrors.QueryError) {
    console.error('Query execution failed:', error.message);
    console.error('SQL:', error.sql);
  } else if (error instanceof ORMErrors.ValidationError) {
    console.error('Validation failed:', error.message);
  } else if (error instanceof ORMErrors.NotFoundError) {
    console.error('Record not found');
  }
}
```

## 📝 Logging

Implement custom logging by extending the `ILogger` interface:

```typescript
import { ILogger } from 'foundry-orm';

class CustomLogger implements ILogger {
  info(message: string, meta?: any): void {
    console.log(`[INFO] ${message}`, meta);
  }

  warn(message: string, meta?: any): void {
    console.warn(`[WARN] ${message}`, meta);
  }

  error(message: string, meta?: any): void {
    console.error(`[ERROR] ${message}`, meta);
  }

  debug(message: string, meta?: any): void {
    console.debug(`[DEBUG] ${message}`, meta);
  }
}

const connection = new Connection('postgres', config, new CustomLogger());
```

## 🔍 Health Checks

Monitor database connectivity:

```typescript
const isHealthy = await connection.healthCheck();
if (isHealthy) {
  console.log('Database is healthy');
} else {
  console.error('Database health check failed');
}
```

## 📚 Documentation

- 📖 **[Getting Started Guide](https://sitharaj88.github.io/foundry-orm/docs/getting-started)** - Complete setup and basic usage
- 🏗️ **[Models & Decorators](https://sitharaj88.github.io/foundry-orm/docs/models)** - Learn about model definitions
- 🔌 **[Database Connections](https://sitharaj88.github.io/foundry-orm/docs/connections)** - Connection configuration
- 🔍 **[Query Builder](https://sitharaj88.github.io/foundry-orm/docs/query-builder)** - Advanced querying
- 🔄 **[Transactions](https://sitharaj88.github.io/foundry-orm/docs/transactions)** - Transaction management
- 💡 **[Examples](https://sitharaj88.github.io/foundry-orm/docs/examples)** - Real-world examples
- 📋 **[API Reference](https://sitharaj88.github.io/foundry-orm)** - Complete API documentation

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/models.test.ts
```

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -am 'Add my feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Submit a pull request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/sitharaj88/foundry-orm.git
cd foundry-orm

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## � Version History

### v0.1.0-alpha.1 (Current)
- 🎉 Initial alpha release
- ✅ Multi-database support (PostgreSQL, MySQL, SQLite, MongoDB)
- ✅ Connection pooling
- ✅ Transaction support
- ✅ Decorator-based models (@Entity, @Column)
- ✅ Query builder
- ✅ Health checks
- ✅ Comprehensive logging
- ✅ TypeScript support

## �🙏 Acknowledgments

- Built with ❤️ for the TypeScript and Node.js community
- Inspired by popular ORMs like TypeORM and Sequelize
- Thanks to all our contributors!

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/sitharaj88/foundry-orm/issues)
- 📖 **Documentation**: [Official Docs](https://sitharaj88.github.io/foundry-orm/)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/sitharaj88/foundry-orm/discussions)

---

<p align="center">
  <strong>FoundryORM v0.1.0-alpha.1</strong> - Building the future of TypeScript ORMs
</p>