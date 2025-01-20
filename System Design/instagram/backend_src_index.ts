import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
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
app.use('/uploads', express.static('uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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
        res.json({ token });
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

// Create a post
app.post('/posts', authenticateToken, upload.single('image'), async (req: any, res) => {
  const { caption } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const result = await pool.query(
      'INSERT INTO posts (user_id, image_url, caption) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, imageUrl, caption]
    );
    res.json({ id: result.rows[0].id, imageUrl, caption });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get posts for feed
app.get('/feed', authenticateToken, async (req: any, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.username, 
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 10`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Like a post
app.post('/posts/:id/like', authenticateToken, async (req: any, res) => {
  const postId = req.params.id;
  try {
    await pool.query(
      'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, postId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Comment on a post
app.post('/posts/:id/comment', authenticateToken, async (req: any, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, postId, content]
    );
    res.json({ id: result.rows[0].id, content });
  } catch (error) {
    console.error('Error commenting on post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

