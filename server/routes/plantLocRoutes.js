const express = require('express');
const { analyzeCrop,fetchWeatherDetails } = require('../controllers/planLocController');

const router = express.Router();

// Route for crop analysis
router.post('/crop-analysis', analyzeCrop);
router.get('/weather', fetchWeatherDetails);

module.exports = router;
