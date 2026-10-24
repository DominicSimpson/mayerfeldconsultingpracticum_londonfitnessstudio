import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { rateLimit } from "express-rate-limit";

import { pool } from "..db/pool.js";
import productsRouter from "../routes/products.js";
import ordersRouter from "../routes/orders.js";
import authRouter from "../routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not configured");
}

const PgSession = connectPgSimple(session);

const isProduction = process.env.NODE_ENV === "production";
// Required when behind a trusted reverse proxy in production.
if (isProduction) {
  app.set("trust proxy", 1);
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authLimiter, authRouter);
// Catches errors passed to next(err), e.g. database failures
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

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
