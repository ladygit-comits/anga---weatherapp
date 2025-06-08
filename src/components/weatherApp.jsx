import sunny from "../assets/images/sunny.png";
import cloudy from "../assets/images/cloudy.png";
import rainy from "../assets/images/rainy.png";
import stormy from "../assets/images/stormy.png";
import snowy from "../assets/images/snowy.png";
import { useState, useEffect } from "react";

const WeatherApp = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const api_key = "2a9567e262ddb27328da4e76ec3eca61";

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      setLoading(true);
      const defaultLocation = "Kenya";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=metric&appid=${api_key}`;
      const res = await fetch(url);
      const defaultData = await res.json();
      setData(defaultData);
      setLoading(false);
    };
    fetchDefaultWeather();
  }, []);

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const search = async () => {
    if (location.trim() !== "") {
      setLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${api_key}`;
      const res = await fetch(url);
      const searchData = await res.json();
      if (searchData.cod !== 200) {
        setData({ notFound: true });
      } else {
        setData(searchData);
        setLocation("");
      }
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const addToFavorites = () => {
    if (data.name && !favorites.includes(data.name)) {
      setFavorites([...favorites, data.name]);
    }
  };

  const fetchFavorite = async (city) => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;
    const res = await fetch(url);
    const favData = await res.json();
    setData(favData);
    setLoading(false);
  };

  const weatherImages = {
    Clear: sunny,
    Clouds: cloudy,
    Rain: rainy,
    Snow: snowy,
    Haze: cloudy,
    Mist: cloudy,
    Thunderstorm: stormy,
  };

  const getWeatherTip = (weatherType) => {
    switch (weatherType) {
      case "Rain":
        return "☔ Grab an umbrella—it’s cozy weather for a warm drink!";
      case "Clear":
        return "😎 Perfect for a walk—don’t forget sunscreen!";
      case "Clouds":
        return "☁️ A calm day—maybe carry a light jacket.";
      case "Snow":
        return "❄️ Bundle up—snowy and chilly outside!";
      case "Thunderstorm":
        return "⛈️ Stay indoors and stay safe!";
      default:
        return "🌡️ Dress comfortably and stay hydrated.";
    }
  };

  const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null;

  const backgroundImages = {
    Clear: "linear-gradient(to right, #f3b07c, #fcd283)",
    Clouds: "linear-gradient(to right, #b0bec5, #90a4ae)",
    Rain: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Snow: "linear-gradient(to right, #aff2ff, #ffffff)",
    Haze: "linear-gradient(to right, #cfd8dc, #eceff1)",
    Mist: "linear-gradient(to right, #d7dde5, #e8ebef)",
    Thunderstorm: "linear-gradient(to right, #3a3a40, #616161)",
  };

  const backgroundImage = data.weather
    ? backgroundImages[data.weather[0].main]
    : "linear-gradient(to right, #f3b07c, #fcd283)";

  const currentDate = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const dayOfMonth = currentDate.getDate();
  const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;

  return (
    <div className="container" style={{ backgroundImage }}>
      <div
        className="weather-app"
        style={{ backgroundImage: backgroundImage.replace("to right", "to top") }}
      >
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">{data.name}</div>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
          </div>
        </div>

        <div className="favorites">
          {favorites.map((city, idx) => (
            <button key={idx} onClick={() => fetchFavorite(city)} className="fav-button">
              {city}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="css-spinner"></div>
        ) : data.notFound ? (
          <div className="notFound">Not Found 🤷🏽‍♀️</div>
        ) : (
          <>
            <div className="weather">
              <img src={weatherImage} alt="weather-icon" />
            </div>
            <div className="extra-info">
              <div className="weather-type">{data.weather?.[0].main}</div>
              <div className="temp">{data.main ? `${Math.floor(data.main.temp)}°` : null}</div>
              <div className="weather-date">
                <p>{formattedDate}</p>
              </div>
            </div>

            <div className="weather-data">
              <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet"></i>
                <div className="data">{data.main?.humidity}%</div>
              </div>
              <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind"></i>
                <div className="data">{data.wind?.speed} km/h</div>
              </div>
              <div className="sunrise">
                <div className="data-name">Sunrise</div>
                <i className="fa-solid fa-sun"></i>
                <div className="data">
                  {data.sys
                    ? new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : null}
                </div>
              </div>
              <div className="sunset">
                <div className="data-name">Sunset</div>
                <i className="fa-solid fa-moon"></i>
                <div className="data">
                  {data.sys
                    ? new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : null}
                </div>
              </div>
              {/* Feels Like + Weather Tip */}
              <div className="feels-like">
                <div className="data-name">Feels Like</div>
                <i className="fa-solid fa-temperature-half"></i>
                <div className="data">{data.main ? `${Math.round(data.main.feels_like)}°C` : null}</div>
                <div className="weather-tip">{data.weather ? getWeatherTip(data.weather[0].main) : ""}</div>
              </div>
            </div>

            <button className="save-btn" onClick={addToFavorites}>★ Save City</button>
          </>
        )}
        <div className="footer">© {new Date().getFullYear()} KAVANDA</div>
      </div>
    </div>
  );
};

export default WeatherApp;
