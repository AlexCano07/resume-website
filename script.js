// Matrix Rain Animation
let matrixEnabled = true;
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Matrix characters
const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

// Initialize drops
for (let i = 0; i < columns; i++) {
  drops[i] = 1;
}

function drawMatrix() {
  if (!matrixEnabled) return;

  // Semi-transparent black background to create trail effect
  ctx.fillStyle = 'rgba(15, 15, 15, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Matrix text
  ctx.fillStyle = '#00ff99';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

// Start matrix animation
let matrixInterval = setInterval(drawMatrix, 35);

// Boot sequence
const bootMessages = [
  '>> Initializing Alex_Cano.exe',
  'CONNECTING TO MATRIX...',
  'SYSTEM READY.'
];

let currentMessage = 0;
let currentChar = 0;
const bootElement = document.getElementById('bootText');
const navElement = document.getElementById('mainNav');

function typeBootMessage() {
  if (currentMessage < bootMessages.length) {
    if (currentChar < bootMessages[currentMessage].length) {
      bootElement.textContent = bootMessages[currentMessage].substring(0, currentChar + 1);
      currentChar++;
      setTimeout(typeBootMessage, 50);
    } else {
      setTimeout(() => {
        currentMessage++;
        currentChar = 0;
        if (currentMessage < bootMessages.length) {
          bootElement.textContent = '';
          setTimeout(typeBootMessage, 500);
        } else {
          setTimeout(() => {
            bootElement.style.display = 'none';
            document.getElementById('portfolioTitle').style.display = 'block';
            navElement.style.display = 'block';
            navElement.style.animation = 'fadeIn 1s ease-in';
          }, 1000);
        }
      }, 1000);
    }
  }
}

// Start boot sequence
setTimeout(typeBootMessage, 1000);

// Navigation functions
function showSection(sectionId) {
  document.getElementById('mainScreen').style.display = 'none';
  document.getElementById('backBtn').style.display = 'block';
  
  // Hide all sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => section.classList.remove('active'));
  
  // Show selected section
  const targetSection = document.getElementById(sectionId);
  targetSection.classList.add('active');
  
  // Type out the heading
  typeHeading(targetSection.querySelector('h1'));
}

function showMain() {
  document.getElementById('mainScreen').style.display = 'flex';
  document.getElementById('backBtn').style.display = 'none';
  
  // Hide all sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => section.classList.remove('active'));
}

function typeHeading(element) {
  const text = element.textContent;
  element.textContent = '';
  let i = 0;
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, 100);
    }
  }
  
  setTimeout(type, 300);
}

// Theme toggle
function toggleTheme() {
  const body = document.body;
  const isLight = body.getAttribute('data-theme') === 'light';
  body.setAttribute('data-theme', isLight ? 'dark' : 'light');
}

// Matrix toggle
function toggleMatrix() {
  matrixEnabled = !matrixEnabled;
  if (!matrixEnabled) {
    ctx.fillStyle = 'rgba(15, 15, 15, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    showMain();
  }
});

// Add fade in animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
