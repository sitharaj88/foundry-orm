import { CodeBlock } from '@/components/CodeBlock';

export default function ModelsPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1>Models & Decorators</h1>
      <p className="lead">
        Learn how to define models using decorators and leverage the powerful BaseModel class.
      </p>

      <h2>The @Entity Decorator</h2>
      <p>
        The <code>@Entity</code> decorator defines the database table for your model:
      </p>

      <CodeBlock language="typescript">
{`import { Entity, BaseModel } from 'typescript-orm';

@Entity('users')  // Maps to 'users' table
export class User extends BaseModel {
  // Model properties...
}`}
      </CodeBlock>

      <h2>The @Column Decorator</h2>
      <p>
        The <code>@Column</code> decorator maps class properties to database columns:
      </p>

      <h3>Basic Usage</h3>
      <CodeBlock language="typescript">
{`@Entity('users')
export class User extends BaseModel {
  @Column('id')
  id!: number;

  @Column('name')
  name!: string;

  @Column('email')
  email!: string;
}`}
      </CodeBlock>

      <h3>Advanced Configuration</h3>
      <p>
        Pass an object to <code>@Column</code> for advanced configuration:
      </p>

      <CodeBlock language="typescript">
{`@Entity('products')
export class Product extends BaseModel {
  @Column({ name: 'id', type: 'integer', primary: true })
  id!: number;

  @Column({ name: 'product_name', type: 'varchar' })
  name!: string;

  @Column({ name: 'price', type: 'decimal' })
  price!: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;
}`}
      </CodeBlock>

      <h2>BaseModel Methods</h2>
      <p>
        All models extend <code>BaseModel</code>, which provides CRUD methods:
      </p>

      <h3>Static Methods</h3>

      <h4>find(id)</h4>
      <p>Find a record by its primary key:</p>
      <CodeBlock language="typescript">
{`const user = await User.find(1);
if (user) {
  console.log(user.name);
}`}
      </CodeBlock>

      <h4>findAll()</h4>
      <p>Retrieve all records from the table:</p>
      <CodeBlock language="typescript">
{`const users = await User.findAll();
users.forEach(user => console.log(user.name));`}
      </CodeBlock>

      <h4>create(data)</h4>
      <p>Create and save a new record:</p>
      <CodeBlock language="typescript">
{`const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com'
});
console.log('Created user with ID:', user.id);`}
      </CodeBlock>

      <h3>Instance Methods</h3>

      <h4>save()</h4>
      <p>Save changes to an existing record or insert a new one:</p>
      <CodeBlock language="typescript">
{`const user = await User.find(1);
if (user) {
  user.name = 'Jane Doe';
  await user.save();
  console.log('User updated');
}`}
      </CodeBlock>

      <h4>delete()</h4>
      <p>Delete a record from the database:</p>
      <CodeBlock language="typescript">
{`const user = await User.find(1);
if (user) {
  await user.delete();
  console.log('User deleted');
}`}
      </CodeBlock>

      <h2>Model Examples</h2>

      <h3>User Model</h3>
      <CodeBlock language="typescript" filename="models/User.ts">
{`import { Entity, Column, BaseModel } from 'typescript-orm';

@Entity('users')
export class User extends BaseModel {
  @Column('id')
  id!: number;

  @Column('username')
  username!: string;

  @Column('email')
  email!: string;

  @Column('password_hash')
  passwordHash!: string;

  @Column({ name: 'is_active', type: 'boolean' })
  isActive!: boolean;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;
}`}
      </CodeBlock>

      <h3>Post Model</h3>
      <CodeBlock language="typescript" filename="models/Post.ts">
{`import { Entity, Column, BaseModel } from 'typescript-orm';

@Entity('posts')
export class Post extends BaseModel {
  @Column('id')
  id!: number;

  @Column('title')
  title!: string;

  @Column('content')
  content!: string;

  @Column('author_id')
  authorId!: number;

  @Column({ name: 'published', type: 'boolean' })
  published!: boolean;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}`}
      </CodeBlock>

      <h3>Product Model with Custom Methods</h3>
      <CodeBlock language="typescript" filename="models/Product.ts">
{`import { Entity, Column, BaseModel } from 'typescript-orm';

@Entity('products')
export class Product extends BaseModel {
  @Column('id')
  id!: number;

  @Column('name')
  name!: string;

  @Column('description')
  description!: string;

  @Column('price')
  price!: number;

  @Column('stock')
  stock!: number;

  // Custom method
  isInStock(): boolean {
    return this.stock > 0;
  }

  // Custom method with logic
  applyDiscount(percentage: number): number {
    return this.price * (1 - percentage / 100);
  }

  // Custom static method
  static async findInStock(): Promise<Product[]> {
    const allProducts = await Product.findAll();
    return allProducts.filter(p => p.stock > 0);
  }
}`}
      </CodeBlock>

      <h2>Best Practices</h2>

      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 my-6">
        <p className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
          ✓ Do's
        </p>
        <ul className="text-sm text-green-800 dark:text-green-300 m-0 space-y-1">
          <li>Use TypeScript's type system for better type safety</li>
          <li>Define models in separate files (one model per file)</li>
          <li>Use descriptive property names that match your domain</li>
          <li>Add custom methods for business logic</li>
          <li>Use the <code>!</code> definite assignment assertion for required fields</li>
          <li>Use <code>?</code> for optional/nullable fields</li>
        </ul>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 my-6">
        <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">
          ✗ Don'ts
        </p>
        <ul className="text-sm text-red-800 dark:text-red-300 m-0 space-y-1">
          <li>Don't forget to extend <code>BaseModel</code></li>
          <li>Don't forget the <code>@Entity</code> decorator</li>
          <li>Don't forget to decorate properties with <code>@Column</code></li>
          <li>Don't mix database logic with business logic</li>
          <li>Don't hardcode database connection in models</li>
        </ul>
      </div>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <a href="/docs/connections">Learn about database connections</a>
        </li>
        <li>
          <a href="/docs/query-builder">Build complex queries</a>
        </li>
        <li>
          <a href="/docs/transactions">Work with transactions</a>
        </li>
        <li>
          <a href="/docs/validation">Add validation to models</a>
        </li>
      </ul>
    </div>
  );
}
