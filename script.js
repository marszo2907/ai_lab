const locationInput = document.getElementById("location");
const checkWeatherBtn = document.getElementById("checkWeatherBtn");
const resultsContainer = document.getElementById("results");

checkWeatherBtn.addEventListener("click", () => {
  const locationName = locationInput.value.trim();
  if (!locationName) {
    alert("Proszę wpisać nazwę miejscowości.");
    return;
  }

  resultsContainer.innerHTML = "";

  getCurrentWeather(locationName);
  getForecast(locationName);
});

function getCurrentWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=48d61608da798431b3c16d9eb743f764&units=metric&lang=pl`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", apiUrl);
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log("Bieżąca pogoda – surowa odpowiedź:", xhr.responseText);

      const data = JSON.parse(xhr.responseText);
      console.log("Bieżąca pogoda – obiekt JSON:", data);

      displayCurrentWeather(data);
    } else {
      console.error("Błąd przy pobieraniu bieżącej pogody:", xhr.status, xhr.statusText);
      alert("Nie udało się pobrać danych o bieżącej pogodzie.");
    }
  };

  xhr.onerror = function() {
    console.error("Wystąpił błąd połączenia przy pobieraniu bieżącej pogody.");
  };

  xhr.send();
}

function getForecast(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=48d61608da798431b3c16d9eb743f764&units=metric&lang=pl`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Błąd w zapytaniu: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Prognoza 5-dniowa – obiekt JSON:", data);
      displayForecast(data);
    })
    .catch(error => {
      console.error("Błąd przy pobieraniu prognozy:", error);
      alert("Nie udało się pobrać danych o prognozie.");
    });
}

function displayCurrentWeather(data) {
  const weatherDiv = document.createElement("div");
  weatherDiv.classList.add("weather-current");

  const title = document.createElement("h2");
  title.textContent = "Bieżąca pogoda";
  weatherDiv.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = `Opis: ${data.weather ? data.weather[0].description : "Brak danych"}`;

  const temp = document.createElement("p");
  temp.textContent = `Temperatura: ${data.main ? data.main.temp : "Brak"} °C`;

  const humidity = document.createElement("p");
  humidity.textContent = `Wilgotność: ${data.main ? data.main.humidity : "Brak"}%`;

  weatherDiv.appendChild(desc);
  weatherDiv.appendChild(temp);
  weatherDiv.appendChild(humidity);

  resultsContainer.appendChild(weatherDiv);
}

function displayForecast(data) {
  const forecastDiv = document.createElement("div");
  forecastDiv.classList.add("weather-forecast");

  const title = document.createElement("h2");
  title.textContent = "Prognoza 5-dniowa (co 3 godziny)";
  forecastDiv.appendChild(title);

  data.list.forEach((entry) => {
    const dayForecast = document.createElement("div");
    dayForecast.classList.add("day-forecast");

    const dateTime = document.createElement("p");
    dateTime.textContent = `Data i czas: ${entry.dt_txt}`;

    const desc = document.createElement("p");
    desc.textContent = `Opis: ${entry.weather ? entry.weather[0].description : "Brak"}`;

    const temp = document.createElement("p");
    temp.textContent = `Temperatura: ${entry.main ? entry.main.temp : "Brak"} °C`;

    const humidity = document.createElement("p");
    humidity.textContent = `Wilgotność: ${entry.main ? entry.main.humidity : "Brak"}%`;

    dayForecast.appendChild(dateTime);
    dayForecast.appendChild(desc);
    dayForecast.appendChild(temp);
    dayForecast.appendChild(humidity);

    forecastDiv.appendChild(dayForecast);
  });

  resultsContainer.appendChild(forecastDiv);
}
