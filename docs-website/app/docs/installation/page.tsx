import { CodeBlock } from '@/components/CodeBlock';

export default function InstallationPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1>Installation</h1>
      <p className="lead">
        Get started with TypeScript ORM by installing the package and its database drivers.
      </p>

      <h2>Prerequisites</h2>
      <p>Before installing TypeScript ORM, ensure you have:</p>
      <ul>
        <li>Node.js 16.x or higher</li>
        <li>TypeScript 5.0 or higher</li>
        <li>npm, yarn, or pnpm package manager</li>
      </ul>

      <h2>Install the Core Package</h2>
      <p>Install the TypeScript ORM package using your preferred package manager:</p>

      <h3>Using npm</h3>
      <CodeBlock language="bash">
        npm install typescript-orm
      </CodeBlock>

      <h3>Using yarn</h3>
      <CodeBlock language="bash">
        yarn add typescript-orm
      </CodeBlock>

      <h3>Using pnpm</h3>
      <CodeBlock language="bash">
        pnpm add typescript-orm
      </CodeBlock>

      <h2>Install Database Drivers</h2>
      <p>
        TypeScript ORM supports multiple databases. Install the driver for your database:
      </p>

      <h3>PostgreSQL</h3>
      <CodeBlock language="bash">
        npm install pg @types/pg
      </CodeBlock>

      <h3>MySQL</h3>
      <CodeBlock language="bash">
        npm install mysql2
      </CodeBlock>

      <h3>SQLite</h3>
      <CodeBlock language="bash">
        npm install sqlite3 @types/sqlite3
      </CodeBlock>

      <h3>MongoDB</h3>
      <CodeBlock language="bash">
        npm install mongodb
      </CodeBlock>

      <h2>TypeScript Configuration</h2>
      <p>
        TypeScript ORM uses decorators, which require specific compiler options. Update your{' '}
        <code>tsconfig.json</code>:
      </p>

      <CodeBlock language="json" filename="tsconfig.json">
{`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`}
      </CodeBlock>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-6">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Important
        </p>
        <p className="text-sm text-blue-800 dark:text-blue-300 m-0">
          The <code>experimentalDecorators</code> and <code>emitDecoratorMetadata</code> options
          are required for the ORM decorators to work properly.
        </p>
      </div>

      <h2>Verify Installation</h2>
      <p>Create a simple test file to verify the installation:</p>

      <CodeBlock language="typescript" filename="test.ts">
{`import { Connection, Entity, Column, BaseModel } from 'typescript-orm';

@Entity('users')
class User extends BaseModel {
  @Column('id')
  id!: number;

  @Column('name')
  name!: string;
}

console.log('TypeScript ORM installed successfully!');`}
      </CodeBlock>

      <p>Compile and run the test:</p>
      <CodeBlock language="bash">
{`npx tsc test.ts
node test.js`}
      </CodeBlock>

      <h2>Next Steps</h2>
      <p>Now that you have TypeScript ORM installed, you can:</p>
      <ul>
        <li>
          <a href="/docs/quick-start">Follow the Quick Start guide</a>
        </li>
        <li>
          <a href="/docs/models">Learn about Models and Decorators</a>
        </li>
        <li>
          <a href="/docs/connections">Configure database connections</a>
        </li>
        <li>
          <a href="/docs/examples">Explore examples</a>
        </li>
      </ul>
    </div>
  );
}
