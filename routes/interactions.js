const express = require('express');
const router = express.Router();
const pool = require('../db');

// ---- Simple in-memory rate limiter ----
const rateLimitMap = new Map();
const RATE_LIMIT = 10; // requests
const WINDOW_MS = 60 * 1000; // 1 minute

const ALLOWED_INTERACTIONS = [
  "whatsapp_click",
  "button_click",
  "page_view"
];

router.post('/', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // ---- Rate limiting logic ----
    const userRequests = rateLimitMap.get(ip) || [];
    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < WINDOW_MS
    );

    if (recentRequests.length >= RATE_LIMIT) {
      return res.status(429).json({
        error: "Too many requests. Please try again later."
      });
    }

    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);

    // ---- Input validation ----
    const { interaction_type, page_source } = req.body;

    if (!interaction_type || !page_source) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!ALLOWED_INTERACTIONS.includes(interaction_type)) {
      return res.status(400).json({ error: "Invalid interaction type" });
    }

    // ---- Metadata extraction ----
    const userAgent = req.headers['user-agent'] || null;
    const referrer = req.headers['referer'] || null;

    const deviceType =
      userAgent && userAgent.toLowerCase().includes('mobile')
        ? 'mobile'
        : 'desktop';

    await pool.query(
      `
      INSERT INTO public.interactions
      (interaction_type, page_source, user_agent, device_type, referrer)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [interaction_type, page_source, userAgent, deviceType, referrer]
    );

    res.status(201).json({ message: "Interaction stored successfully" });

  } catch (error) {
    console.error("RATE / INSERT ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
