const express = require("express");
const router = express.Router();
const pool = require("../db"); // same DB connection you already use

// 1. Summary (total interactions)
router.get("/summary", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS total_interactions FROM interactions"
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// 2. Daily interactions
router.get("/daily", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DATE(created_at) AS interaction_date,
             COUNT(*) AS total_interactions
      FROM interactions
      GROUP BY DATE(created_at)
      ORDER BY interaction_date
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch daily data" });
  }
});

// 3. Device distribution
router.get("/devices", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT device_type,
             COUNT(*) AS total_interactions
      FROM interactions
      GROUP BY device_type
      ORDER BY total_interactions DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch device data" });
  }
});

// 4. Interaction types
router.get("/types", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT interaction_type,
             COUNT(*) AS total_interactions
      FROM interactions
      GROUP BY interaction_type
      ORDER BY total_interactions DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch interaction types" });
  }
});

module.exports = router;
