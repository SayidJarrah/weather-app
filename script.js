const cities = [
  { name: "Kyiv", latitude: 50.4501, longitude: 30.5234 },
  { name: "Singapore", latitude: 1.3521, longitude: 103.8198 },
  { name: "London", latitude: 51.5074, longitude: -0.1278 },
  { name: "Sydney", latitude: -33.8688, longitude: 151.2093 }
];

const apiBase = "https://api.open-meteo.com/v1/forecast";

function createCard(city) {
  const card = document.createElement("article");
  card.className = "weather-card";

  const cityTitle = document.createElement("h2");
  cityTitle.className = "weather-card__city";
  cityTitle.textContent = city.name;

  const tempValue = document.createElement("p");
  tempValue.className = "weather-card__temp";
  tempValue.textContent = "--";

  const status = document.createElement("p");
  status.className = "weather-card__status weather-card__status--loading";
  status.textContent = "Loading...";

  card.append(cityTitle, tempValue, status);

  return { card, tempValue, status };
}

async function fetchTemperature(city) {
  const url = new URL(apiBase);
  url.searchParams.set("latitude", city.latitude);
  url.searchParams.set("longitude", city.longitude);
  url.searchParams.set("current_weather", "true");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  const temperature = data?.current_weather?.temperature;

  if (typeof temperature !== "number") {
    throw new Error("Temperature not found in response");
  }

  return temperature;
}

function showTemperature(tempEl, statusEl, temperature) {
  const rounded = Math.round(temperature);
  tempEl.textContent = `${rounded}°C`;
  statusEl.textContent = "Current temperature";
  statusEl.classList.remove("weather-card__status--loading", "weather-card__status--error");
}

function showError(tempEl, statusEl) {
  tempEl.textContent = "--";
  statusEl.textContent = "Data unavailable";
  statusEl.classList.remove("weather-card__status--loading");
  statusEl.classList.add("weather-card__status--error");
}

async function initDashboard() {
  const grid = document.getElementById("weather-grid");
  if (!grid) {
    return;
  }

  cities.forEach(async (city) => {
    const { card, tempValue, status } = createCard(city);
    grid.appendChild(card);

    try {
      const temperature = await fetchTemperature(city);
      showTemperature(tempValue, status, temperature);
    } catch (error) {
      console.error(`Failed to load weather for ${city.name}:`, error);
      showError(tempValue, status);
    }
  });
}

document.addEventListener("DOMContentLoaded", initDashboard);
