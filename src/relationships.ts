import 'reflect-metadata';
import { BaseModel } from './model';

/**
 * Relationship types
 */
export type RelationType = 'hasMany' | 'hasOne' | 'belongsTo' | 'manyToMany';

/**
 * Relationship metadata structure
 */
export interface RelationMetadata {
    type: RelationType;
    propertyKey: string;
    relatedModel: () => typeof BaseModel;
    foreignKey?: string;
    pivotTable?: string;
}

/**
 * HasMany relationship decorator
 * 
 * Defines a one-to-many relationship where the current model has many related models.
 * 
 * @example
 * ```typescript
 * @Entity('users')
 * class User extends BaseModel {
 *   @HasMany(() => Post, 'userId')
 *   posts: Post[];
 * }
 * ```
 */
export function HasMany(relatedModel: () => typeof BaseModel, foreignKey?: string) {
    return function (target: any, propertyKey: string) {
        const relations = Reflect.getMetadata('relations', target.constructor) || [];

        relations.push({
            type: 'hasMany' as RelationType,
            propertyKey,
            relatedModel,
            foreignKey: foreignKey || `${target.constructor.name.toLowerCase()}Id`
        });

        Reflect.defineMetadata('relations', relations, target.constructor);
    };
}

/**
 * HasOne relationship decorator
 * 
 * Defines a one-to-one relationship where the current model has one related model.
 * 
 * @example
 * ```typescript
 * @Entity('users')
 * class User extends BaseModel {
 *   @HasOne(() => Profile, 'userId')
 *   profile: Profile;
 * }
 * ```
 */
export function HasOne(relatedModel: () => typeof BaseModel, foreignKey?: string) {
    return function (target: any, propertyKey: string) {
        const relations = Reflect.getMetadata('relations', target.constructor) || [];

        relations.push({
            type: 'hasOne' as RelationType,
            propertyKey,
            relatedModel,
            foreignKey: foreignKey || `${target.constructor.name.toLowerCase()}Id`
        });

        Reflect.defineMetadata('relations', relations, target.constructor);
    };
}

/**
 * BelongsTo relationship decorator
 * 
 * Defines an inverse one-to-one or one-to-many relationship.
 * 
 * @example
 * ```typescript
 * @Entity('posts')
 * class Post extends BaseModel {
 *   @Column()
 *   userId: number;
 * 
 *   @BelongsTo(() => User, 'userId')
 *   user: User;
 * }
 * ```
 */
export function BelongsTo(relatedModel: () => typeof BaseModel, foreignKey?: string) {
    return function (target: any, propertyKey: string) {
        const relations = Reflect.getMetadata('relations', target.constructor) || [];

        // Default foreign key is the propertyKey + 'Id' (e.g., 'user' -> 'userId')
        const defaultForeignKey = foreignKey || `${propertyKey}Id`;

        relations.push({
            type: 'belongsTo' as RelationType,
            propertyKey,
            relatedModel,
            foreignKey: defaultForeignKey
        });

        Reflect.defineMetadata('relations', relations, target.constructor);
    };
}

/**
 * ManyToMany relationship decorator
 * 
 * Defines a many-to-many relationship through a pivot table.
 * 
 * @example
 * ```typescript
 * @Entity('users')
 * class User extends BaseModel {
 *   @ManyToMany(() => Role, 'user_roles')
 *   roles: Role[];
 * }
 * ```
 */
export function ManyToMany(relatedModel: () => typeof BaseModel, pivotTable: string) {
    return function (target: any, propertyKey: string) {
        const relations = Reflect.getMetadata('relations', target.constructor) || [];

        relations.push({
            type: 'manyToMany' as RelationType,
            propertyKey,
            relatedModel,
            pivotTable
        });

        Reflect.defineMetadata('relations', relations, target.constructor);
    };
}

/**
 * Get all relationship metadata for a model
 */
export function getRelations(model: typeof BaseModel): RelationMetadata[] {
    return Reflect.getMetadata('relations', model) || [];
}

/**
 * Check if a model has a specific relationship
 */
export function hasRelation(model: typeof BaseModel, propertyKey: string): boolean {
    const relations = getRelations(model);
    return relations.some(r => r.propertyKey === propertyKey);
}
