require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const scanRoutes = require("./routes/scans");

const app = express();

app.disable("x-powered-by");

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
}));

app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "JobShield API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/scans", scanRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large." });
  }

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON request." });
  }

  res.status(500).json({ message: "An unexpected server error occurred." });
});

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    throw new Error("MONGODB_URI and JWT_SECRET must be configured.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  app.listen(port, () => {
    console.log(`JobShield API running on port ${port}`);
  });
}

startServer().catch(error => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});