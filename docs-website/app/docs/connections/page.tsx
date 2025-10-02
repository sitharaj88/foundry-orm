import { CodeBlock } from '@/components/CodeBlock';

export default function ConnectionsPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1>Database Connections</h1>
      <p className="lead">
        Learn how to connect to different databases and configure connection options.
      </p>

      <h2>Creating a Connection</h2>
      <p>
        Create a connection using the <code>Connection</code> class:
      </p>

      <CodeBlock language="typescript">
{`import { Connection, BaseModel } from 'foundry-orm';

const connection = new Connection('database-type', {
  // configuration options
});

await connection.connect();
BaseModel.setConnection(connection);`}
      </CodeBlock>

      <h2>PostgreSQL</h2>
      <p>Connect to a PostgreSQL database:</p>

      <CodeBlock language="typescript" filename="db/postgres.ts">
{`import { Connection, BaseModel } from 'foundry-orm';

const connection = new Connection('postgres', {
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'your_password',
  // Optional: connection pool settings
  max: 20,        // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

await connection.connect();
BaseModel.setConnection(connection);

export default connection;`}
      </CodeBlock>

      <h3>PostgreSQL with SSL</h3>
      <CodeBlock language="typescript">
{`const connection = new Connection('postgres', {
  host: 'production-db.example.com',
  port: 5432,
  database: 'myapp',
  user: 'app_user',
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});`}
      </CodeBlock>

      <h2>MySQL</h2>
      <p>Connect to a MySQL database:</p>

      <CodeBlock language="typescript" filename="db/mysql.ts">
{`import { Connection, BaseModel } from 'foundry-orm';

const connection = new Connection('mysql', {
  host: 'localhost',
  port: 3306,
  database: 'myapp',
  user: 'root',
  password: 'your_password',
  // Optional: connection pool settings
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
});

await connection.connect();
BaseModel.setConnection(connection);

export default connection;`}
      </CodeBlock>

      <h3>MySQL with Multiple Hosts</h3>
      <CodeBlock language="typescript">
{`const connection = new Connection('mysql', {
  host: ['master.example.com', 'replica1.example.com'],
  port: 3306,
  database: 'myapp',
  user: 'app_user',
  password: process.env.DB_PASSWORD,
});`}
      </CodeBlock>

      <h2>SQLite</h2>
      <p>Connect to a SQLite database:</p>

      <CodeBlock language="typescript" filename="db/sqlite.ts">
{`import { Connection, BaseModel } from 'foundry-orm';

// File-based database
const connection = new Connection('sqlite', {
  filename: './database.sqlite'
});

// Or in-memory database (for testing)
const memoryConnection = new Connection('sqlite', {
  filename: ':memory:'
});

await connection.connect();
BaseModel.setConnection(connection);

export default connection;`}
      </CodeBlock>

      <h2>MongoDB</h2>
      <p>Connect to a MongoDB database:</p>

      <CodeBlock language="typescript" filename="db/mongodb.ts">
{`import { Connection, BaseModel } from 'foundry-orm';

const connection = new Connection('mongodb', {
  url: 'mongodb://localhost:27017',
  database: 'myapp',
  // Optional: authentication
  user: 'app_user',
  password: 'your_password',
  authSource: 'admin',
});

await connection.connect();
BaseModel.setConnection(connection);

export default connection;`}
      </CodeBlock>

      <h3>MongoDB Atlas</h3>
      <CodeBlock language="typescript">
{`const connection = new Connection('mongodb', {
  url: 'mongodb+srv://cluster0.example.mongodb.net',
  database: 'myapp',
  user: 'app_user',
  password: process.env.MONGODB_PASSWORD,
  retryWrites: true,
  w: 'majority'
});`}
      </CodeBlock>

      <h2>Connection Methods</h2>

      <h3>connect()</h3>
      <p>Establish a connection to the database:</p>
      <CodeBlock language="typescript">
{`await connection.connect();
console.log('Connected to database');`}
      </CodeBlock>

      <h3>disconnect()</h3>
      <p>Close the database connection:</p>
      <CodeBlock language="typescript">
{`await connection.disconnect();
console.log('Disconnected from database');`}
      </CodeBlock>

      <h3>getAdapter()</h3>
      <p>Get the underlying database adapter for direct access:</p>
      <CodeBlock language="typescript">
{`const adapter = connection.getAdapter();
const results = await adapter.query('SELECT * FROM users WHERE active = ?', [true]);`}
      </CodeBlock>

      <h3>healthCheck()</h3>
      <p>Check if the database connection is healthy:</p>
      <CodeBlock language="typescript">
{`const isHealthy = await connection.healthCheck();
if (isHealthy) {
  console.log('Database is healthy');
} else {
  console.error('Database connection issue');
}`}
      </CodeBlock>

      <h2>Connection Pooling</h2>
      <p>
        FoundryORM automatically handles connection pooling for PostgreSQL and MySQL:
      </p>

      <CodeBlock language="typescript">
{`const connection = new Connection('postgres', {
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password',
  // Pool configuration
  max: 20,                      // Maximum pool size
  min: 5,                       // Minimum pool size
  idleTimeoutMillis: 30000,     // Close idle clients after 30s
  connectionTimeoutMillis: 2000 // Timeout after 2s
});`}
      </CodeBlock>

      <h2>Environment Variables</h2>
      <p>
        Use environment variables for sensitive configuration:
      </p>

      <CodeBlock language="typescript" filename="db/connection.ts">
{`import { Connection, BaseModel } from 'foundry-orm';
import dotenv from 'dotenv';

dotenv.config();

const connection = new Connection(
  process.env.DB_TYPE as 'postgres' | 'mysql' | 'sqlite' | 'mongodb',
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }
);

await connection.connect();
BaseModel.setConnection(connection);

export default connection;`}
      </CodeBlock>

      <CodeBlock language="bash" filename=".env">
{`DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=your_secure_password`}
      </CodeBlock>

      <h2>Multiple Connections</h2>
      <p>
        You can create multiple connections for different databases:
      </p>

      <CodeBlock language="typescript">
{`import { Connection } from 'foundry-orm';

// Primary database
const primaryDb = new Connection('postgres', {
  host: 'primary.example.com',
  database: 'main_app'
});
await primaryDb.connect();

// Analytics database
const analyticsDb = new Connection('postgres', {
  host: 'analytics.example.com',
  database: 'analytics'
});
await analyticsDb.connect();

// Use different connections for different models
User.setConnection(primaryDb);
AnalyticsEvent.setConnection(analyticsDb);`}
      </CodeBlock>

      <h2>Error Handling</h2>
      <p>Always handle connection errors properly:</p>

      <CodeBlock language="typescript">
{`import { Connection, ConnectionError } from 'foundry-orm';

try {
  const connection = new Connection('postgres', config);
  await connection.connect();
  console.log('Connected successfully');
} catch (error) {
  if (error instanceof ConnectionError) {
    console.error('Failed to connect:', error.message);
    // Handle connection error (retry, fallback, etc.)
  } else {
    throw error;
  }
}`}
      </CodeBlock>

      <h2>Best Practices</h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-6">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Tips
        </p>
        <ul className="text-sm text-blue-800 dark:text-blue-300 m-0 space-y-1">
          <li>Store sensitive credentials in environment variables</li>
          <li>Use connection pooling for production applications</li>
          <li>Always close connections when shutting down your app</li>
          <li>Use health checks to monitor database status</li>
          <li>Configure appropriate timeout values</li>
          <li>Test connections before deploying</li>
        </ul>
      </div>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <a href="/foundry-orm/docs/models">Define models for your database</a>
        </li>
        <li>
          <a href="/foundry-orm/docs/query-builder">Build complex queries</a>
        </li>
        <li>
          <a href="/foundry-orm/docs/transactions">Use transactions</a>
        </li>
        <li>
          <a href="/foundry-orm/docs/pooling">Learn more about connection pooling</a>
        </li>
      </ul>
    </div>
  );
}
