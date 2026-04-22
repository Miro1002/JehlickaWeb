const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const refreshButton = document.getElementById("refreshButton");

async function fetchNearestHospital(lat, lon) {
  const response = await fetch(`/api/nearest-hospital?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || response.statusText);
  }
  return response.json();
}

function showResult(hospital) {
  resultEl.innerHTML = `
    <h2>${hospital.name}</h2>
    <p class="address">${hospital.address || "Adresa nie je k dispozícii."}</p>
    <p>Vzdialenosť: <strong>${hospital.distance.toFixed(0)} m</strong></p>
    <p>Typ: <strong>${hospital.type}</strong></p>
    <a class="link" target="_blank" rel="noopener noreferrer" href="https://www.openstreetmap.org/?mlat=${hospital.lat}&mlon=${hospital.lon}#map=16/${hospital.lat}/${hospital.lon}">
      Otvoriť v OpenStreetMap
    </a>
  `;
  resultEl.classList.remove("hidden");
}

function showError(message) {
  statusEl.textContent = `Chyba: ${message}`;
  resultEl.classList.add("hidden");
}

function updateStatus(message) {
  statusEl.textContent = message;
}

async function findNearestHospital() {
  if (!navigator.geolocation) {
    showError("Prehliadač nepodporuje geolokáciu.");
    return;
  }

  updateStatus("Získavam vašu polohu...");
  resultEl.classList.add("hidden");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      updateStatus("Hľadám najbližšiu nemocnicu vo vašom okolí...");

      try {
        const data = await fetchNearestHospital(latitude, longitude);
        showResult(data.nearestHospital);
        updateStatus("Našiel som najbližšiu nemocnicu.");
      } catch (error) {
        showError(error.message);
      }
    },
    (error) => {
      showError(error.message || "Získanie polohy zlyhalo.");
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    }
  );
}

refreshButton.addEventListener("click", findNearestHospital);
findNearestHospital();
