import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from './fsidebar';
import Navbar from './fnavbar';
import styles from './adp.module.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CropAnalysis = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [crop, setCrop] = useState('');
  const [locationDetails, setLocationDetails] = useState(null);
  const [suitableCrops, setSuitableCrops] = useState([]);
  const [error, setError] = useState('');

  // Function to handle map click events
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat.toFixed(6));
        setLongitude(e.latlng.lng.toFixed(6));
      },
    });
    return latitude && longitude ? <Marker position={[latitude, longitude]} /> : null;
  };

  // Fetch weather and crop suitability details
  const fetchDetails = async () => {
    if (!latitude || !longitude) {
      Swal.fire({
        icon: 'warning',
        title: 'No Location Selected',
        text: 'Please select a location on the map.',
      });
      return;
    }

    try {
      const response = await axios.get(
        `https://project-9jg7.onrender.com/api/plantlocation/weather?lat=${latitude}&lng=${longitude}`
      );

      const { weather, suitableCrops } = response.data;

      setLocationDetails(weather);
      setSuitableCrops(suitableCrops);

      Swal.fire({
        icon: 'info',
        title: 'Details Fetched',
        text: 'Weather details and suitable crops loaded successfully!',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Fetch Details',
        text: 'Failed to fetch location details.',
      });
    }
  };

  // Analyze crop suitability
  const handleCropAnalysis = async () => {
    if (!latitude || !longitude || !crop) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Fields',
        text: 'Please select location and enter a crop name.',
      });
      return;
    }

    try {
      const response = await axios.post('https://project-9jg7.onrender.com/api/plantlocation/crop-analysis', {
        latitude,
        longitude,
        crop,
      });

      Swal.fire({
        icon: 'success',
        title: 'Analysis Complete',
        text: response.data.message,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Analysis Failed',
        text: 'Failed to analyze crop suitability. Please try again.',
      });
    }
  };

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
        <div className={styles.formContainer}>
          <h1>Crop Suitability Analysis</h1>

          <div className={styles.inputGroup}>
            <label>
              Latitude:
              <input
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Select from map"
                required
              />
            </label>

            <label>
              Longitude:
              <input
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Select from map"
                required
              />
            </label>

            <label>
              Crop Name:
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="Enter the crop name"
                required
              />
            </label>
          </div>

          <div className={styles.buttonGroup}>
            <button onClick={fetchDetails}>Fetch Weather & Crops</button>
            <button onClick={handleCropAnalysis}>Analyze Crop</button>
          </div>

          {/* Map Section */}
          <div className={styles.mapContainer} style={{ marginTop: '20px', height: '400px' }}>
            <h3>Select Location on Map:</h3>
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler />
            </MapContainer>
          </div>

          {/* Weather Details */}
          {locationDetails && (
            <div className={styles.result}>
              <h3>Weather Details:</h3>
              <p>
                <strong>Location:</strong> {locationDetails.location.name},{' '}
                {locationDetails.location.region}, {locationDetails.location.country}
              </p>
              <p>
                <strong>Latitude:</strong> {locationDetails.location.lat}, <strong>Longitude:</strong>{' '}
                {locationDetails.location.lon}
              </p>
              <p>
                <strong>Weather:</strong> {locationDetails.current.weather_descriptions[0]}{' '}
                {/* <img src={locationDetails.current.weather_icons[0]} alt="Weather icon" /> */}
              </p>
              <p>
                <strong>Temperature:</strong> {locationDetails.current.temperature}°C,{' '}
                <strong>Feels Like:</strong> {locationDetails.current.feelslike}°C
              </p>
              <p>
                <strong>Humidity:</strong> {locationDetails.current.humidity}%,{' '}
                <strong>Pressure:</strong> {locationDetails.current.pressure} hPa
              </p>
              <p>
                <strong>Wind:</strong> {locationDetails.current.wind_speed} km/h ({locationDetails.current.wind_dir})
              </p>
              <p>
                <strong>Visibility:</strong> {locationDetails.current.visibility} km
              </p>
            </div>
          )}

          {/* Suitable Crops Section */}
          {suitableCrops.length > 0 && (
            <div className={styles.result}>
              <h3>Suitable Crops:</h3>
              <ul>
                {suitableCrops.map((crop, index) => (
                  <li key={index}>{crop}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropAnalysis;
