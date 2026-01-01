import 'reflect-metadata';
import {
    HasMany,
    HasOne,
    BelongsTo,
    ManyToMany,
    getRelations,
    hasRelation
} from '../src/relationships';
import { Entity, Column, BaseModel } from '../src/model';

describe('Relationship Decorators Tests', () => {
    @Entity('users')
    class User extends BaseModel {
        @Column({ primary: true, autoIncrement: true })
        id!: number;

        @Column()
        name!: string;
    }

    @Entity('posts')
    class Post extends BaseModel {
        @Column({ primary: true, autoIncrement: true })
        id!: number;

        @Column()
        title!: string;

        @Column()
        userId!: number;
    }

    @Entity('profiles')
    class Profile extends BaseModel {
        @Column({ primary: true, autoIncrement: true })
        id!: number;

        @Column()
        bio!: string;

        @Column()
        userId!: number;
    }

    @Entity('roles')
    class Role extends BaseModel {
        @Column({ primary: true, autoIncrement: true })
        id!: number;

        @Column()
        name!: string;
    }

    describe('@HasMany decorator', () => {
        @Entity('test_users')
        class TestUser extends BaseModel {
            @Column({ primary: true })
            id!: number;

            @HasMany(() => Post, 'userId')
            posts!: Post[];
        }

        test('stores hasMany relationship metadata', () => {
            const relations = getRelations(TestUser);
            expect(relations).toHaveLength(1);
            expect(relations[0].type).toBe('hasMany');
            expect(relations[0].propertyKey).toBe('posts');
            expect(relations[0].foreignKey).toBe('userId');
        });
    });

    describe('@HasOne decorator', () => {
        @Entity('test_users_2')
        class TestUser2 extends BaseModel {
            @Column({ primary: true })
            id!: number;

            @HasOne(() => Profile, 'userId')
            profile!: Profile;
        }

        test('stores hasOne relationship metadata', () => {
            const relations = getRelations(TestUser2);
            expect(relations).toHaveLength(1);
            expect(relations[0].type).toBe('hasOne');
            expect(relations[0].propertyKey).toBe('profile');
            expect(relations[0].foreignKey).toBe('userId');
        });
    });

    describe('@BelongsTo decorator', () => {
        @Entity('test_posts')
        class TestPost extends BaseModel {
            @Column({ primary: true })
            id!: number;

            @Column()
            userId!: number;

            @BelongsTo(() => User, 'userId')
            user!: User;
        }

        test('stores belongsTo relationship metadata', () => {
            const relations = getRelations(TestPost);
            expect(relations).toHaveLength(1);
            expect(relations[0].type).toBe('belongsTo');
            expect(relations[0].propertyKey).toBe('user');
            expect(relations[0].foreignKey).toBe('userId');
        });
    });

    describe('@ManyToMany decorator', () => {
        @Entity('test_users_3')
        class TestUser3 extends BaseModel {
            @Column({ primary: true })
            id!: number;

            @ManyToMany(() => Role, 'user_roles')
            roles!: Role[];
        }

        test('stores manyToMany relationship metadata', () => {
            const relations = getRelations(TestUser3);
            expect(relations).toHaveLength(1);
            expect(relations[0].type).toBe('manyToMany');
            expect(relations[0].propertyKey).toBe('roles');
            expect(relations[0].pivotTable).toBe('user_roles');
        });
    });

    describe('Utility functions', () => {
        @Entity('utility_test')
        class UtilityTest extends BaseModel {
            @Column({ primary: true })
            id!: number;

            @HasMany(() => Post)
            posts!: Post[];

            @HasOne(() => Profile)
            profile!: Profile;
        }

        test('getRelations returns all relationships', () => {
            const relations = getRelations(UtilityTest);
            expect(relations).toHaveLength(2);
        });

        test('hasRelation returns true for existing relationship', () => {
            expect(hasRelation(UtilityTest, 'posts')).toBe(true);
            expect(hasRelation(UtilityTest, 'profile')).toBe(true);
        });

        test('hasRelation returns false for non-existing relationship', () => {
            expect(hasRelation(UtilityTest, 'nonExistent')).toBe(false);
        });
    });

    describe('Default foreign key inference', () => {
        @Entity('infer_test')
        class InferTest extends BaseModel {
            @Column({ primary: true })
            id!: number;

            @HasMany(() => Post)
            posts!: Post[];
        }

        test('infers foreign key from class name', () => {
            const relations = getRelations(InferTest);
            expect(relations[0].foreignKey).toBe('infertestId');
        });
    });
});
