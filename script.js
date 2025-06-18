// Application state
let currentSection = null;
let soundEnabled = true;
let currentTheme = 'dark';
let navigationIndex = 0;
const sections = ['about', 'skills', 'projects', 'contact'];

// Matrix rain variables
let matrixCanvas = null;
let matrixCtx = null;
let matrixColumns = [];
let matrixAnimationId = null;
let matrixInitialized = false;

// Audio context for sound effects
let audioContext = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupKeyboardNavigation();
  setupAccessibility();
  initializeMatrix();
  setupClickHandlers();
});

function initializeApp() {
  try {
    document.addEventListener('click', initAudioContext, { once: true });
    document.addEventListener('keydown', initAudioContext, { once: true });

    setTimeout(() => {
      const bootText = document.getElementById('bootText');
      if (bootText) {
        bootText.classList.add('typing');
      }
    }, 500);

    preloadSections();
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

function initAudioContext() {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context failed:', error);
    }
  }
}

function playSound(frequency = 800, duration = 100, type = 'sine') {
  if (!soundEnabled || !audioContext) return;
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    console.warn('Sound error:', error);
  }
}

function showSection(sectionId) {
  try {
    if (!sections.includes(sectionId) || currentSection === sectionId) return;
    showLoading();
    playSound(600, 150);
    document.getElementById('mainScreen').style.opacity = '0';
    stopMatrixAnimation();
    setTimeout(() => {
      document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add('active');
        targetSection.setAttribute('aria-hidden', 'false');
        targetSection.querySelector('h1').focus();
      }
      currentSection = sectionId;
      navigationIndex = sections.indexOf(sectionId);
      document.getElementById('backBtn').style.display = 'block';
      hideLoading();
      updateURL(sectionId);
    }, 200);
  } catch (error) {
    console.error('Section display error:', error);
    hideLoading();
  }
}

function initializeMatrix() {
  try {
    matrixCanvas = document.getElementById('matrixCanvas');
    matrixCtx = matrixCanvas.getContext('2d');
    resizeMatrixCanvas();
    setupMatrixColumns();
    startMatrixAnimation();
    window.addEventListener('resize', debounce(resizeMatrixCanvas, 250));
    matrixInitialized = true;
  } catch (error) {
    console.error('Matrix init error:', error);
  }
}

function resizeMatrixCanvas() {
  if (!matrixCanvas || !matrixCtx) return;
  const rect = matrixCanvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  matrixCanvas.width = rect.width * ratio;
  matrixCanvas.height = rect.height * ratio;
  matrixCtx.scale(ratio, ratio);
  setupMatrixColumns();
}

function setupMatrixColumns() {
  const fontSize = 14;
  const columnWidth = fontSize * 0.8;
  const numColumns = Math.floor(matrixCanvas.width / columnWidth);
  matrixColumns = [];
  for (let i = 0; i < numColumns; i++) {
    matrixColumns[i] = {
      x: i * columnWidth,
      y: Math.random() * -matrixCanvas.height,
      speed: Math.random() * 3 + 1,
      length: Math.random() * 20 + 5,
      characters: [],
      fontSize: fontSize,
      opacity: Math.random() * 0.5 + 0.3
    };
  }
}

function startMatrixAnimation() {
  if (!matrixInitialized || !matrixCtx) return;
  if (matrixAnimationId) cancelAnimationFrame(matrixAnimationId);
  matrixAnimationId = requestAnimationFrame(animateMatrix);
}

function stopMatrixAnimation() {
  if (matrixAnimationId) {
    cancelAnimationFrame(matrixAnimationId);
    matrixAnimationId = null;
  }
}

function animateMatrix() {
  matrixCtx.fillStyle = 'rgba(15, 15, 15, 0.1)';
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  matrixColumns.forEach(column => {
    updateMatrixColumn(column);
    renderMatrixColumn(column);
  });
  matrixAnimationId = requestAnimationFrame(animateMatrix);
}

function updateMatrixColumn(column) {
  column.y += column.speed;
  if (column.y > matrixCanvas.height + column.length * column.fontSize) {
    column.y = Math.random() * -200 - 100;
  }
  updateColumnCharacters(column);
}

function updateColumnCharacters(column) {
  const chars = 'アイウエオカキクケコ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (column.characters.length === 0 || Math.random() > 0.7) {
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    column.characters.unshift({ char: randomChar, brightness: 1.0 });
  }
  column.characters = column.characters
    .map(c => ({ ...c, brightness: c.brightness * 0.95 }))
    .filter(c => c.brightness > 0.1)
    .slice(0, column.length);
}

function renderMatrixColumn(column) {
  matrixCtx.font = `${column.fontSize}px monospace`;
  column.characters.forEach((c, i) => {
    const y = column.y + i * column.fontSize;
    matrixCtx.fillStyle = `rgba(0, 255, 153, ${c.brightness * column.opacity})`;
    matrixCtx.fillText(c.char, column.x, y);
  });
}

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function goHome() {
  playSound(500, 150);
  showLoading();
  setTimeout(() => {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('mainScreen').style.opacity = '1';
    document.getElementById('backBtn').style.display = 'none';
    currentSection = null;
    hideLoading();
  }, 200);
}

function showLoading() {
  document.getElementById('loading').classList.add('show');
}

function hideLoading() {
  document.getElementById('loading').classList.remove('show');
}

function updateURL(sectionId) {
  history.replaceState(null, '', `#${sectionId}`);
}

function setupClickHandlers() {
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });
  document.getElementById('backBtn').addEventListener('click', goHome);
}

function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') goHome();
  });
}

function setupAccessibility() {
  document.querySelectorAll('section').forEach(section => {
    section.setAttribute('aria-hidden', 'true');
  });
}
