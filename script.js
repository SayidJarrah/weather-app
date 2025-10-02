const cityCatalog = [
  { id: "kyiv", name: "Kyiv", label: "Kyiv, Ukraine", latitude: 50.4501, longitude: 30.5234 },
  { id: "singapore", name: "Singapore", label: "Singapore", latitude: 1.3521, longitude: 103.8198 },
  { id: "london", name: "London", label: "London, United Kingdom", latitude: 51.5074, longitude: -0.1278 },
  { id: "sydney", name: "Sydney", label: "Sydney, Australia", latitude: -33.8688, longitude: 151.2093 },
  { id: "new-york", name: "New York", label: "New York, USA", latitude: 40.7128, longitude: -74.006 },
  { id: "tokyo", name: "Tokyo", label: "Tokyo, Japan", latitude: 35.6762, longitude: 139.6503 },
  { id: "berlin", name: "Berlin", label: "Berlin, Germany", latitude: 52.52, longitude: 13.405 },
  { id: "toronto", name: "Toronto", label: "Toronto, Canada", latitude: 43.6532, longitude: -79.3832 }
];

const defaultCityIds = ["kyiv", "singapore", "london", "sydney"];
const cityLookup = new Map(cityCatalog.map((city) => [city.id, city]));

const apiBase = "https://api.open-meteo.com/v1/forecast";
const addedCityIds = new Set();

function createCard(city) {
  const card = document.createElement("article");
  card.className = "weather-card";
  card.dataset.cityId = city.id;

  const topRow = document.createElement("div");
  topRow.className = "weather-card__top";

  const cityTitle = document.createElement("h2");
  cityTitle.className = "weather-card__city";
  cityTitle.textContent = city.name;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "weather-card__remove";
  removeButton.setAttribute("aria-label", `Remove ${city.name}`);

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M9 3h6l.32 2H20a1 1 0 0 1 0 2h-1v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7H4a1 1 0 1 1 0-2h4.68Zm7 4H8v12h8ZM10 2h4a1 1 0 0 1 .99.86L15.17 5H8.83l.18-1.14A1 1 0 0 1 10 2Zm5 15a1 1 0 0 1-2 0v-6a1 1 0 1 1 2 0ZM11 11a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0Z"
  );
  icon.appendChild(path);

  const srText = document.createElement("span");
  srText.className = "visually-hidden";
  srText.textContent = "Remove";

  removeButton.append(icon, srText);

  const tempValue = document.createElement("p");
  tempValue.className = "weather-card__temp";
  tempValue.textContent = "--";

  const status = document.createElement("p");
  status.className = "weather-card__status weather-card__status--loading";
  status.textContent = "Loading...";

  const updated = document.createElement("p");
  updated.className = "weather-card__updated";
  updated.textContent = "";

  topRow.append(cityTitle, removeButton);
  card.append(topRow, tempValue, status, updated);

  return { card, tempValue, status, updated, removeButton };
}

async function fetchWeather(city) {
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
  const time = data?.current_weather?.time;

  if (typeof temperature !== "number" || !time) {
    throw new Error("Weather data incomplete");
  }

  return { temperature, time };
}

function formatUpdatedLabel(isoString) {
  if (!isoString) {
    return "";
  }

  const parsedDate = new Date(isoString);
  if (Number.isNaN(parsedDate.getTime())) {
    return `Updated at ${isoString}`;
  }

  const dateLabel = parsedDate.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const timeLabel = parsedDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  return `Updated ${dateLabel} ${timeLabel}`;
}

function showWeather(tempEl, statusEl, updatedEl, weather) {
  const rounded = Math.round(weather.temperature);
  tempEl.textContent = `${rounded}°C`;
  statusEl.textContent = "Current temperature";
  statusEl.classList.remove("weather-card__status--loading", "weather-card__status--error");
  updatedEl.textContent = formatUpdatedLabel(weather.time);
}

function showError(tempEl, statusEl, updatedEl) {
  tempEl.textContent = "--";
  statusEl.textContent = "Data unavailable";
  statusEl.classList.remove("weather-card__status--loading");
  statusEl.classList.add("weather-card__status--error");
  updatedEl.textContent = "";
}

function refreshCityOptions(select, button) {
  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = "Select a city";
  select.appendChild(placeholder);

  cityCatalog.forEach((city) => {
    if (addedCityIds.has(city.id)) {
      return;
    }

    const option = document.createElement("option");
    option.value = city.id;
    option.textContent = city.label ?? city.name;
    select.appendChild(option);
  });

  const hasChoices = select.options.length > 1;
  select.disabled = !hasChoices;
  button.disabled = !hasChoices;
  select.value = "";
}

function removeCityFromDashboard(cityId, card, ui) {
  if (!addedCityIds.has(cityId)) {
    return;
  }

  addedCityIds.delete(cityId);
  card.remove();
  refreshCityOptions(ui.select, ui.addButton);
  if (!ui.select.disabled) {
    ui.select.focus();
  }
}

function addCityToDashboard(city, ui) {
  if (addedCityIds.has(city.id)) {
    return false;
  }

  const { card, tempValue, status, updated, removeButton } = createCard(city);
  ui.grid.appendChild(card);
  addedCityIds.add(city.id);

  fetchWeather(city)
    .then((weather) => {
      showWeather(tempValue, status, updated, weather);
    })
    .catch((error) => {
      console.error(`Failed to load weather for ${city.name}:`, error);
      showError(tempValue, status, updated);
    });

  removeButton.addEventListener("click", () => {
    removeCityFromDashboard(city.id, card, ui);
  });

  return true;
}

function initDashboard() {
  const grid = document.getElementById("weather-grid");
  const pickerForm = document.getElementById("city-picker");
  const select = document.getElementById("city-select");
  const addButton = pickerForm?.querySelector(".city-picker__button");

  if (!grid || !pickerForm || !select || !addButton) {
    return;
  }

  const ui = { grid, select, addButton };

  defaultCityIds.forEach((cityId) => {
    const city = cityLookup.get(cityId);
    if (city) {
      addCityToDashboard(city, ui);
    }
  });

  refreshCityOptions(select, addButton);

  pickerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedId = select.value;
    if (!selectedId) {
      return;
    }

    const city = cityLookup.get(selectedId);
    if (!city) {
      return;
    }

    const added = addCityToDashboard(city, ui);
    if (added) {
      refreshCityOptions(select, addButton);
    }
  });
}

document.addEventListener("DOMContentLoaded", initDashboard);
