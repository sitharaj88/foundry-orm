import { CodeBlock } from '@/components/CodeBlock';
import { Code } from 'lucide-react';

export default function Examples() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <div className="flex items-center gap-3 mb-8">
        <Code className="w-10 h-10 text-blue-600" />
        <h1 className="mb-0">Examples</h1>
      </div>

      <p className="lead">
        Learn by example! Here are common use cases and patterns for TypeScript ORM.
      </p>

      <h2>Express.js Integration</h2>
      <p>Complete REST API example with Express.js:</p>
      <CodeBlock
        code={`import 'reflect-metadata';
import express from 'express';
import { Connection, Entity, Column, BaseModel, ConsoleLogger } from 'typescript-orm';

// Define User model
@Entity('users')
class User extends BaseModel {
  @Column('id')
  id!: number;

  @Column('name')
  name!: string;

  @Column('email')
  email!: string;

  @Column('age')
  age?: number;
}

const app = express();
app.use(express.json());

// Initialize database
async function initDatabase() {
  const connection = new Connection(
    'sqlite',
    { filename: './database.db' },
    new ConsoleLogger()
  );
  await connection.connect();
  BaseModel.setConnection(connection);

  // Create table
  await connection.getAdapter().query(\`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age INTEGER
    )
  \`, []);
}

// Routes
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ success: true, data: users, count: users.length });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.find(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    Object.assign(user, req.body);
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.find(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    await user.delete();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Start server
initDatabase().then(() => {
  app.listen(3000, () => console.log('Server running on port 3000'));
});`}
        language="typescript"
        filename="server.ts"
      />

      <h2>Using with PostgreSQL</h2>
      <CodeBlock
        code={`import 'reflect-metadata';
import { Connection, Entity, Column, BaseModel, ConsoleLogger } from 'typescript-orm';

@Entity('products')
class Product extends BaseModel {
  @Column('id')
  id!: number;

  @Column('name')
  name!: string;

  @Column('price')
  price!: number;

  @Column('stock')
  stock!: number;
}

// Connect to PostgreSQL
const connection = new Connection(
  'postgres',
  {
    host: 'localhost',
    port: 5432,
    database: 'store',
    user: 'postgres',
    password: 'password',
    maxConnections: 20  // Connection pool size
  },
  new ConsoleLogger()
);

await connection.connect();
BaseModel.setConnection(connection);

// CRUD operations
const product = await Product.create({
  name: 'Laptop',
  price: 999.99,
  stock: 50
});

const allProducts = await Product.findAll();
console.log('Products:', allProducts);

await connection.disconnect();`}
        language="typescript"
        filename="postgres-example.ts"
      />

      <h2>Using with MongoDB</h2>
      <CodeBlock
        code={`import 'reflect-metadata';
import { Connection, Entity, Column, BaseModel, ConsoleLogger } from 'typescript-orm';

@Entity('orders')
class Order extends BaseModel {
  @Column('_id')
  id!: string;

  @Column('customer_id')
  customerId!: string;

  @Column('items')
  items!: Array<{ product_id: string; quantity: number }>;

  @Column('total')
  total!: number;

  @Column('status')
  status!: string;
}

// Connect to MongoDB
const connection = new Connection(
  'mongodb',
  {
    url: 'mongodb://localhost:27017',
    database: 'ecommerce',
    maxPoolSize: 10
  },
  new ConsoleLogger()
);

await connection.connect();
BaseModel.setConnection(connection);

// Create order
const order = await Order.create({
  customerId: 'user_123',
  items: [
    { product_id: 'prod_1', quantity: 2 },
    { product_id: 'prod_2', quantity: 1 }
  ],
  total: 299.97,
  status: 'pending'
});

console.log('Order created:', order);

await connection.disconnect();`}
        language="typescript"
        filename="mongodb-example.ts"
      />

      <h2>Using Transactions</h2>
      <CodeBlock
        code={`import { Connection } from 'typescript-orm';

const connection = new Connection('postgres', config);
await connection.connect();

// Perform transactional operations
await connection.getAdapter().transaction(async (adapter) => {
  // Deduct from account A
  await adapter.query(
    'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
    [100, accountA_id]
  );

  // Add to account B
  await adapter.query(
    'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
    [100, accountB_id]
  );

  // If any error occurs, transaction will be automatically rolled back
});

console.log('Transaction completed successfully');`}
        language="typescript"
        filename="transaction-example.ts"
      />

      <h2>Using Query Builder</h2>
      <CodeBlock
        code={`import { QueryBuilder } from 'typescript-orm';

const qb = new QueryBuilder('users', connection.getAdapter());

// Build complex queries
qb.where('age', '>', 18)
  .where('status', '=', 'active')
  .orderBy('created_at', 'DESC')
  .limit(10)
  .offset(0);

const result = await qb.execute();
console.log('Active adult users:', result.rows);`}
        language="typescript"
        filename="query-builder-example.ts"
      />

      <h2>Custom Logger</h2>
      <CodeBlock
        code={`import { ILogger } from 'typescript-orm';

class CustomLogger implements ILogger {
  info(message: string, meta?: any): void {
    console.info(\`[\${new Date().toISOString()}] INFO: \${message}\`, meta);
  }

  error(message: string, meta?: any): void {
    console.error(\`[\${new Date().toISOString()}] ERROR: \${message}\`, meta);
    // Send to error tracking service
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(\`[\${new Date().toISOString()}] DEBUG: \${message}\`, meta);
    }
  }
}

const connection = new Connection('postgres', config, new CustomLogger());`}
        language="typescript"
        filename="custom-logger.ts"
      />

      <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h3 className="mt-0 text-green-900 dark:text-green-100">More Examples</h3>
        <p className="mb-0 text-green-800 dark:text-green-200">
          Check out our{' '}
          <a href="https://github.com/yourusername/typescript-orm/tree/main/examples" className="text-green-600 dark:text-green-400 hover:underline">
            GitHub repository
          </a>{' '}
          for more complete examples and sample applications.
        </p>
      </div>
    </div>
  );
}
