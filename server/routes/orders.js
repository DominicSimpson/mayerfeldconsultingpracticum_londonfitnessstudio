import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// Retrieve orders belonging to the signed-in user:
router.get("/my-orders", requireAuth, async (req, res, next) => {
  // Only authenticated users can access their order history
  const userId = req.session.userId;

  try {
    const { rows } = await pool.query(
      `
      SELECT
        o.id,
        o.created_at,
        o.total_price,
        o.payment_status,
        COALESCE(
          json_agg(
            json_build_object(
              'productId', oi.product_id,
              'productName', p.title,
              'quantity', oi.quantity,
              'unitPrice', oi.unit_price,
              'date', oi.date,
              'hour', oi.hour
            )
            ORDER BY oi.id
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) AS items 
      FROM orders o
      LEFT JOIN order_items oi
        ON oi.order_id = o.id
      LEFT JOIN products p
        ON p.id = oi.product_id
      WHERE o.user_id = $1
      GROUP BY o.id, o.created_at, o.total_price, o.payment_status
      ORDER BY o.created_at DESC, o.id DESC 
      `,
      [userId],
    );

    res.json({ orders: rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/checkout-session/:sessionId
router.get(
  "/checkout-session/:sessionId",
  requireAuth,
  
  async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const userId = req.session.userId;

      if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
        return res.status(400).json({
          error: "Invalid Checkout Session ID",
        });
      }

      const { rows } = await pool.query(
          `
          SELECT
            id,
            total_price,
            payment_status,
            created_at
          FROM orders
          WHERE stripe_checkout_session_id = $1
            AND user_id = $2
          LIMIT 1
          `,
        [sessionId, userId],
      );

      if (rows.length === 0) {
        return res.status(404).json({
          error: "Order not found",
        });
      }

      return res.json({
        order: rows[0],
      });
    } catch (error) {
      next (error);
    }
  },
);

router.post("/", requireAuth, (req, res) => {
  res.status(410).json({
    error:
      "Direct order creation is no longer supported. Please use Stripe Checkout.",
  });
});

export default router;
