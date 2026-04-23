const titleEl = document.getElementById('title');
const descriptionEl = document.getElementById('description');
const loginForm = document.getElementById('loginForm');
const usernameEl = document.getElementById('username');
const passwordEl = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const contentEl = document.getElementById('content');

loginBtn.addEventListener('click', async () => {
  const username = usernameEl.value.trim();
  const password = passwordEl.value.trim();
  if (!username || !password) {
    alert('Zadajte username a password');
    return;
  }
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.error);
      return;
    }
    loginForm.style.display = 'none';
    if (data.isAdmin) {
      showAdminPanel(data.profiles);
    } else {
      showUserContent(data.text);
    }
  } catch (error) {
    console.error(error);
    alert('Chyba pri prihlasovaní');
  }
});

function showAdminPanel(profiles) {
  contentEl.innerHTML = '<h2>Admin Panel</h2>';
  profiles.forEach(profile => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${profile.username}</h3>
      <p>Heslo: ${profile.password}</p>
      <textarea id="text-${profile.username}" placeholder="Zadajte text"></textarea>
      <button onclick="updateProfile('${profile.username}')">Uložiť</button>
    `;
    contentEl.appendChild(div);
  });
  contentEl.style.display = 'block';
}

function showUserContent(text) {
  contentEl.innerHTML = `<h2>Robo Grigorov</h2><p>${text || 'Žiadny text nie je nastavený.'}</p>`;
  contentEl.style.display = 'block';
}

async function updateProfile(username) {
  const text = document.getElementById(`text-${username}`).value;
  try {
    const response = await fetch(`/api/profile/${username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (response.ok) {
      alert('Aktualizované');
    } else {
      alert('Chyba');
    }
  } catch (error) {
    console.error(error);
    alert('Chyba pri aktualizácii');
  }
}