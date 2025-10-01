import 'reflect-metadata';
import express, { Request, Response } from 'express';
// Import from the built dist directory
const { Connection, Entity, Column, BaseModel, ConsoleLogger } = require('../../dist/index');

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
  age!: number;
}

// Initialize Express app
const app = express();
app.use(express.json());

// Database connection
const connection = new Connection('sqlite', { 
  filename: './example.db' 
}, new ConsoleLogger());

// Initialize database
async function initDatabase() {
  await connection.connect();
  BaseModel.setConnection(connection);

  // Create table if not exists
  const adapter = connection.getAdapter();
  await adapter.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age INTEGER
    )
  `);
  
  console.log('✅ Database initialized successfully');
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
