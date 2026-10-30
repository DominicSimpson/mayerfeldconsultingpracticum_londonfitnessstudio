import { Router } from "express";
import Stripe from "stripe";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {
    createPendingOrder,
    OrderValidationError,
} from "../services/orderService.js";

const router = Router();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE SECRET KEY is not configured");
}

if (!process.env.APP_URL) {
    throw new Error("APP_URL is not configured");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const appUrl = new URL(process.env.APP_URL).origin;

// POST /api/checkout/create-session
router.post("/create-session", requireAuth, async (req, res, next) => {
    try {
    // Create an order with pending_payment status
    const { orderId, totalPence, lineItems } = await createPendingOrder({
        userId: req.session.userId,
        customer: req.body?.customer,
        items: req.body?.items,
    });

    // Create a Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,

        client_reference_id: String(orderId),

        metadata: {
            orderId: String(orderId),
            userId: String(req.session.userId),
        },

        success_url:
            `${appUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${appUrl}/?payment=cancelled`,
    });

    // Associate the Stripe session with the pending order
    const result = await pool.query(
        `
        UPDATE orders
        SET stripe_checkout_session_id = $1
        WHERE id = $2
            AND user_id = $3
            AND payment_status = 'pending_payment'
        RETURNING id
        `,
        [checkoutSession.id, orderId, req.session.userId]
    );

    if (result.rowCount !== 1) {
      throw new Error("Failed to associate checkout session with order");
    }

        // Send the Stripe URL back to React
        return res.json({
            url: checkoutSession.url,
            orderId,
            totalPence,
        });
    } catch (error) {
        if (error instanceof OrderValidationError) {
            return res.status(400).json({
                error: error.message,
            });
        }

        next(error);
    }
});

export default router;