import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { body, validationResult } from 'express-validator';
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

// Create short URL
app.post('/shorten', 
  body('url').isURL(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url } = req.body;
    const shortCode = nanoid(7); // Generate a 7-character unique code

    try {
      await pool.query(
        'INSERT INTO urls (original_url, short_code) VALUES ($1, $2)',
        [url, shortCode]
      );

      res.json({ 
        shortUrl: `${process.env.BASE_URL}/${shortCode}`,
        originalUrl: url
      });
    } catch (error) {
      console.error('Error creating short URL:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Redirect to original URL
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const result = await pool.query(
      'SELECT original_url FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length > 0) {
      res.redirect(result.rows[0].original_url);
    } else {
      res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

