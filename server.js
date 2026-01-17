require('dotenv').config();

const express = require('express');
const cors = require('cors');

const interactionRoutes = require('./routes/interactions');
const analyticsRoutes = require("./routes/analytics");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'M33 Support Backend is running 🚀'
  });
});

// Routes
app.use('/api/interactions', interactionRoutes);
app.use('/api/analytics', analyticsRoutes);

// Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


