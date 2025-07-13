import express from 'express';
import pkg from 'pg';
import cors from 'cors';

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// เชื่อมต่อ DB (ใช้ env หรือค่าตรง)
const pool = new Pool({
  user: process.env.DB_USER || 'chon_user',
  host: process.env.DB_HOST || 'dpg-d1ot8dripnbc73fdgpm0-a.oregon-postgres.render.com',
  database: process.env.DB_NAME || 'chon',
  password: process.env.DB_PASS || 'TziMT8u5AJ5pIU1mNHuhy5V4H8HTny9B',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  res.send('✅ Backend OK - Render Web Service');
});

app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('เกิดข้อผิดพลาด');
  }
});

app.post('/items', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('INSERT INTO items (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('เกิดข้อผิดพลาด');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
