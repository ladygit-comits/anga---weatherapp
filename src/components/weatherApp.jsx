import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherApp.css";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const apiKey = "e9bd5ff51e5dce2df96f6fa275ff8ffb";

  const getWeather = async (cityName) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      const weather = response.data;
      const weatherType = weather.weather[0].main;
      const weatherIcons = {
        Clouds: "clouds.png",
        Rain: "rain.png",
        Clear: "clear.png",
        Mist: "mist.png",
        Drizzle: "drizzle.png",
        Snow: "snow.png",
        Thunderstorm: "thunderstorm.png",
      };
      setData({
        name: weather.name,
        temp: weather.main.temp,
        humidity: weather.main.humidity,
        wind: weather.wind.speed,
        weather: weather.weather[0].main,
        icon: weatherIcons[weatherType] || "default.png",
        sunrise: new Date(weather.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(weather.sys.sunset * 1000).toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      });
    } catch {
      setData({ notFound: true });
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (city.trim()) {
      getWeather(city);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const saveToFavorites = () => {
    if (city && !favorites.includes(city)) {
      setFavorites([...favorites, city]);
    }
  };

  const handleFavoriteClick = (favCity) => {
    setCity(favCity);
    getWeather(favCity);
  };

  const getBackgroundStyle = (weatherType) => {
    const gradients = {
      Clear: "linear-gradient(to right, #facc15, #fcd34d)",
      Clouds: "linear-gradient(to right, #94a3b8, #cbd5e1)",
      Rain: "linear-gradient(to right, #60a5fa, #3b82f6)",
      Mist: "linear-gradient(to right, #a5b4fc, #818cf8)",
      Drizzle: "linear-gradient(to right, #38bdf8, #0ea5e9)",
      Snow: "linear-gradient(to right, #f0f9ff, #bae6fd)",
      Thunderstorm: "linear-gradient(to right, #818cf8, #6366f1)",
    };
    return gradients[weatherType] || "linear-gradient(to right, #94a3b8, #cbd5e1)";
  };

  return (
    <div className="container" style={{ background: getBackgroundStyle(data.weather) }}>
      <div className="weather-app">
        <div className="search">
          <div className="search-top">
            <i className="fas fa-location-dot"></i> Enter your city
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <i className="fas fa-search" onClick={handleSearch}></i>
          </div>
        </div>

        {loading ? (
          <div className="css-spinner"></div>
        ) : data.notFound ? (
          <div style={{ color: "#fff" }}>City not found</div>
        ) : data.name ? (
          <>
            <div className="weather">
              <img src={require(`./assets/${data.icon}`)} alt="weather-icon" />
              <div className="temp">{Math.round(data.temp)}°C</div>
            </div>
            <div className="weather-type">{data.weather}</div>
            <div className="weather-date">
              <p>{data.date}</p>
            </div>
            <div className="weather-data">
              <div>
                <div className="data-name">Humidity</div>
                <div>{data.humidity}%</div>
              </div>
              <div>
                <div className="data-name">Wind</div>
                <div>{data.wind} km/h</div>
              </div>
              <div>
                <div className="data-name">Sunrise</div>
                <div>{data.sunrise}</div>
              </div>
              <div>
                <div className="data-name">Sunset</div>
                <div>{data.sunset}</div>
              </div>
            </div>
            <button className="save-btn" onClick={saveToFavorites}>
              ★ Save City
            </button>
          </>
        ) : (
          <div style={{ color: "#cbd5e1" }}>Search a city to see the weather</div>
        )}

        <div className="favorites">
          {favorites.map((fav, idx) => (
            <button key={idx} className="fav-button" onClick={() => handleFavoriteClick(fav)}>
              {fav}
            </button>
          ))}
        </div>
      </div>

      <div className="footer">Made by You</div>
    </div>
  );
};

export default WeatherApp;
