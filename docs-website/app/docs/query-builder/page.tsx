import { CodeBlock } from '@/components/CodeBlock';

export default function QueryBuilderPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1>Query Builder</h1>
      <p className="lead">
        Build complex SQL queries with a fluent, type-safe API that protects against SQL injection.
      </p>

      <h2>Basic Usage</h2>
      <p>
        Create a query builder instance using your database adapter:
      </p>

      <CodeBlock language="typescript">
{`import { QueryBuilder } from 'typescript-orm';
import connection from './db/connection';

const adapter = connection.getAdapter();
const qb = new QueryBuilder(adapter);

const results = await qb
  .select('*')
  .from('users')
  .execute();`}
      </CodeBlock>

      <h2>Select Queries</h2>

      <h3>Select All Columns</h3>
      <CodeBlock language="typescript">
{`const users = await qb
  .select('*')
  .from('users')
  .execute();`}
      </CodeBlock>

      <h3>Select Specific Columns</h3>
      <CodeBlock language="typescript">
{`const users = await qb
  .select('id, name, email')
  .from('users')
  .execute();`}
      </CodeBlock>

      <h3>Select with Aliases</h3>
      <CodeBlock language="typescript">
{`const results = await qb
  .select('u.id, u.name as username, u.email')
  .from('users u')
  .execute();`}
      </CodeBlock>

      <h2>Where Clauses</h2>

      <h3>Simple Where</h3>
      <CodeBlock language="typescript">
{`const activeUsers = await qb
  .select('*')
  .from('users')
  .where('status', '=', 'active')
  .execute();`}
      </CodeBlock>

      <h3>Multiple Where Clauses</h3>
      <CodeBlock language="typescript">
{`const results = await qb
  .select('*')
  .from('users')
  .where('status', '=', 'active')
  .where('age', '>=', 18)
  .where('country', '=', 'USA')
  .execute();`}
      </CodeBlock>

      <h3>Different Operators</h3>
      <CodeBlock language="typescript">
{`// Equals
qb.where('status', '=', 'active')

// Not equals
qb.where('status', '!=', 'deleted')

// Greater than
qb.where('age', '>', 18)

// Greater than or equal
qb.where('age', '>=', 18)

// Less than
qb.where('price', '<', 100)

// Less than or equal
qb.where('price', '<=', 100)

// LIKE pattern matching
qb.where('email', 'LIKE', '%@gmail.com')

// IN clause
qb.where('status', 'IN', ['active', 'pending'])

// IS NULL
qb.where('deleted_at', 'IS NULL', null)`}
      </CodeBlock>

      <h2>Sorting</h2>

      <h3>Order By Single Column</h3>
      <CodeBlock language="typescript">
{`const users = await qb
  .select('*')
  .from('users')
  .orderBy('created_at', 'DESC')
  .execute();`}
      </CodeBlock>

      <h3>Order By Multiple Columns</h3>
      <CodeBlock language="typescript">
{`const users = await qb
  .select('*')
  .from('users')
  .orderBy('last_name', 'ASC')
  .orderBy('first_name', 'ASC')
  .execute();`}
      </CodeBlock>

      <h2>Pagination</h2>

      <h3>Limit</h3>
      <CodeBlock language="typescript">
{`const topUsers = await qb
  .select('*')
  .from('users')
  .orderBy('score', 'DESC')
  .limit(10)
  .execute();`}
      </CodeBlock>

      <h3>Limit with Offset</h3>
      <CodeBlock language="typescript">
{`// Get page 3 (assuming 20 items per page)
const page3 = await qb
  .select('*')
  .from('users')
  .orderBy('created_at', 'DESC')
  .limit(20)
  .offset(40)  // Skip first 40 records
  .execute();`}
      </CodeBlock>

      <h2>Complex Queries</h2>

      <h3>Search and Filter</h3>
      <CodeBlock language="typescript">
{`const searchResults = await qb
  .select('id, name, email, created_at')
  .from('users')
  .where('status', '=', 'active')
  .where('email', 'LIKE', '%@company.com')
  .where('created_at', '>=', '2024-01-01')
  .orderBy('name', 'ASC')
  .limit(50)
  .execute();`}
      </CodeBlock>

      <h3>Joining Tables</h3>
      <CodeBlock language="typescript">
{`// Manual join using raw query
const adapter = connection.getAdapter();
const usersWithPosts = await adapter.query(\`
  SELECT 
    u.id, 
    u.name, 
    u.email,
    COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON u.id = p.author_id
  WHERE u.status = ?
  GROUP BY u.id, u.name, u.email
  ORDER BY post_count DESC
\`, ['active']);`}
      </CodeBlock>

      <h3>Aggregate Functions</h3>
      <CodeBlock language="typescript">
{`// Count
const countResult = await adapter.query(
  'SELECT COUNT(*) as total FROM users WHERE status = ?',
  ['active']
);
const totalUsers = countResult[0].total;

// Average
const avgResult = await adapter.query(
  'SELECT AVG(price) as avg_price FROM products'
);

// Sum
const sumResult = await adapter.query(
  'SELECT SUM(amount) as total_revenue FROM orders WHERE status = ?',
  ['completed']
);

// Min and Max
const rangeResult = await adapter.query(
  'SELECT MIN(price) as min_price, MAX(price) as max_price FROM products'
);`}
      </CodeBlock>

      <h2>Building vs Executing</h2>

      <h3>Build SQL String</h3>
      <CodeBlock language="typescript">
{`const qb = new QueryBuilder(adapter);
qb.select('*')
  .from('users')
  .where('status', '=', 'active')
  .orderBy('created_at', 'DESC')
  .limit(10);

// Get the SQL string and parameters
const { sql, params } = qb.build();
console.log('SQL:', sql);
console.log('Params:', params);

// Execute later
const results = await qb.execute();`}
      </CodeBlock>

      <h2>SQL Injection Protection</h2>
      <p>
        The Query Builder automatically uses parameterized queries to protect against SQL injection:
      </p>

      <CodeBlock language="typescript">
{`// SAFE - parameters are properly escaped
const userInput = "admin'; DROP TABLE users--";
const results = await qb
  .select('*')
  .from('users')
  .where('username', '=', userInput)
  .execute();

// This generates a safe query:
// SQL: SELECT * FROM users WHERE username = ?
// Params: ["admin'; DROP TABLE users--"]`}
      </CodeBlock>

      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 my-6">
        <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">
          Warning
        </p>
        <p className="text-sm text-red-800 dark:text-red-300 m-0">
          Never concatenate user input directly into SQL queries. Always use the Query Builder
          or parameterized queries to prevent SQL injection attacks.
        </p>
      </div>

      <h2>Practical Examples</h2>

      <h3>User Search</h3>
      <CodeBlock language="typescript" filename="services/userSearch.ts">
{`import { QueryBuilder } from 'typescript-orm';
import connection from '../db/connection';

export async function searchUsers(
  searchTerm: string,
  status?: string,
  page: number = 1,
  perPage: number = 20
) {
  const adapter = connection.getAdapter();
  const qb = new QueryBuilder(adapter);

  qb.select('id, username, email, created_at')
    .from('users')
    .where('username', 'LIKE', \`%\${searchTerm}%\`);

  if (status) {
    qb.where('status', '=', status);
  }

  qb.orderBy('created_at', 'DESC')
    .limit(perPage)
    .offset((page - 1) * perPage);

  return await qb.execute();
}`}
      </CodeBlock>

      <h3>Product Filtering</h3>
      <CodeBlock language="typescript" filename="services/productFilter.ts">
{`export async function filterProducts(filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'name' | 'created';
  sortOrder?: 'ASC' | 'DESC';
}) {
  const adapter = connection.getAdapter();
  const qb = new QueryBuilder(adapter);

  qb.select('*').from('products');

  if (filters.category) {
    qb.where('category', '=', filters.category);
  }

  if (filters.minPrice !== undefined) {
    qb.where('price', '>=', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    qb.where('price', '<=', filters.maxPrice);
  }

  if (filters.inStock) {
    qb.where('stock', '>', 0);
  }

  const sortColumn = filters.sortBy || 'created_at';
  const sortOrder = filters.sortOrder || 'DESC';
  qb.orderBy(sortColumn, sortOrder);

  return await qb.execute();
}`}
      </CodeBlock>

      <h2>Best Practices</h2>

      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 my-6">
        <p className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
          Tips
        </p>
        <ul className="text-sm text-green-800 dark:text-green-300 m-0 space-y-1">
          <li>Always use the Query Builder or parameterized queries</li>
          <li>Select only the columns you need instead of using SELECT *</li>
          <li>Use indexes on columns in WHERE and ORDER BY clauses</li>
          <li>Implement pagination for large result sets</li>
          <li>Use LIMIT to prevent accidental full table scans</li>
          <li>Test queries with EXPLAIN to optimize performance</li>
        </ul>
      </div>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <a href="/docs/transactions">Learn about transactions</a>
        </li>
        <li>
          <a href="/docs/models">Work with models for simpler queries</a>
        </li>
        <li>
          <a href="/docs/examples">See real-world query examples</a>
        </li>
      </ul>
    </div>
  );
}
