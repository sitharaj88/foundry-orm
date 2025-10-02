import { CodeBlock } from '@/components/CodeBlock';

export default function QuickStartPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1>Quick Start</h1>
      <p className="lead">
        Learn the basics of TypeScript ORM in 5 minutes with this quick start guide.
      </p>

      <h2>Step 1: Define Your Model</h2>
      <p>
        Create a model class using the <code>@Entity</code> and <code>@Column</code> decorators:
      </p>

      <CodeBlock language="typescript" filename="models/User.ts">
{`import { Entity, Column, BaseModel } from 'typescript-orm';

@Entity('users')
export class User extends BaseModel {
  @Column('id')
  id!: number;

  @Column('name')
  name!: string;

  @Column('email')
  email!: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}`}
      </CodeBlock>

      <h2>Step 2: Create a Database Connection</h2>
      <p>
        Set up a connection to your database. Here's an example with SQLite:
      </p>

      <CodeBlock language="typescript" filename="db/connection.ts">
{`import { Connection, BaseModel } from 'typescript-orm';

// Create connection
const connection = new Connection('sqlite', {
  filename: './database.sqlite'
});

// Connect to database
await connection.connect();

// Set connection for all models
BaseModel.setConnection(connection);

export default connection;`}
      </CodeBlock>

      <h2>Step 3: Create the Database Table</h2>
      <p>
        Initialize your database schema. Here's an example for SQLite:
      </p>

      <CodeBlock language="typescript" filename="db/init.ts">
{`import connection from './connection';

const adapter = connection.getAdapter();

// Create users table
await adapter.query(\`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
\`);

console.log('Database initialized!');`}
      </CodeBlock>

      <h2>Step 4: Perform CRUD Operations</h2>
      <p>Now you can create, read, update, and delete records:</p>

      <h3>Create a Record</h3>
      <CodeBlock language="typescript">
{`import { User } from './models/User';

// Create a new user
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date()
});

console.log('Created user:', user.id);`}
      </CodeBlock>

      <h3>Read Records</h3>
      <CodeBlock language="typescript">
{`// Find a user by ID
const user = await User.find(1);
console.log('User:', user?.name);

// Find all users
const allUsers = await User.findAll();
console.log('Total users:', allUsers.length);`}
      </CodeBlock>

      <h3>Update a Record</h3>
      <CodeBlock language="typescript">
{`// Find and update
const user = await User.find(1);
if (user) {
  user.name = 'Jane Doe';
  user.email = 'jane@example.com';
  await user.save();
  console.log('User updated!');
}`}
      </CodeBlock>

      <h3>Delete a Record</h3>
      <CodeBlock language="typescript">
{`// Find and delete
const user = await User.find(1);
if (user) {
  await user.delete();
  console.log('User deleted!');
}`}
      </CodeBlock>

      <h2>Step 5: Use Query Builder</h2>
      <p>
        For more complex queries, use the built-in query builder:
      </p>

      <CodeBlock language="typescript">
{`import { QueryBuilder } from 'typescript-orm';
import connection from './db/connection';

const adapter = connection.getAdapter();
const qb = new QueryBuilder(adapter);

// Find users with specific criteria
const results = await qb
  .select('*')
  .from('users')
  .where('email', 'LIKE', '%@example.com')
  .orderBy('created_at', 'DESC')
  .limit(10)
  .execute();

console.log('Found users:', results.length);`}
      </CodeBlock>

      <h2>Complete Example</h2>
      <p>Here's a complete working example:</p>

      <CodeBlock language="typescript" filename="app.ts">
{`import { Connection, Entity, Column, BaseModel } from 'typescript-orm';

// Define model
@Entity('users')
class User extends BaseModel {
  @Column('id') id!: number;
  @Column('name') name!: string;
  @Column('email') email!: string;
}

// Main function
async function main() {
  // Connect to database
  const connection = new Connection('sqlite', {
    filename: ':memory:' // In-memory database for demo
  });
  await connection.connect();
  BaseModel.setConnection(connection);

  // Create table
  const adapter = connection.getAdapter();
  await adapter.query(\`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    )
  \`);

  // Create user
  const user = await User.create({
    name: 'Alice',
    email: 'alice@example.com'
  });
  console.log('Created:', user);

  // Find user
  const found = await User.find(user.id);
  console.log('Found:', found?.name);

  // Update user
  if (found) {
    found.name = 'Alice Smith';
    await found.save();
    console.log('Updated:', found.name);
  }

  // List all users
  const all = await User.findAll();
  console.log('Total users:', all.length);

  // Delete user
  if (found) {
    await found.delete();
    console.log('Deleted');
  }

  // Disconnect
  await connection.disconnect();
}

main().catch(console.error);`}
      </CodeBlock>

      <h2>Next Steps</h2>
      <p>Now that you understand the basics, explore:</p>
      <ul>
        <li>
          <a href="/docs/models">Advanced model features and decorators</a>
        </li>
        <li>
          <a href="/docs/connections">Different database configurations</a>
        </li>
        <li>
          <a href="/docs/query-builder">Complex queries with Query Builder</a>
        </li>
        <li>
          <a href="/docs/transactions">Transaction management</a>
        </li>
        <li>
          <a href="/docs/examples">Real-world examples</a>
        </li>
      </ul>
    </div>
  );
}
