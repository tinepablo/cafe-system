const express       = require('express');
const mysql         = require('mysql2');
const cors          = require('cors');
const productRoutes = require('./routes/products');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create ONE database connection for the whole app
const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('MySQL connected');
});

// Make db available to all routes via req.db
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/products', productRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Cafe system API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log('Server running on port ' + PORT)
);