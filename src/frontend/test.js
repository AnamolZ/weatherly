async function getWeather() {
  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=Kathmandu&units=metric&appid=3d31ac07e02757a71b47243a959b954c"
  );
  
  const data = await response.json();
console.log(data.main.temp);
console.log(data.weather[0].description);
console.log(data.wind.speed);
console.log(data.main.humidity);
}

getWeather();

