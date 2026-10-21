import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Routes for your data will go here, e.g. /api/classes

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
