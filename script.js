/* ----- Variables ----- */
let currentSection = null;
let soundEnabled = true;
let currentTheme = 'dark';
const sections = ['about', 'skills', 'projects', 'contact'];

/* ----- Initialization ----- */
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  initializeMatrix();
});

/* ----- Event Listeners ----- */
function setupEventListeners() {
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('soundToggle').addEventListener('click', toggleSound);
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(e.currentTarget.getAttribute('data-section'));
    });
  });
  document.getElementById('backBtn').addEventListener('click', goHome);
}

/* ----- Section Navigation ----- */
function showSection(sectionId) {
  if (!sections.includes(sectionId)) return;

  document.getElementById('mainScreen').style.opacity = '0';
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  
  const target = document.getElementById(sectionId);
  target.classList.add('active');

  document.getElementById('backBtn').style.display = 'block';
  currentSection = sectionId;
}

/* ----- Home Button ----- */
function goHome() {
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  document.getElementById('mainScreen').style.opacity = '1';
  document.getElementById('backBtn').style.display = 'none';
  currentSection = null;
}

/* ----- Theme and Sound Toggles ----- */
function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  document.getElementById('soundToggle').textContent = `Sound: ${soundEnabled ? 'ON' : 'OFF'}`;
}

/* ----- Matrix Effect ----- */
function initializeMatrix() {
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const letters = 'アイウエオカキクケコ0123456789';
  const fontSize = 16;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = `${fontSize}px monospace`;

    drops.forEach((y, i) => {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i * fontSize, y * fontSize);

      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  setInterval(draw, 33);
}

/* ----- Accessibility: keyboard navigation (optional) ----- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') goHome();
});
