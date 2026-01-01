# Changelog

All notable changes to FoundryORM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0-alpha.1] - 2026-01-01

### Added
- **Repository Pattern** - New `Repository<T>` class for clean data access layer separation
  - Supports multiple database connections simultaneously
  - Methods: `find()`, `findAll()`, `findOne()`, `create()`, `update()`, `delete()`, `count()`, `exists()`
- **Relationship Decorators** - Define model associations
  - `@HasMany(() => Model, foreignKey)` - One-to-many relationships
  - `@HasOne(() => Model, foreignKey)` - One-to-one relationships
  - `@BelongsTo(() => Model, foreignKey)` - Inverse relationships
  - `@ManyToMany(() => Model, pivotTable)` - Many-to-many relationships
  - Helper functions: `getRelations()`, `hasRelation()`
- **Cross-Database Query Builder** - Dialect-aware placeholder generation
  - PostgreSQL: `$1, $2, $3...` placeholders
  - MySQL/SQLite: `?, ?, ?...` placeholders
- **SQL Injection Prevention** - `sanitizeIdentifier()` validates all table/column names
- **Enhanced Type Safety** - Generic types for `BaseModel` methods
  - `ModelConstructor<T>` type helper
  - Proper TypeScript inference for `find()`, `findAll()`, `create()`
- **Standardized Query Results** - Unified `QueryResult` interface
  - Properties: `rows`, `rowCount`, `lastID`, `changes`
  - Consistent across all database adapters
- **Enhanced Column Options** - Extended `@Column` decorator
  - New options: `primary`, `autoIncrement`, `nullable`, `unique`, `default`, `length`, `precision`, `scale`

### Changed
- Improved MongoDB adapter with proper `QueryResult` compliance
- BaseModel now tracks database dialect for proper query generation
- QueryBuilder sanitizes table and column names

### Fixed
- Query placeholder mismatch between PostgreSQL and MySQL/SQLite
- Inconsistent return types from database adapters

## [0.1.0-alpha.1] - 2025-10-05

### Added
- Initial alpha release of FoundryORM
- Multi-database support:
  - PostgreSQL with connection pooling
  - MySQL with connection pooling
  - SQLite (in-memory and file-based)
  - MongoDB (basic support)
- Decorator-based model definition:
  - `@Entity` decorator for table/collection mapping
  - `@Column` decorator for field mapping
- BaseModel class with CRUD operations:
  - `create()` - Create new records
  - `find()` - Find by ID
  - `findAll()` - Retrieve all records
  - `save()` - Insert or update
  - `delete()` - Remove records
- Connection management:
  - Connection class with database adapters
  - Health check functionality
  - Graceful connection/disconnection
- Query Builder:
  - Fluent API for building queries
  - WHERE clause support
  - ORDER BY support
  - LIMIT/OFFSET support
- Transaction support:
  - ACID transactions across all SQL databases
  - Automatic rollback on errors
- Logging system:
  - ConsoleLogger implementation
  - Pluggable logger interface
  - Support for info, debug, error, and warn levels
- Validation:
  - Connection configuration validation
  - Model metadata validation
- Error handling:
  - Custom error types (ConnectionError, QueryError, ValidationError, TransactionError)
  - Detailed error messages
- TypeScript support:
  - Full type definitions
  - Decorator metadata using reflect-metadata
  - Generic type support

### Development
- Comprehensive test suite for SQLite
- Test files for MySQL, PostgreSQL, and MongoDB
- Example Express.js application
- Documentation website with Next.js
- Apache 2.0 license

### Known Limitations
- MongoDB support is basic (connection only)
- No migration system yet
- No relationship/association support yet
- Limited query builder features

[0.1.0-alpha.1]: https://github.com/sitharaj88/foundry-orm/releases/tag/v0.1.0-alpha.1
