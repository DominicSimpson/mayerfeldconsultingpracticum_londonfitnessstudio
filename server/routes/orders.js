import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

const requiredFields = [
  "firstName",
  "surname",
  "firstLineAddress",
  "city",
  "county",
  "postcode",
  "country",
  "email",
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

router.post("/", async (req, res, next) => {
  const { customer, items } = req.body ?? {};

  // Validate the request //
  if (!customer || typeof customer !== "object") {
    return res.status(400).json({ error: "Missing customer details" });
  }

  for (const field of requiredFields) {
    if (typeof customer[field] !== "string" || customer[field].trim() === "") {
      return res.status(400).json({ error: `Missing field: ${field}` });
    }
  }

  if (!/^\S+@\S+\.\S+$/.test(customer.email.trim())) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return res.status(400).json({ error: "Cart is empty or too large" });
  }

  for (const item of items) {
    if (typeof item.id !== "string") {
      return res.status(400).json({ error: "Invalid item" });
    }

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 20
    ) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    if (
      item.date != null &&
      (typeof item.date !== "string" || !DATE_RE.test(item.date))
    ) {
      return res.status(400).json({ error: "Invalid booking date" });
    }
  }

  let client;
  try {
    client = await pool.connect();

    // Look up real prices from the database
    const ids = [...new Set(items.map((i) => i.id))];
    const { rows: products } = await client.query(
      "SELECT id, category, price FROM products WHERE id = ANY($1)",
      [ids],
    );
    const byId = new Map(products.map((p) => [p.id, p]));

    let totalPence = 0;
    const lines = [];
    for (const item of items) {
      const product = byId.get(item.id);
      if (!product) {
        return res.status(400).json({ error: `Unknown product: ${item.id}` });
      }
      // Facilities and services are bookings, so they need a date and hour
      if (product.category !== "membership" && (!item.date || !item.hour)) {
        return res
          .status(400)
          .json({ error: `Missing booking time for ${item.id}` });
      }
      const unitPence = Math.round(Number(product.price) * 100);
      totalPence += unitPence * item.quantity;
      lines.push({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: (unitPence / 100).toFixed(2),
        date: item.date ?? null,
        hour: item.hour ?? null,
      });
    }
    // ---- Save everything or nothing ----
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO orders
        (user_id, first_name, surname, first_line_address, 
        second_line_address, city, county, postcode, 
        country, email, total_price)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id`,
      [
        req.session.userId ?? null,
        customer.firstName.trim(),
        customer.surname.trim(),
        customer.firstLineAddress.trim(),
        customer.secondLineAddress?.trim() ?? null,
        customer.city.trim(),
        customer.county.trim(),
        customer.postcode.trim(),
        customer.country.trim(),
        customer.email.trim(),
        (totalPence / 100).toFixed(2),
      ],
    );
    const orderId = rows[0].id;

    for (const l of lines) {
      await client.query(
        `INSERT INTO order_items
            (order_id, product_id, quantity, unit_price, date, hour)
            VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, l.productId, l.quantity, l.unitPrice, l.date, l.hour],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      orderId,
      total: totalPence / 100,
    });
  } catch (err) {
    if (client) {
      await client.query("ROLLBACK").catch(() => {});
    }

    next(err);
  } finally {
    client?.release();
  }
});

export default router;
