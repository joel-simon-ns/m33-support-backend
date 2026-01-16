const express = require('express');
const router = express.Router();
const pool = require('../db');

// Store interaction
router.post('/', async (req, res) => {
  try {
    // 🔍 DEBUG: show exactly which DB + schema Render is using
    const debug = await pool.query(
      'SELECT current_database(), current_schema()'
    );
    console.log('DB DEBUG:', debug.rows);

    const { interaction_type, page_source } = req.body;

    await pool.query(
      `
      INSERT INTO public.interactions (interaction_type, page_source)
      VALUES ($1, $2)
      `,
      [interaction_type, page_source]
    );

    res.status(201).json({ message: 'Interaction stored successfully' });
  } catch (error) {
    console.error('DB INSERT ERROR:', error);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

module.exports = router;


