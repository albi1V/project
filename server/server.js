const express = require('express');
const app = express();
const cors = require('cors');

const indexRoutes = require('./routes/indexRoutes'); 
const connectDB = require('./config/database'); 
const path = require('path');
require('dotenv').config(); 

connectDB();
app.use(cors());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use('/api', indexRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//////////////////////




