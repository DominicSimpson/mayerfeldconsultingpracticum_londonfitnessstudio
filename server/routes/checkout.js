import { Router } from "express";
import {Stripe} from "stripe";
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/checkout/create-session
router.post("/create-session", requireAuth, async (req, res, next) => {
    try {
    // Order validation, database insertion, and Stripe Checkout Session creation
    return res.status(501).json({
        error: "Checkout session creation is not implemented yet",
    });
    } catch (error) {
        next(error);
    }
});

export default router;