import { Router } from "express";
import Stripe from "stripe";
import {pool} from "../db/pool.js";

const router = Router();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res, next) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Stripe webhook signature verification failed:", error.message);

        return res.status(400).json({
            error: "Invalid webhook signature",
    });
}

try {
    if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded"
    ) {
        const checkoutSession = event.data.object;

        // Only confirm an order after successful payment
        if (checkoutSession.payment_status === "paid") {
            const orderId = Number(checkoutSession.metadata?.orderId);

            if (!Number.isSafeInteger(orderId) || orderId < 0) {
                throw new Error("Invalid order ID in Stripe webhook");
            }

            if (
                checkoutSession.currency !== "gbp" ||
                !Number.isSafeInteger(checkoutSession.amount_total)
            ) {
                throw new Error("Invalid payment currency or amount");
            }

            const result = await pool.query(
                `
                UPDATE orders
                SET payment_status = 'paid'
                WHERE id = $1
                    AND stripe_checkout_session_id = $2
                    AND payment_status = 'pending_payment'
                    AND total_price = $3::numeric / 100
                RETURNING id     
                `,
                [
                    orderId,
                    checkoutSession.id,
                    checkoutSession.amount_total,
                ]
            );

            if (result.rowCount === 1) {
                console.log(`Order ${orderId} marked as paid`);
            } else {
                // A repeated webhook may refer to an already-paid order.
                // Otherwise, investigate the mismatch:
                const existing = await pool.query(
                    `
                    SELECT payment_status
                    FROM orders
                    WHERE id = $1
                        AND stripe_checkout_session_id = $2
                        AND total_price = $3::numeric / 100
                    `,
                    [
                        orderId,
                        checkoutSession.id,
                        checkoutSession.amount_total,
                    ]
                );

                if (existing.rows[0]?.payment_status !== "paid") {
                    throw new Error(`Payment verification mismatch for order ${orderId}`);
                }
            }
        }
    }

    return res.json({ received: true });
    } catch (error) {
    next (error);
    }
});

export default router;