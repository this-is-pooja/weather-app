import "./App.css";

import React, { useState } from "react";
import { WiHumidity } from "react-icons/wi";
import { BsThermometerSun } from "react-icons/bs";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { VscLocation } from "react-icons/vsc";

const api = {
  key: "76acaafbecdb1d7da8d6eb29d9ab8f3b",
  base: "https://api.openweathermap.org/data/2.5",
};

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `${api.base}/weather?lat=${latitude}&lon=${longitude}&appid=${api.key}&units=metric`
        )
          .then((res) => res.json())
          .then((result) => {
            setIsLoading(false);
            setWeather(result);
            setError(null);
          })
          .catch((error) => {
            setIsLoading(false);
            setWeather(null);
            setError("Unable to get weather data");
          });
      },
      (error) => {
        setIsLoading(false);
        setWeather(null);
        setError("Unable to retrieve your location");
      }
    );
  };

  const search = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${api.base}/weather?q=${query}&units=metric&appid=${api.key}`
      );
      const data = await response.json();

      if (data.cod === "404") {
        setError("City not found");
        setWeather({});
      } else {
        setError(null);
        setWeather(data);
      }
    } catch (error) {
      setError("Error fetching weather data");
      setWeather({});
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  
  const renderSearchForm = () => (
    <form onSubmit={search}>
      <div className="form-container">
        <div className="head-text">Weather App</div>
        <div className="divider"></div>
        <div style={{ textAlign: "center" }}>
          {" "}
          <input
            type="text"
            placeholder="Enter city name"
            value={query}
            onChange={handleChange}
            style={{ textAlign: "center" }}
          />
        </div>

        <div className="search-btn">
          <div className="divider"></div>
          <button type="submit">
            <FiSearch color="#989898" />
          </button>
          <div className="divider"></div>
        </div>
        <div className="btnContainer">
          <button onClick={getLocation} className="getDeviceBtn">
            Get Device Location
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </form>
  );

  const renderResult = () => (
    <div className="weather">
      <div
        className={["head-text", "arrow-btn"].join(" ")}
        onClick={() => setWeather({})}
      >
        <AiOutlineArrowLeft />
        Weather App
      </div>
      <div
        className="divider"
        style={{
          marginTop: "25px",
        }}
      ></div>
      <div>
        <img
          src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
          alt="Weather icon"
          height="60px"
        />
      </div>
      <div className={["temperature", "temp"].join(" ")}>
        {Math.round(weather.main.temp)}°C
      </div>
      <div className="description">{weather.weather[0].description}</div>
      <div className="location">
        <VscLocation fontSize={"18px"} color="696969" />
        {weather.name}
      </div>
      <div className="divider"></div>
      <div className="tempContainer">
        <div className="tempData">
          <div>
            <BsThermometerSun className="tempDataIcon" />{" "}
          </div>
          <div className="flexCol">
            <div style={{ fontWeight: "500" }}>
              {Math.round(weather.main.temp)}°C
            </div>
            <div style={{ fontSize: "10px" }}>Feels like</div>
          </div>
        </div>
        <div className="col-divider"></div>
        <div className="tempData">
          <div>
            <WiHumidity className="tempDataIcon" />{" "}
          </div>
          <div className="flexCol">
            <div style={{ fontWeight: "500" }}>{weather.main.humidity}%</div>
            <div style={{ fontSize: "10px" }}>Humidity</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      {!weather?.main ? renderSearchForm() : renderResult()}
    </div>
  );
}

export default App;
