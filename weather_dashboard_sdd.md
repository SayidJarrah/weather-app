# 📑 Solution Design Document (SDD)

## 1. Introduction
**Purpose:**  
This document defines the solution design for the *Simple Weather Dashboard (4 Cities)* project. It translates the product requirements into a technical blueprint for implementation.

**Scope:**  
- A single static web page displaying the current temperature in Celsius for four fixed cities: Kyiv, Singapore, London, Sydney.
- Weather data retrieved from the Open-Meteo API.
- Minimal styling, readable layout, lightweight performance.
- No backend components; purely client-side solution.

**References:**  
- Product Requirements Document (PRD) – *Simple Weather Dashboard v1*.

**Assumptions & Constraints:**  
- Must be implemented using **vanilla JavaScript, HTML, and CSS**.
- Must use **Open-Meteo API** (free, no API key required).
- Static page only; no persistent storage, no backend services.
- Failure handling must show the message: **“Data unavailable”**.

---

## 2. Business Context
**Business Goals & Drivers:**  
- Save user time by providing a unified dashboard view for four cities instead of checking multiple sources individually.
- Ensure simplicity, readability, and fast page load.

**High-Level Requirements:**  
- One static page.
- Display temperature in °C for each of the four cities.
- Use a live weather API.
- Show a loading state while fetching.
- Show an error message (“Data unavailable”) if the fetch fails.

**Out of Scope:**  
- User-defined city selection.
- Auto-refresh of data.
- Persistent storage or caching.
- Advanced styling, branding, or theming.
- Backend hosting or server-side logic.

---

## 3. Solution Overview
**Solution Objectives:**  
- Provide a minimalistic weather dashboard that meets functional and non-functional requirements with minimal dependencies.

**Key Features:**  
- Four fixed city entries.
- Current temperature in °C displayed per city.
- Loading and error states.
- Lightweight client-side implementation.

**High-Level Architecture (Context View):**  
```
User Browser  ───────▶  Open-Meteo API
      │                    ▲
      │  Fetch request      │
      ▼                    │
Static HTML/JS page ◀───────┘
```

**Actors & Interactions:**  
- **User:** Opens the static webpage in a browser.
- **System:** Fetches current weather data for each city from the Open-Meteo API and renders the results.

---

## 4. Architecture
**Logical Architecture:**  
- **UI Renderer:** Displays city names and temperatures; updates DOM with results or error message.
- **Data Fetcher:** Sends requests to Open-Meteo API with fixed coordinates.
- **Error Handler:** Displays “Data unavailable” if a request fails.
- **Loading State Manager:** Shows temporary placeholders while data loads.

**Physical Architecture:**  
- Runs entirely in the **user’s browser**.
- Delivered as a **static HTML/CSS/JS bundle**.

**Integration Architecture:**  
- **Open-Meteo API:** REST-based, supports query by latitude/longitude.
- No intermediaries, direct browser-to-API calls.

**Data Architecture:**  
- In-memory structure only. Example model:
```json
[
  { "name": "Kyiv", "lat": 50.4501, "lon": 30.5234, "temperature": 18, "status": "ok" },
  { "name": "Singapore", "lat": 1.3521, "lon": 103.8198, "temperature": 32, "status": "ok" },
  { "name": "London", "lat": 51.5074, "lon": -0.1278, "temperature": null, "status": "error" },
  { "name": "Sydney", "lat": -33.8688, "lon": 151.2093, "temperature": 24, "status": "ok" }
]
```

---

## 5. Technology Stack
**Chosen Technologies:**  
- **Vanilla JavaScript (ES6)** – core logic, fetch calls.
- **HTML5** – static page structure.
- **CSS3** – minimal styling for readability.

**Rationale for Selection:**  
- Lightweight, minimal dependencies.
- Easy to host on any static hosting provider.
- Readable and maintainable by small teams.

**Alternatives Considered:**  
- **React** – rejected for v1 due to additional complexity and overhead.

---

## 8. Integration Points
**External System:**  
- **Open-Meteo API** – free weather API, no authentication required.

**API Contract (Example Call):**  
```
GET https://api.open-meteo.com/v1/forecast?latitude=50.4501&longitude=30.5234&current_weather=true
```

**API Response (Excerpt):**  
```json
{
  "latitude": 50.45,
  "longitude": 30.5234,
  "generationtime_ms": 0.245,
  "utc_offset_seconds": 0,
  "timezone": "GMT",
  "current_weather": {
    "temperature": 18.3,
    "windspeed": 5.1,
    "winddirection": 210,
    "weathercode": 3,
    "time": "2025-10-02T14:00"
  }
}
```

**Dependencies:**  
- Internet connectivity.
- Open-Meteo API availability.
- Browser support for Fetch API and ES6 syntax.

---

✅ **End of Document**

