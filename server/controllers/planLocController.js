require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');

// Load crop suitability data from a CSV file
const loadCropData = async () => {
  return new Promise((resolve, reject) => {
    const cropData = {};
    fs.createReadStream('./data/crop_suitability.csv')
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Normalize and extract necessary fields
          const cropName = row['Crop Name'].trim().toLowerCase();
          cropData[cropName] = {
            minTemp: parseFloat(row['Min Temp (°C)']),
            maxTemp: parseFloat(row['Max Temp (°C)']),
            idealConditions: row['Ideal Conditions'].split('|').map((cond) => cond.trim().toLowerCase()),
            minSoilMoisture: parseFloat(row['Min Soil Moisture (%)']),
            maxSoilMoisture: parseFloat(row['Max Soil Moisture (%)']),
            rainfall: parseFloat(row['Rainfall (mm/year)']),
            soilType: row['Soil Type'].trim().toLowerCase(),
            sunlight: parseFloat(row['Sunlight (hours/day)']),
            otherNotes: row['Other Notes'] || '',
          };
        } catch (error) {
          console.warn(`Skipping row due to parsing error: ${JSON.stringify(row)}`);
        }
      })
      .on('end', () => {
        // onsole.log('Crop data successfully loaded:', cropData); // Debug log
        resolve(cropData);
      })
      .on('error', (err) => reject(err));
  });
};


// Fetch weather data from Weatherstack API
const fetchWeatherData = async (latitude, longitude, apiKey) => {
  const weatherApiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${latitude},${longitude}`;
  try {
    const response = await axios.get(weatherApiUrl);

    // response from api
    //  console.log('Weather API Response:', response.data);

    if (response.data && response.data.current) {
      const { temperature, weather_descriptions } = response.data.current;
      return { temperature, conditions: weather_descriptions[0]?.toLowerCase() };
    }
    throw new Error('Invalid weather data received.');
  } catch (error) {
    throw new Error('Failed to retrieve weather data.');
  }
};

// Analyze Crop function
const analyzeCrop = async (req, res) => {
  console.log('Request received:', req.body);
  const { latitude, longitude, crop } = req.body;

  // Validate input
  if (!latitude || !longitude || !crop) {
    return res.status(400).json({ message: 'Please provide latitude, longitude, and crop.' });
  }

  const weatherApiKey = process.env.WEATHERSTACK_API_KEY;
  if (!weatherApiKey) {
    return res.status(500).json({ message: 'Weatherstack API key is missing in environment variables.' });
  }

  try {
    // Fetch weather data
    console.log(`Fetching weather data for Latitude: ${latitude}, Longitude: ${longitude}`);
    const { temperature, conditions } = await fetchWeatherData(latitude, longitude, weatherApiKey);
    console.log('Weather data received:', { temperature, conditions });

    // Load crop suitability data
    console.log('Loading crop suitability data...');
    const cropSuitability = await loadCropData();
    console.log('Crop suitability data loaded.');

    // Find crop data
    const cropInfo = cropSuitability[crop.trim().toLowerCase()];
    if (!cropInfo) {
      console.warn(`No data found for crop: ${crop}`);
      return res.status(404).json({ message: `Sorry, we don't have data for the crop: ${crop}.` });
    }

    // Check suitability based on temperature and conditions
    const isSuitable =
      temperature >= cropInfo.minTemp &&
      temperature <= cropInfo.maxTemp &&
      cropInfo.idealConditions.includes(conditions.toLowerCase());

    // Respond with suitability message
    if (isSuitable) {
      return res.json({ 
        message: `${crop} is suitable for this location based on the current climate.`,
        details: cropInfo,
      });
    } else {
      return res.json({
        message: `${crop} may not be suitable for this location. Ideal conditions: Temperature between ${cropInfo.minTemp}°C and ${cropInfo.maxTemp}°C, and weather should be ${cropInfo.idealConditions.join(' or ')}.`,
        details: cropInfo,
      });
    }
  } catch (error) {
    console.error('Error analyzing crop suitability:', error.message);
    return res.status(500).json({ message: 'Failed to process the request. Please try again later.' });
  }
};

// const axios = require('axios');

const fetchWeatherDetails = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  const weatherApiKey = process.env.WEATHERSTACK_API_KEY;

  if (!weatherApiKey) {
    return res.status(500).json({ message: 'Weatherstack API key is missing.' });
  }

  try {
    const weatherResponse = await axios.get(
      `http://api.weatherstack.com/current?access_key=${weatherApiKey}&query=${lat},${lng}`
    );
    //console.log("Weather API Response:", JSON.stringify(weatherResponse.data, null, 2));

    if (weatherResponse.data && weatherResponse.data.location && weatherResponse.data.current) {
      const temperature = weatherResponse.data.current.temperature;

      // Load crop suitability data
      const cropSuitability = await loadCropData();

      // Filter crops based on the temperature range
      const suitableCrops = Object.keys(cropSuitability).filter(crop => {
        const cropData = cropSuitability[crop];
        return temperature >= cropData.minTemp && temperature <= cropData.maxTemp;
      });

      // Send both weather data and suitable crops
      return res.json({
        weather: weatherResponse.data,
        suitableCrops,
      });
    }
    throw new Error('Invalid weather data received.');
  } catch (error) {
    console.error('Error fetching weather details:', error.message);
    return res.status(500).json({ message: 'Failed to fetch weather details.' });
  }
};


module.exports = { fetchWeatherDetails,analyzeCrop };

