const express = require('express');
const router = express.Router();
const pool = require('../db');

// Store interaction
router.post('/', async (req, res) => {
  try {
    // 🔍 DEBUG: confirm DB + schema
    const debug = await pool.query(
      'SELECT current_database(), current_schema()'
    );
    console.log('DB DEBUG:', debug.rows);

    const { interaction_type, page_source } = req.body;

    // ✅ Basic validation
    if (!interaction_type || !page_source) {
      return res.status(400).json({ error: 'Invalid interaction data' });
    }

    // ✅ Metadata from request
    const userAgent = req.headers['user-agent'] || null;
    const referrer = req.headers['referer'] || null;

    // ✅ Simple & explainable device detection
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

    res.status(201).json({ message: 'Interaction stored successfully' });
  } catch (error) {
    console.error('DB INSERT ERROR:', error);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

module.exports = router;



