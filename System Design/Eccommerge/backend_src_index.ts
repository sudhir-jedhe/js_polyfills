import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );
    res.json({ id: result.rows[0].id, username });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET as string);
        res.json({ token, user: { id: user.id, username: user.username } });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single product
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add to cart
app.post('/cart', authenticateToken, async (req: any, res) => {
  const { productId, quantity } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart_items.quantity + $3 RETURNING *',
      [req.user.id, productId, quantity]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get cart items
app.get('/cart', authenticateToken, async (req: any, res) => {
  try {
    const result = await pool.query(
      'SELECT ci.*, p.name, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create order
app.post('/orders', authenticateToken, async (req: any, res) => {
  const { address, city, country, postalCode } = req.body;
  try {
    await pool.query('BEGIN');
    
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, address, city, country, postal_code) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [req.user.id, address, city, country, postalCode]
    );
    const orderId = orderResult.rows[0].id;

    const cartItems = await pool.query('SELECT * FROM cart_items WHERE user_id = $1', [req.user.id]);
    
    for (const item of cartItems.rows) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.product_id, item.quantity]
      );
    }

    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);

    await pool.query('COMMIT');

    res.json({ orderId });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

