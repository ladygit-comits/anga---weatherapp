import React, { useState } from 'react';
import './App.css';

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    try {
      const apiKey = 'YOUR_API_KEY';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
      );
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeather(city);
      if (!favorites.includes(city)) {
        setFavorites([city, ...favorites]);
      }
      setCity('');
    }
  };

  const handleFavoriteClick = (favCity) => {
    fetchWeather(favCity);
  };

  const handleDeleteFavorite = (cityName) => {
    const updatedFavorites = favorites.filter((c) => c !== cityName);
    setFavorites(updatedFavorites);
  };

  return (
    <div className="container">
      <div className="weather-app">
        <div className="search">
          <div className="search-top">Search for a city</div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <i className="fas fa-search" onClick={handleSearch}></i>
          </div>
        </div>

        {loading && <div className="css-spinner"></div>}

        {weather && (
          <div className="weather">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <div className="temp">{Math.round(weather.main.temp)}°C</div>
            <div className="weather-type">{weather.weather[0].main}</div>
            <div className="weather-date">
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div className="weather-data">
              <div>
                <div className="data-name">Humidity</div>
                <div>{weather.main.humidity}%</div>
              </div>
              <div>
                <div className="data-name">Wind Speed</div>
                <div>{weather.wind.speed} m/s</div>
              </div>
              <div>
                <div className="data-name">Pressure</div>
                <div>{weather.main.pressure} hPa</div>
              </div>
              <div>
                <div className="data-name">Feels Like</div>
                <div>{Math.round(weather.main.feels_like)}°C</div>
              </div>
            </div>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="favorites" style={{ marginTop: '2rem', width: '100%' }}>
            <h4 style={{ color: '#facc15', marginBottom: '0.5rem' }}>Saved Cities</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {favorites.map((fav, idx) => (
                <div key={idx} className="fav-wrapper">
                  <button className="fav-button" onClick={() => handleFavoriteClick(fav)}>
                    {fav}
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteFavorite(fav)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="footer">Weather App &copy; 2025</div>
    </div>
  );
}

export default WeatherApp;
