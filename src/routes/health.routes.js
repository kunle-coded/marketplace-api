// src/routes/health.routes.js

const express = require("express");
const db = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      database: "connected",
      service: "marketplace-api",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

module.exports = router;
