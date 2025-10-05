# Changelog

All notable changes to FoundryORM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
