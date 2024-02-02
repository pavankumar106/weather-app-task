import React, { useState, useEffect } from "react";
import "./WeatherApp.css";
import { IoIosSearch } from "react-icons/io";
import cloud_icon from "../assets/cloud.png";
import clear from "../assets/clear.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import drizzle from "../assets/drizzle.png";

const WeatherApp = () => {
  const [requiredData, setRequiredData] = useState({
    city: "",
    temp: "",
    maxTemp: "",
    minTemp: "",
    humidity: "",
    windSpeed: "",
    windDirection: "",
    weatherDesc: "",
    code: "",
    main: "",
  });

  const [data, setData] = useState({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);
  const [image, setImage] = useState(cloud_icon);

  const key = "92997bbf4fd25f738bdb308687b67d24";
  const url = `https://api.openweathermap.org/data/2.5/weather`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let unit = isCelsius ? "metric" : "imperial";
      if (query === "") {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${url}?q=${query}&appid=${key}&units=${unit}`
        );
        const weatherData = await response.json();

        if (weatherData.cod === "404") {
          throw new Error("City not found");
        }

        setRequiredData({
          city: weatherData?.name,
          temp: weatherData?.main?.temp,
          maxTemp: weatherData?.main?.temp_max,
          minTemp: weatherData?.main?.temp_min,
          humidity: weatherData?.main?.humidity,
          windSpeed: weatherData?.wind?.speed,
          weatherDesc: weatherData?.weather[0].description,
          windDirection: getWindDirection(weatherData?.wind?.deg),
          icon: weatherData?.weather[0].icon,
          main: weatherData?.weather[0].main,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("No data found for the entered city");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, isCelsius]);

  const toggleUnits = () => {
    setIsCelsius((prevIsCelsius) => !prevIsCelsius);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(() => search);
  };
  const getWindDirection = (degree) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round((degree % 360) / 45);
    return directions[index % 8];
  };
  return (
    <>
      <div className="container">
        <div className="top">
          <input
            type="text"
            placeholder="Enter City "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="search-icon" onClick={handleSearch}>
            <IoIosSearch size={30} />
          </div>
          <button className="search-icon btn" onClick={toggleUnits}>
            Change Units ({isCelsius ? "°C" : "°F"})
          </button>
        </div>
        {loading ? (
          <div className="loading">
            <span className="loader"></span>
          </div>
        ) : (
          <>
            <div className="weather-icon">
              <img src={cloud_icon} alt="cloud-img" />
            </div>
            <div className="temp">
              {requiredData?.temp + `${isCelsius ? " °C" : "°F"}` || "No Data"}
            </div>
            <div className="location">{requiredData?.city || "No Data"}</div>
            <div className="data-box">
              <h5 className="data-item">{new Date().toLocaleString()}</h5>
              <h5 className="data-item">
                Description :{" "}
                <span>{requiredData?.weatherDesc || "No Data"}</span>
              </h5>
              <h5 className="data-item">
                Max Temperature :{" "}
                <span>
                  {requiredData?.maxTemp + `${isCelsius ? " °C" : "°F"}` ||
                    "No Data"}
                </span>
              </h5>
              <h5 className="data-item">
                Min Temperature :{" "}
                <span>
                  {requiredData?.minTemp + `${isCelsius ? " °C" : "°F"}` ||
                    "No Data"}
                </span>
              </h5>
              <h5 className="data-item">
                Wind speed :{" "}
                <span>{requiredData?.windSpeed + " km/h" || "No Data"}</span>{" "}
                <span>{requiredData.windDirection}</span>
              </h5>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default WeatherApp;
