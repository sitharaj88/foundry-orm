import { CodeBlock } from '@/components/CodeBlock';
import { Book, CheckCircle } from 'lucide-react';

export default function GettingStarted() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <div className="flex items-center gap-3 mb-8">
        <Book className="w-10 h-10 text-blue-600" />
        <h1 className="mb-0">Getting Started</h1>
      </div>

      <p className="lead">
        Welcome to TypeScript ORM! This guide will help you get up and running in minutes.
      </p>

      <h2>What is TypeScript ORM?</h2>
      <p>
        TypeScript ORM is an enterprise-grade Object-Relational Mapping library that provides a unified API
        for working with multiple databases. It supports PostgreSQL, MySQL, SQLite, and MongoDB, allowing you
        to switch between databases without changing your code.
      </p>

      <h2>Key Features</h2>
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <span><strong>Multi-Database Support:</strong> PostgreSQL, MySQL, SQLite, MongoDB</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <span><strong>TypeScript First:</strong> Full type safety with decorators</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <span><strong>Connection Pooling:</strong> Automatic connection management</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <span><strong>Transactions:</strong> Full transaction support with commit/rollback</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <span><strong>SQL Injection Protection:</strong> Parameterized queries</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <span><strong>Error Handling & Logging:</strong> Comprehensive error management</span>
        </li>
      </ul>

      <h2>Prerequisites</h2>
      <p>Before you begin, ensure you have the following installed:</p>
      <ul>
        <li>Node.js 16.x or higher</li>
        <li>TypeScript 5.x or higher</li>
        <li>A supported database (PostgreSQL, MySQL, SQLite, or MongoDB)</li>
      </ul>

      <h2>Installation</h2>
      <p>Install TypeScript ORM using npm:</p>
      <CodeBlock
        code="npm install typescript-orm reflect-metadata"
        language="bash"
      />

      <p>Or using yarn:</p>
      <CodeBlock
        code="yarn add typescript-orm reflect-metadata"
        language="bash"
      />

      <h2>TypeScript Configuration</h2>
      <p>Update your <code>tsconfig.json</code> to enable decorators:</p>
      <CodeBlock
        code={`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true
  }
}`}
        language="json"
        filename="tsconfig.json"
      />

      <h2>Quick Example</h2>
      <p>Here's a simple example to get you started:</p>
      <CodeBlock
        code={`import 'reflect-metadata';
import { Connection, Entity, Column, BaseModel, ConsoleLogger } from 'typescript-orm';

// Define your model
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

// Connect to database
const connection = new Connection(
  'postgres',
  {
    host: 'localhost',
    port: 5432,
    database: 'mydb',
    user: 'postgres',
    password: 'password'
  },
  new ConsoleLogger()
);

await connection.connect();
BaseModel.setConnection(connection);

// Use it!
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

console.log('Created user:', user);

const allUsers = await User.findAll();
console.log('All users:', allUsers);

// Clean up
await connection.disconnect();`}
        language="typescript"
        filename="app.ts"
      />

      <h2>Next Steps</h2>
      <p>Now that you have TypeScript ORM installed, explore these topics:</p>
      <ul>
        <li><a href="/orm/docs/installation">Installation Guide</a> - Detailed installation instructions</li>
        <li><a href="/orm/docs/quick-start">Quick Start</a> - Complete tutorial</li>
        <li><a href="/orm/docs/models">Models & Decorators</a> - Learn about defining models</li>
        <li><a href="/orm/docs/connections">Database Connections</a> - Configure your database</li>
        <li><a href="/orm/docs/examples">Examples</a> - See real-world examples</li>
      </ul>

      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="mt-0 text-blue-900 dark:text-blue-100">Need Help?</h3>
        <p className="mb-0 text-blue-800 dark:text-blue-200">
          If you run into any issues, check out our{' '}
          <a href="https://github.com/yourusername/typescript-orm/issues" className="text-blue-600 dark:text-blue-400 hover:underline">
            GitHub Issues
          </a>{' '}
          or join our community discussions.
        </p>
      </div>
    </div>
  );
}
