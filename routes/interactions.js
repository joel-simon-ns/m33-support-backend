const express = require('express');
const router = express.Router();
const pool = require('../db');

// Store interaction
router.post('/', async (req, res) => {
  try {
    const { interaction_type, page_source } = req.body;

    await pool.query(
      `INSERT INTO interactions (interaction_type, page_source)
       VALUES ($1, $2)`,
      [interaction_type, page_source]
    );

    res.status(201).json({ message: 'Interaction stored successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
