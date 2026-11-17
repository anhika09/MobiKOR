require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
app.use(express.static('.'));          

const db = mysql.createPool({
  host: process.env.DB_HOST, user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, database: process.env.DB_NAME
});

app.get('/api/products', async (req, res) => {
  const [rows] = await db.query(
    'SELECT id_product, name_product, brand, price, stock_qty FROM product WHERE is_active = 1');
  res.json(rows);
});

app.listen(3000, () => console.log('http://localhost:3000'));