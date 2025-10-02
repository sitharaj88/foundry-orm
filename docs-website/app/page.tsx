import Link from 'next/link';
import { Database, Zap, Shield, Code2, Layers, GitBranch } from 'lucide-react';
import { CodeBlock } from '@/components/CodeBlock';

const quickStartCode = `import { Connection, Entity, Column, BaseModel } from 'foundry-orm';

// Define your model
@Entity('users')
class User extends BaseModel {
  @Column('id')
  id!: number;

  @Column('name')
  name!: string;

  @Column('email')
  email!: string;
}

// Connect to database
const connection = new Connection('postgres', {
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'postgres',
  password: 'password'
});

await connection.connect();
BaseModel.setConnection(connection);

// Use it!
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com'
});

const allUsers = await User.findAll();`;

const features = [
  {
    icon: Database,
    title: 'Multi-Database Support',
    description: 'Works seamlessly with PostgreSQL, MySQL, SQLite, and MongoDB. One API for all databases.',
  },
  {
    icon: Zap,
    title: 'Connection Pooling',
    description: 'Built-in connection pooling for optimal performance and resource management.',
  },
  {
    icon: Shield,
    title: 'SQL Injection Protection',
    description: 'Parameterized queries protect your application from SQL injection attacks.',
  },
  {
    icon: Code2,
    title: 'TypeScript First',
    description: 'Full TypeScript support with decorators, type safety, and IntelliSense.',
  },
  {
    icon: Layers,
    title: 'Transaction Support',
    description: 'Complete transaction management with automatic commit and rollback.',
  },
  {
    icon: GitBranch,
    title: 'Flexible Query Builder',
    description: 'Intuitive fluent API for building complex queries with ease.',
  },
];

const databases = [
  { name: 'PostgreSQL', color: 'text-blue-600' },
  { name: 'MySQL', color: 'text-orange-600' },
  { name: 'SQLite', color: 'text-cyan-600' },
  { name: 'MongoDB', color: 'text-green-600' },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            FoundryORM
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 dark:text-gray-300 px-4">
            A powerful, enterprise-grade ORM for TypeScript and Node.js. Support for PostgreSQL, MySQL, SQLite, and MongoDB with connection pooling, transactions, and type safety.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/docs/getting-started"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/docs/examples"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              View Examples <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Everything you need for enterprise applications
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 dark:text-gray-300">
              Built for scale with connection pooling, transaction support, and type safety.
            </p>
          </div>
          <div className="mx-auto mt-12 sm:mt-16 lg:mt-24 max-w-2xl lg:max-w-none">
            <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                    <feature.icon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Databases Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Multi-Database Support
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 dark:text-gray-300">
              One API, multiple databases. Choose what fits your project.
            </p>
          </div>
          <div className="mx-auto mt-12 sm:mt-16 lg:mt-24 max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
              {databases.map((db, index) => (
                <div key={index} className="flex items-center justify-center p-4">
                  <span className={`text-xl sm:text-2xl font-bold ${db.color} dark:opacity-90`}>{db.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start">
            <div className="lg:pr-4 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Get started in minutes
                </h2>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 dark:text-gray-300">
                  Simple setup with decorators and type safety. No complex configurations required.
                </p>
                <dl className="mt-8 sm:mt-10 space-y-6 sm:space-y-8 text-sm sm:text-base leading-6 sm:leading-7 text-gray-600 dark:text-gray-300 lg:max-w-none">
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-gray-100">
                      <Code2 className="absolute left-1 top-1 h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      Define models with decorators.
                    </dt>
                    <dd className="inline ml-2">Use @Entity and @Column decorators for type-safe database mapping.</dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-gray-100">
                      <Database className="absolute left-1 top-1 h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      Connect to any database.
                    </dt>
                    <dd className="inline ml-2">PostgreSQL, MySQL, SQLite, or MongoDB - your choice.</dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-gray-100">
                      <Zap className="absolute left-1 top-1 h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      Start querying immediately.
                    </dt>
                    <dd className="inline ml-2">Built-in CRUD operations with transaction support.</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="lg:pl-4 w-full">
              <div className="w-full overflow-x-hidden">
                <CodeBlock code={quickStartCode} language="typescript" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}