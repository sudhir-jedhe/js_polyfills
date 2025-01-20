import express from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import winston from 'winston';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, param, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import promClient from 'prom-client';
import responseTime from 'response-time';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';

dotenv.config();

const app = express();
const port = config.get('port');

// Redis setup
const RedisStore = connectRedis(session);
const redisClient = new Redis(config.get('redisUrl'));

// Session middleware
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: config.get('sessionSecret'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.get('env') === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
});

// Enhanced logging
const logger = winston.createLogger({
  level: config.get('logLevel'),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Database connection
const pool = new Pool({
  connectionString: config.get('databaseUrl'),
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: config.get('frontendUrl'),
  optionsSuccessStatus: 200,
  credentials: true,
}));
app.use(helmet());
app.use(rateLimit({
  windowMs: config.get('rateLimitWindow'),
  max: config.get('rateLimitMax')
}));

// Response time metrics
app.use(responseTime((req, res, time) => {
  if (req?.route?.path) {
    httpRequestDurationMicroseconds
      .labels(req.method, req.route.path, res.statusCode.toString())
      .observe(time);
  }
}));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Authentication required' });

  jwt.verify(token, config.get('jwtSecret') as string, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Authorization middleware
const authorize = (roles: string[]) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };
};

// Input validation
const validateTask = [
  body('title').trim().isLength({ min: 1, max: 100 }).escape(),
  body('description').trim().isLength({ max: 500 }).escape(),
];

// Caching middleware
const cache = (duration: number) => (req, res, next) => {
  const key = `__express__${req.originalUrl || req.url}`;
  redisClient.get(key, (err, cachedBody) => {
    if (err) {
      logger.error('Redis error:', err);
      return next();
    }
    if (cachedBody) {
      return res.send(JSON.parse(cachedBody));
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        redisClient.set(key, JSON.stringify(body), 'EX', duration);
        res.sendResponse(body);
      };
      next();
    }
  });
};

// Routes
app.post('/register', 
  body('username').isLength({ min: 5 }),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['user', 'admin']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id',
        [req.body.username, hashedPassword, req.body.role]
      );
      res.status(201).json({ message: 'User created successfully', userId: result.rows[0].id });
    } catch (err) {
      logger.error('Error registering user', err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [req.body.username]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }
    if (await bcrypt.compare(req.body.password, user.rows[0].password)) {
      const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, config.get('jwtSecret') as string, { expiresIn: '1h' });
      req.session.userId = user.rows[0].id;
      res.json({ token, role: user.rows[0].role });
    } else {
      res.status(400).json({ error: 'Invalid password' });
    }
  } catch (err) {
    logger.error('Error logging in', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error('Error logging out', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/tasks', authenticateToken, cache(300), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    logger.error('Error fetching tasks', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/tasks', authenticateToken, validateTask, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, req.user.id]
    );
    // Invalidate cache
    const cacheKey = `__express__/tasks`;
    await redisClient.del(cacheKey);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error('Error creating task', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/tasks/:id', authenticateToken, param('id').isInt(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    logger.error('Error fetching task', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/tasks/:id', authenticateToken, param('id').isInt(), validateTask, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, description, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    // Invalidate cache
    const cacheKey = `__express__/tasks`;
    await redisClient.del(cacheKey);
    res.json(result.rows[0]);
  } catch (err) {
    logger.error('Error updating task', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/tasks/:id', authenticateToken, param('id').isInt(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    // Invalidate cache
    const cacheKey = `__express__/tasks`;
    await redisClient.del(cacheKey);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    logger.error('Error deleting task', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin routes
app.get('/admin/users', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role FROM users');
    res.json(result.rows);
  } catch (err) {
    logger.error('Error fetching users', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/admin/tasks', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const result = await pool.query('SELECT tasks.*, users.username FROM tasks JOIN users ON tasks.user_id = users.id');
    res.json(result.rows);
  } catch (err) {
    logger.error('Error fetching all tasks', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  redisClient.quit();
  pool.end(() => {
    logger.info('Database pool has ended');
    process.exit(0);
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

