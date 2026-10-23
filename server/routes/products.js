import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

const columns = `
    id, 
    category, 
    title, 
    description AS text, 
    price::float8 AS price, 
    features
`;

// GET /api/products           -> all products
// GET /api/products?category=facility (or service or membership)
router.get("/", async (req, res, next) => {
  try {
    const { category } = req.query;
    const { rows } = category
      ? await pool.query(
          `SELECT ${columns} FROM products WHERE category = $1 ORDER BY id`,
          [category],
        )
      : await pool.query(
          `SELECT ${columns} FROM products ORDER BY category, id`,
        );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/gyms (for example)
router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${columns} FROM products WHERE id = $1`,
      [req.params.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
