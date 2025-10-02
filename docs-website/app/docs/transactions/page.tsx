import { CodeBlock } from '@/components/CodeBlock';

export default function TransactionsPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1>Transactions</h1>
      <p className="lead">
        Ensure data consistency with ACID-compliant transactions that automatically commit or rollback.
      </p>

      <h2>What are Transactions?</h2>
      <p>
        Transactions are a way to group multiple database operations into a single unit of work. 
        Either all operations succeed (commit), or all fail (rollback), ensuring data consistency.
      </p>

      <h2>Basic Transaction</h2>
      <p>
        Use the adapter's transaction methods to execute queries within a transaction:
      </p>

      <CodeBlock language="typescript">
{`import connection from './db/connection';

const adapter = connection.getAdapter();

try {
  // Begin transaction
  await adapter.beginTransaction();

  // Perform multiple operations
  await adapter.query('INSERT INTO users (name, email) VALUES (?, ?)', 
    ['John Doe', 'john@example.com']
  );
  
  await adapter.query('UPDATE accounts SET balance = balance - 100 WHERE user_id = ?',
    [1]
  );

  await adapter.query('UPDATE accounts SET balance = balance + 100 WHERE user_id = ?',
    [2]
  );

  // Commit if all operations succeed
  await adapter.commit();
  console.log('Transaction completed successfully');
  
} catch (error) {
  // Rollback if any operation fails
  await adapter.rollback();
  console.error('Transaction failed:', error);
  throw error;
}`}
      </CodeBlock>

      <h2>Using with Models</h2>
      <p>
        Combine transactions with your model operations:
      </p>

      <CodeBlock language="typescript">
{`import { User } from './models/User';
import connection from './db/connection';

async function transferCredits(fromUserId: number, toUserId: number, amount: number) {
  const adapter = connection.getAdapter();

  try {
    await adapter.beginTransaction();

    // Get both users
    const fromUser = await User.find(fromUserId);
    const toUser = await User.find(toUserId);

    if (!fromUser || !toUser) {
      throw new Error('User not found');
    }

    if (fromUser.credits < amount) {
      throw new Error('Insufficient credits');
    }

    // Update credits
    fromUser.credits -= amount;
    toUser.credits += amount;

    // Save both users
    await fromUser.save();
    await toUser.save();

    // Commit transaction
    await adapter.commit();
    
    return { success: true, message: 'Transfer completed' };
    
  } catch (error) {
    await adapter.rollback();
    return { success: false, message: error.message };
  }
}`}
      </CodeBlock>

      <h2>Transaction Patterns</h2>

      <h3>Try-Catch-Finally Pattern</h3>
      <CodeBlock language="typescript">
{`async function performComplexOperation() {
  const adapter = connection.getAdapter();
  let transactionStarted = false;

  try {
    await adapter.beginTransaction();
    transactionStarted = true;

    // Your operations here
    await adapter.query('INSERT INTO orders (user_id, total) VALUES (?, ?)', [1, 100]);
    await adapter.query('UPDATE inventory SET stock = stock - 1 WHERE product_id = ?', [5]);

    await adapter.commit();
    return { success: true };
    
  } catch (error) {
    if (transactionStarted) {
      await adapter.rollback();
    }
    console.error('Transaction error:', error);
    return { success: false, error: error.message };
  }
}`}
      </CodeBlock>

      <h3>Helper Function Pattern</h3>
      <CodeBlock language="typescript" filename="utils/transaction.ts">
{`export async function withTransaction<T>(
  adapter: any,
  callback: () => Promise<T>
): Promise<T> {
  try {
    await adapter.beginTransaction();
    const result = await callback();
    await adapter.commit();
    return result;
  } catch (error) {
    await adapter.rollback();
    throw error;
  }
}

// Usage
import { withTransaction } from './utils/transaction';

const result = await withTransaction(adapter, async () => {
  await adapter.query('INSERT INTO ...', []);
  await adapter.query('UPDATE ...', []);
  return { completed: true };
});`}
      </CodeBlock>

      <h2>Real-World Examples</h2>

      <h3>E-commerce Order Processing</h3>
      <CodeBlock language="typescript" filename="services/orderService.ts">
{`import connection from '../db/connection';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';

export async function createOrder(
  userId: number,
  items: Array<{ productId: number; quantity: number }>
) {
  const adapter = connection.getAdapter();

  try {
    await adapter.beginTransaction();

    // Calculate total and validate stock
    let total = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await Product.find(item.productId);
      
      if (!product) {
        throw new Error(\`Product \${item.productId} not found\`);
      }

      if (product.stock < item.quantity) {
        throw new Error(\`Insufficient stock for \${product.name}\`);
      }

      total += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      userId,
      total,
      status: 'pending',
      createdAt: new Date()
    });

    // Create order items
    for (const item of orderItems) {
      await adapter.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order.id, item.productId, item.quantity, item.price]
      );
    }

    // Commit transaction
    await adapter.commit();

    return { success: true, orderId: order.id };

  } catch (error) {
    await adapter.rollback();
    console.error('Order creation failed:', error);
    return { success: false, error: error.message };
  }
}`}
      </CodeBlock>

      <h3>Bank Transfer</h3>
      <CodeBlock language="typescript" filename="services/bankService.ts">
{`export async function transferMoney(
  fromAccountId: number,
  toAccountId: number,
  amount: number
) {
  const adapter = connection.getAdapter();

  try {
    await adapter.beginTransaction();

    // Lock accounts for update (prevent concurrent modifications)
    const fromAccount = await adapter.query(
      'SELECT * FROM accounts WHERE id = ? FOR UPDATE',
      [fromAccountId]
    );

    const toAccount = await adapter.query(
      'SELECT * FROM accounts WHERE id = ? FOR UPDATE',
      [toAccountId]
    );

    if (!fromAccount[0] || !toAccount[0]) {
      throw new Error('Account not found');
    }

    if (fromAccount[0].balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Debit from source account
    await adapter.query(
      'UPDATE accounts SET balance = balance - ? WHERE id = ?',
      [amount, fromAccountId]
    );

    // Credit to destination account
    await adapter.query(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [amount, toAccountId]
    );

    // Record transaction
    await adapter.query(
      \`INSERT INTO transactions 
       (from_account_id, to_account_id, amount, type, created_at) 
       VALUES (?, ?, ?, 'transfer', NOW())\`,
      [fromAccountId, toAccountId, amount]
    );

    await adapter.commit();

    return { 
      success: true, 
      message: \`Transferred $\${amount} successfully\` 
    };

  } catch (error) {
    await adapter.rollback();
    return { 
      success: false, 
      message: error.message 
    };
  }
}`}
      </CodeBlock>

      <h3>User Registration with Profile</h3>
      <CodeBlock language="typescript" filename="services/authService.ts">
{`export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
  };
}) {
  const adapter = connection.getAdapter();

  try {
    await adapter.beginTransaction();

    // Check if user already exists
    const existing = await adapter.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [userData.email, userData.username]
    );

    if (existing.length > 0) {
      throw new Error('User already exists');
    }

    // Create user
    const userResult = await adapter.query(
      'INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, NOW())',
      [userData.username, userData.email, userData.password]
    );

    const userId = userResult.insertId || userResult.lastID;

    // Create user profile
    await adapter.query(
      \`INSERT INTO user_profiles 
       (user_id, first_name, last_name, date_of_birth) 
       VALUES (?, ?, ?, ?)\`,
      [userId, userData.profile.firstName, userData.profile.lastName, userData.profile.dateOfBirth]
    );

    // Create default settings
    await adapter.query(
      'INSERT INTO user_settings (user_id, theme, notifications) VALUES (?, ?, ?)',
      [userId, 'light', true]
    );

    await adapter.commit();

    return { success: true, userId };

  } catch (error) {
    await adapter.rollback();
    return { success: false, error: error.message };
  }
}`}
      </CodeBlock>

      <h2>Transaction Isolation Levels</h2>
      <p>
        Different databases support different isolation levels. Check your database documentation:
      </p>

      <CodeBlock language="typescript">
{`// PostgreSQL example
await adapter.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
await adapter.beginTransaction();

// Your queries here...

await adapter.commit();`}
      </CodeBlock>

      <h2>Nested Transactions (Savepoints)</h2>
      <p>
        Some databases support savepoints for nested transactions:
      </p>

      <CodeBlock language="typescript">
{`try {
  await adapter.beginTransaction();

  // First operation
  await adapter.query('INSERT INTO table1 ...');

  // Create savepoint
  await adapter.query('SAVEPOINT sp1');

  try {
    // Second operation
    await adapter.query('INSERT INTO table2 ...');
  } catch (error) {
    // Rollback to savepoint
    await adapter.query('ROLLBACK TO SAVEPOINT sp1');
  }

  // Continue with transaction
  await adapter.query('INSERT INTO table3 ...');

  await adapter.commit();
} catch (error) {
  await adapter.rollback();
}`}
      </CodeBlock>

      <h2>Best Practices</h2>

      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 my-6">
        <p className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
          ✓ Do's
        </p>
        <ul className="text-sm text-green-800 dark:text-green-300 m-0 space-y-1">
          <li>Keep transactions as short as possible</li>
          <li>Always use try-catch to handle errors</li>
          <li>Always rollback on errors</li>
          <li>Validate data before starting transaction</li>
          <li>Use transactions for operations that must be atomic</li>
          <li>Log transaction failures for debugging</li>
        </ul>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 my-6">
        <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">
          ✗ Don'ts
        </p>
        <ul className="text-sm text-red-800 dark:text-red-300 m-0 space-y-1">
          <li>Don't forget to commit or rollback</li>
          <li>Don't perform slow operations inside transactions</li>
          <li>Don't make external API calls within transactions</li>
          <li>Don't hold transactions open longer than necessary</li>
          <li>Don't nest transactions without savepoint support</li>
        </ul>
      </div>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <a href="/foundry-orm/docs/error-handling">Learn about error handling</a>
        </li>
        <li>
          <a href="/foundry-orm/docs/logging">Add logging to track transactions</a>
        </li>
        <li>
          <a href="/foundry-orm/docs/examples">See more transaction examples</a>
        </li>
      </ul>
    </div>
  );
}
