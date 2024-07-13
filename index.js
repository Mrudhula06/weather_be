// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const weatherSchema = new mongoose.Schema({
  cityName: String,
  date: String, // Change type to Date if you want to store as Date object
  minTemp: Number,
  maxTemp: Number,
  windSpeed: Number,
  humidity: Number,
  sunrise: String,
  sunset: String,
  feelsLike: Number,
});

const Weather = mongoose.model('Weather', weatherSchema);

app.post('/api/weather', async (req, res) => {
  try {
    const {
      cityName,
      date,
      minTemp,
      maxTemp,
      windSpeed,
      humidity,
      sunrise,
      sunset,
      feelsLike,
    } = req.body;

    const weatherData = new Weather({
      cityName,
      date,
      minTemp,
      maxTemp,
      windSpeed,
      humidity,
      sunrise,
      sunset,
      feelsLike,
    });

    await weatherData.save();
    res.status(201).json({ message: 'Weather data saved successfully' });
  } catch (error) {
    console.error('Error saving weather data:', error);
    res.status(500).json({ error: 'Error saving weather data' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
