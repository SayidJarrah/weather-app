# Simple Weather Dashboard

A lightweight static web page that fetches current temperatures (°C) for Kyiv, Singapore, London, and Sydney using the free Open-Meteo API.

## Features
- Client-side implementation with vanilla HTML, CSS, and JavaScript
- Shows loading state while fetching data
- Displays "Data unavailable" when the API call fails
- Rounded Celsius temperature display per city

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   ```
2. Serve the files locally (pick one):
   ```bash
   # Option 1: use any static server
   npx serve .

   # Option 2: Python 3 built-in server
   python3 -m http.server 5173
   ```
3. Open `http://localhost:5173/` (or whatever port your server provides) in your browser.

## Deployment
This project is optimized for static hosting. You can deploy the contents of the repository to any static host (e.g., GitHub Pages, Netlify, Vercel).

## Roadmap
- Configure CI pipeline with automated checks
- Package static assets as a deployable artifact
- Set up automated deployment to a free hosting provider

## Continuous Integration
A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on pushes and pull requests to main and feature branches. The job:
- Lints the HTML via `npm run test` (powered by `htmlhint` through `npx`).
- Builds static assets into `dist/` using a small Node script (`scripts/build.mjs`).
- Uploads the built `dist/` directory as an artifact.
- Builds an Nginx-based Docker image and stores it as a compressed artifact for download.
- When changes land on `main`, the workflow also publishes the latest `dist/` output to GitHub Pages.

## Deployment
The site is automatically deployed to GitHub Pages from `main`. After a successful pipeline run, the latest build is available at:

https://sayidjarrah.github.io/weather-app/
