"use client";
import Head from 'next/head';
import { useState, useEffect } from "react";
import axios from "axios";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import { FiSearch } from 'react-icons/fi';

import { motion } from "framer-motion";
import styles from "./page.module.css";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get the weather for the current location when the component mounts
    fetchCurrentLocationWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const apiKey = "73cfba6f2d9427aacb90cf95ec0bce78";

      // Fetch current weather
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(weatherResponse.data);

      // Fetch 5-day forecast
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      setForecast(forecastResponse.data);

      setError(null);
    } catch (err) {
      setError("Unable to fetch weather data. Please try again.");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocationWeather = async () => {
    try {
      setLoading(true);
      const apiKey = "73cfba6f2d9427aacb90cf95ec0bce78";

      // Get user's current location
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // Fetch current weather for the location
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        setWeather(weatherResponse.data);

        // Fetch 5-day forecast for the location
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        setForecast(forecastResponse.data);

        setError(null);
      });
    } catch (err) {
      setError("Unable to fetch weather data. Please try again.");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const renderWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <WiDaySunny size={64} style={{ color: "#FFD700" }} />; // Gold
      case "Clouds":
        return <WiCloud size={64} style={{ color: "#B0C4DE" }} />; // LightSteelBlue
      case "Rain":
        return <WiRain size={64} style={{ color: "#4682B4" }} />; // SteelBlue
      case "Snow":
        return <WiSnow size={64} style={{ color: "#ADD8E6" }} />; // LightBlue
      case "Thunderstorm":
        return <WiThunderstorm size={64} style={{ color: "#8B0000" }} />; // DarkRed
      default:
        return <WiCloud size={64} style={{ color: "#B0C4DE" }} />; // LightSteelBlue
    }
  };

  const renderForecast = () => {
    return forecast.list.slice(0, 5).map((entry) => (
      <div key={entry.dt} className={styles.forecastItem}>
        <p>{new Date(entry.dt * 1000).toLocaleString()}</p>
        {renderWeatherIcon(entry.weather[0].main)}
        <p>{entry.weather[0].description}</p>
        <p>Temp: {entry.main.temp} °C</p>
      </div>
    ));
  };

  return (
    <>
     <Head>
        <title>Weather App | Your Reliable Weather Source | Designed by Khaled Frayji</title>
        <meta name="description" content="Get the most accurate weather forecasts with our Weather App. Find out the weather conditions for any city worldwide." />
        <meta name="keywords" content="weather, forecast, city weather, temperature, climate" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Weather App" />
        <meta property="og:description" content="Find out the weather conditions for any city worldwide." />
        <meta property="og:image" content="https://example.com/weather-app-thumbnail.jpg" />
        <meta property="og:url" content="https://your-weather-app.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
      <div className={styles.left}>
        <h1 className={styles.title}>Weather App</h1>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            placeholder="Enter city"
            className={styles.input}
          />
          <button
            onClick={() => fetchWeather()}
            className={styles.searchButton}
          >
            <FiSearch size={24} />
          </button>
        </div>

        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <p className={styles.error}>{error}</p>}
        {weather && (
          <motion.div
            className={styles.weatherInfo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>{weather.name}</h2>
            {renderWeatherIcon(weather.weather[0].main)}
            <p>{weather.weather[0].description}</p>
            <p>Temperature: {weather.main.temp} °C</p>
            <p>Humidity: {weather.main.humidity} %</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
          </motion.div>
        )}
      </div>
        <div className={styles.right}>
      {forecast && (
        <motion.div
          className={styles.forecastContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>5-Day Forecast</h3>
          <div className={styles.forecastGrid}>{renderForecast()}</div>
        </motion.div>
      )}
      </div>
    </div>
    </>
   
  );
}
