const map = L.map('map').setView([49.1951, 20.0711], 8); // Centered on Slovakia

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

async function loadHelpRequests() {
  try {
    const response = await fetch('/api/help-requests');
    if (!response.ok) {
      throw new Error('Failed to load help requests');
    }
    const data = await response.json();
    displayHelpRequests(data.helpRequests);
  } catch (error) {
    console.error('Error loading help requests:', error);
    alert('Chyba pri načítaní žiadostí o pomoc.');
  }
}

function displayHelpRequests(requests) {
  requests.forEach(request => {
    const marker = L.marker([request.lat, request.lon]).addTo(map);
    const popupContent = `
      <div class="marker-popup">
        <p><strong>ID:</strong> ${request.id}</p>
        <p><strong>Čas:</strong> ${new Date(request.timestamp).toLocaleString('sk-SK')}</p>
        <button class="delete-btn" onclick="deleteHelpRequest(${request.id})">Vymazať</button>
      </div>
    `;
    marker.bindPopup(popupContent);
  });
}

async function deleteHelpRequest(id) {
  if (!confirm('Naozaj chcete vymazať túto žiadosť o pomoc?')) {
    return;
  }
  try {
    const response = await fetch(`/api/help-request/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete help request');
    }
    alert('Žiadosť o pomoc bola vymazaná.');
    location.reload(); // Reload to update map
  } catch (error) {
    console.error('Error deleting help request:', error);
    alert('Chyba pri vymazávaní žiadosti o pomoc.');
  }
}

loadHelpRequests();