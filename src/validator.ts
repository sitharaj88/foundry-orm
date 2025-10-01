import { ORMErrors } from './logger';

export class Validator {
  static validateConnectionConfig(type: string, config: any): void {
    if (!config) {
      throw new ORMErrors.ValidationError('Configuration is required');
    }

    switch (type) {
      case 'postgres':
      case 'mysql':
        if (!config.host || !config.port || !config.database || !config.user || !config.password) {
          throw new ORMErrors.ValidationError(`Invalid config for ${type}: missing required fields`);
        }
        break;
      case 'sqlite':
        if (!config.filename) {
          throw new ORMErrors.ValidationError('Invalid config for sqlite: missing filename');
        }
        break;
      case 'mongodb':
        if (!config.url || !config.database) {
          throw new ORMErrors.ValidationError('Invalid config for mongodb: missing url or database');
        }
        break;
      default:
        throw new ORMErrors.ValidationError(`Unsupported database type: ${type}`);
    }
  }

  static validateModel(model: any): void {
    const tableName = Reflect.getMetadata('tableName', model.constructor);
    const columns = Reflect.getMetadata('columns', model.constructor);

    if (!tableName) {
      throw new ORMErrors.ValidationError('Model must have @Entity decorator');
    }

    if (!columns || columns.length === 0) {
      throw new ORMErrors.ValidationError('Model must have at least one @Column');
    }
  }
}