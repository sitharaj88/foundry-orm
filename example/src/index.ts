import 'reflect-metadata';
import express, { Request, Response } from 'express';
// Import from the built dist directory
const {
  Connection,
  Entity,
  Column,
  BaseModel,
  ConsoleLogger,
  Repository,
  HasMany,
  BelongsTo
} = require('../../dist/index');

// Define User model with relationship
@Entity('users')
class User extends BaseModel {
  @Column({ primary: true, autoIncrement: true })
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  age!: number;

  @HasMany(() => Post, 'userId')
  posts!: Post[];
}

// Define Post model with relationship
@Entity('posts')
class Post extends BaseModel {
  @Column({ primary: true, autoIncrement: true })
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  userId!: number;

  @BelongsTo(() => User, 'userId')
  user!: User;
}

// Initialize Express app
const app = express();
app.use(express.json());

// Database connection
const connection = new Connection('sqlite', {
  filename: './example.db'
}, new ConsoleLogger());

// Create repositories (new in v0.2.0!)
let userRepo: typeof Repository;
let postRepo: typeof Repository;

// Initialize database
async function initDatabase() {
  await connection.connect();
  BaseModel.setConnection(connection, 'sqlite');

  // Initialize repositories
  userRepo = new Repository(User, connection, 'sqlite');
  postRepo = new Repository(Post, connection, 'sqlite');

  // Create tables if not exists
  const adapter = connection.getAdapter();
  await adapter.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age INTEGER
    )
  `);

  await adapter.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      userId INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  console.log('✅ Database initialized successfully');
  console.log('📦 Using FoundryORM v0.2.0 with Repository pattern');
}

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to TypeScript ORM Example API',
    endpoints: {
      'GET /users': 'Get all users',
      'GET /users/:id': 'Get user by ID',
      'POST /users': 'Create a new user',
      'PUT /users/:id': 'Update a user',
      'DELETE /users/:id': 'Delete a user',
      'GET /health': 'Database health check'
    }
  });
});

// Health check
app.get('/health', async (req: Request, res: Response) => {
  try {
    const healthy = await connection.healthCheck();
    res.json({ status: healthy ? 'healthy' : 'unhealthy', database: 'sqlite' });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Get all users
app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json({ success: true, data: users, count: users.length });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Get user by ID
app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.find(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Create user
app.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const user = await User.create({ name, email, age: age || 0 });
    res.status(201).json({ success: true, data: user, message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Update user
app.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.find(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { name, email, age } = req.body;
    Object.assign(user, { name, email, age });
    await user.save();

    res.json({ success: true, data: user, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Delete user
app.delete('/users/:id', async (req: Request, res: Response) => {
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
const PORT = process.env.PORT || 3000;

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 API documentation: http://localhost:${PORT}/`);
  });
}).catch((error) => {
  console.error('❌ Failed to initialize database:', error);
  process.exit(1);
});
