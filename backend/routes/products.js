const express = require("express");
const router = express.Router();

// db is passed in from server.js — no separate connection needed here
// We use a middleware pattern so one connection serves all routes

// GET /products — all available menu items
router.get("/", (req, res) => {
  const sql = `
    SELECT
      id,
      name,
      description,
      price,
      category,
      image_url,
      is_available
    FROM products
    WHERE is_available = 1
    ORDER BY category, name
  `;

  req.db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Failed to fetch products" });
    }
    res.json(results);
  });
});

// GET /products/categories — distinct category list for filter tabs
router.get("/categories", (req, res) => {
  const sql = `
    SELECT DISTINCT category
    FROM products
    WHERE is_available = 1
    ORDER BY category
  `;

  req.db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
    res.json(results.map((r) => r.category));
  });
});

module.exports = router;
