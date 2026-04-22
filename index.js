const express = require("express");
const https = require("https");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();
const app = express();

const port = process.env.PORT || 3000;
const maxRadiusMeters = Number(process.env.MAX_RADIUS_METERS || 5000);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS help_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lat REAL,
    lon REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/nearest-hospital", async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return res.status(400).json({ error: "Query parameters lat and lon are required." });
  }

  try {
    const response = await fetchNearestHospitals(lat, lon);
    if (!response.elements || response.elements.length === 0) {
      return res.status(404).json({ error: "Nebola nájdená žiadna nemocnica v okolí." });
    }

    const nearest = findNearestHospital(lat, lon, response.elements);
    if (!nearest) {
      return res.status(404).json({ error: "Nebola nájdená žiadna nemocnica s platnou polohou." });
    }

    res.json({ nearestHospital: nearest, count: response.elements.length });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: "Chyba pri získavaní údajov z Overpass API." });
  }
});

app.post('/api/help-request', (req, res) => {
  const { lat, lon } = req.body;
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return res.status(400).json({ error: 'lat and lon must be numbers' });
  }
  db.run('INSERT INTO help_requests (lat, lon) VALUES (?, ?)', [lat, lon], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ id: this.lastID, message: 'Help request saved' });
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

function fetchNearestHospitals(lat, lon) {
  const query = `
[out:json][timeout:25];
(
  node["amenity"="hospital"](around:${maxRadiusMeters},${lat},${lon});
  way["amenity"="hospital"](around:${maxRadiusMeters},${lat},${lon});
  relation["amenity"="hospital"](around:${maxRadiusMeters},${lat},${lon});
);
out center tags;
`;

  const postData = `data=${encodeURIComponent(query)}`;
  const options = {
    method: "POST",
    hostname: "overpass-api.de",
    path: "/api/interpreter",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
      "User-Agent": "JehlickaWeb/1.0 (+https://github.com/Miro1002/JehlickaWeb)",
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let body = "";

      response.on("data", (chunk) => {
        body += chunk;
      });

      response.on("end", () => {
        if (response.statusCode && response.statusCode >= 400) {
          return reject(new Error(`Overpass API error ${response.statusCode}`));
        }

        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on("error", reject);
    request.write(postData);
    request.end();
  });
}

function findNearestHospital(lat, lon, elements) {
  const hospitals = elements
    .map((element) => {
      const position = element.type === "node"
        ? { lat: element.lat, lon: element.lon }
        : element.center
          ? { lat: element.center.lat, lon: element.center.lon }
          : null;

      if (!position) {
        return null;
      }

      const distance = getDistance(lat, lon, position.lat, position.lon);
      return {
        name: element.tags?.name || "Nemocnica",
        address: buildAddress(element.tags),
        lat: position.lat,
        lon: position.lon,
        distance,
        type: element.tags?.amenity || element.type,
      };
    })
    .filter(Boolean);

  return hospitals.sort((a, b) => a.distance - b.distance)[0] || null;
}

function buildAddress(tags = {}) {
  const parts = [tags["addr:street"], tags["addr:housenumber"], tags["addr:city"], tags["addr:postcode"]];
  return parts.filter(Boolean).join(", ");
}

function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
