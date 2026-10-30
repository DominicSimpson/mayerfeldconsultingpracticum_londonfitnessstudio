import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { rateLimit } from "express-rate-limit";
import { pool } from "../db/pool.js";
import productsRouter from "../routes/products.js";
import ordersRouter from "../routes/orders.js";
import authRouter from "../routes/auth.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import checkoutRouter from "../routes/checkout.js";
import stripeWebhookRouter from "../routes/stripeWebhook.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Check session secret
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not configured");
}

// Configure PostgreSQL session store
const PgSession = connectPgSimple(session);

const isProduction = process.env.NODE_ENV === "production";
// Required when behind a trusted reverse proxy in production.
if (isProduction) {
  app.set("trust proxy", 1);
}

// Stripe webhook must receive the original request body before express.json():
app.use(
  "/api/checkout/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookRouter
);

// Parse incoming JSON
app.use(express.json());

// PostgreSQL-backed sessions
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    name: "lfs.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

// Configure rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
console.log("Rate limiter configuration loaded");

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// API routes
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/checkout", checkoutRouter);

// Apply rate limiting to login and signup
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);

// Mount authentication routes
app.use("/api/auth", authRouter);

// Serve React frontend in production
if (isProduction) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDistPath = path.resolve(__dirname, "../../client/dist");

  app.use(express.static(clientDistPath));

  // Support React Router client-side routes
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
