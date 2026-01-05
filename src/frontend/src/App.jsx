import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiFog } from "react-icons/wi";
import './App.css';

function App() {
  const [unit, setUnit] = useState('C');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastList, setForecastList] = useState([]);
  const [showForecast, setShowForecast] = useState(false);
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const fetchWeather = async (cityName, lat, lon) => {
    try {
      setError(null);

      const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/weather/';
      const url = cityName
        ? `${baseUrl}?city=${cityName}`
        : `${baseUrl}?lat=${lat}&lon=${lon}`;


      const res = await fetch(url);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch weather data");
      }

      const data = await res.json();

      setWeatherData(data.current);
      setForecastList(data.forecast.list.filter(item => item.dt_txt.includes("12:00:00")));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching weather:", err.message);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeather(null, latitude, longitude);
      },
      () => {
        fetchWeather("Kathmandu");
      }
    );
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWeather(city);
      setCity("");
    }
  };

  const toggleUnit = () => setUnit(prev => prev === 'C' ? 'F' : 'C');

  const formatTemp = (temp) => {
    const t = unit === 'C' ? temp : (temp * 9 / 5) + 32;
    return Math.round(t);
  };

  const displayTemp = weatherData ? formatTemp(weatherData.main.temp) : "--";

  const getWeatherIcon = (description) => {
    const d = description.toLowerCase();
    if (d.includes("clear")) return <WiDaySunny className="w-16 h-16 text-yellow-300" />;
    if (d.includes("cloud")) return <WiCloud className="w-16 h-16 text-gray-300" />;
    if (d.includes("rain")) return <WiRain className="w-16 h-16 text-blue-400" />;
    if (d.includes("snow")) return <WiSnow className="w-16 h-16 text-white" />;
    if (d.includes("thunder")) return <WiThunderstorm className="w-16 h-16 text-purple-500" />;
    if (d.includes("fog") || d.includes("mist")) return <WiFog className="w-16 h-16 text-gray-400" />;
    return <WiCloud className="w-16 h-16 text-gray-300" />;
  };

  return (
    <div className='flex justify-center h-screen bg-[#2596be] p-4'>
      <div className='flex flex-col items-center mt-[100px] gap-8 w-full max-w-[600px]'>

        <div id='weather-search' className='w-full'>
          <input type="text" value={city} placeholder="Enter city name"
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            className='w-full h-[50px] rounded-lg px-6 shadow-xl outline-none text-gray-700 text-lg'
          />
        </div>

        {error && (
          <div className="bg-blue-400 text-white p-3 rounded-lg shadow-md w-full text-center">
            {error}
          </div>
        )}

        {weatherData && (
          <>
            <div className="flex justify-center w-full">
              <Button variant="secondary" onClick={() => setShowForecast(!showForecast)}
                className="bg-white/20 hover:bg-white/30 text-white border-none shadow-md backdrop-blur-sm h-10 px-6" >
                {showForecast ? "Back to Current Weather" : "Show 5-Day Forecast"}
              </Button>
            </div>

            {!showForecast ? (
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 text-white w-full shadow-lg flex flex-col items-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-center">{weatherData.name}, {weatherData.sys.country}</h2>
                  <Button variant="secondary" size="icon" onClick={toggleUnit}
                    className="bg-white/30 hover:bg-white/50 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold border-none text-white" >
                    °{unit === 'C' ? 'F' : 'C'}
                  </Button>
                </div>

                <div className="mb-4">
                  {getWeatherIcon(weatherData.weather[0].description)}
                </div>

                <div className="text-6xl font-bold mb-4">{displayTemp}°{unit}</div>
                <p className="text-xl capitalize mb-4">{weatherData.weather[0].description}</p>

                <div className="flex justify-between w-full mt-4 bg-white/10 rounded-lg p-4">
                  <div className="flex flex-col items-center">
                    <span className="text-sm opacity-80">Humidity</span>
                    <span className="font-semibold text-lg">{weatherData.main.humidity}%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm opacity-80">Wind Speed</span>
                    <span className="font-semibold text-lg">{weatherData.wind.speed} m/s</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 text-white w-full shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-center">5-Day Forecast</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[300px]">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="p-3">Date</th>
                        <th className="p-3">Temp</th>
                        <th className="p-3">Condition</th>
                        <th className="p-3">Humidity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecastList.map((day, index) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-3">
                            {new Date(day.dt_txt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                          </td>
                          <td className="p-3">{formatTemp(day.main.temp)}°{unit}</td>
                          <td className="p-3 capitalize flex items-center gap-2">
                            {getWeatherIcon(day.weather[0].description)}
                            <span>{day.weather[0].description}</span>
                          </td>
                          <td className="p-3">{day.main.humidity}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
