// ---------------------
// Application State
// ---------------------
let currentSection = null;
let soundEnabled = true;
let currentTheme = 'dark';
let navigationIndex = 0;
const sections = ['about', 'skills', 'projects', 'contact'];

// ---------------------
// Matrix Rain Variables
// ---------------------
let matrixCanvas = null;
let matrixCtx = null;
let matrixColumns = [];
let matrixAnimationId = null;
let matrixInitialized = false;

// ---------------------
// Audio Setup
// ---------------------
let audioContext = null;

// ---------------------
// App Initialization
// ---------------------
document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
  setupKeyboardNavigation();
  setupAccessibility();
  initializeMatrix();
  setupClickHandlers();
});

function initializeApp() {
  try {
    // Initialize audio context on first user interaction
    document.addEventListener('click', initAudioContext, { once: true });
    document.addEventListener('keydown', initAudioContext, { once: true });

    // Start boot text animation
    setTimeout(() => {
      const bootText = document.getElementById('bootText');
      if (bootText) {
        bootText.classList.add('typing');
      }
    }, 500);
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

// ---------------------
// Sound Effects
// ---------------------
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

// ---------------------
// UI Toggle Functions
// ---------------------
function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('soundBtn');
  if (btn) {
    btn.textContent = `Sound: ${soundEnabled ? 'ON' : 'OFF'}`;
  }
  playSound(soundEnabled ? 800 : 400, 100);
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  playSound(600, 150);
}

// ---------------------
// Section Navigation
// ---------------------
function showSection(sectionId) {
  try {
    if (!sections.includes(sectionId) || currentSection === sectionId) return;
    
    showLoading();
    playSound(600, 150);
    
    // Hide main screen
    const mainScreen = document.getElementById('mainScreen');
    if (mainScreen) {
      mainScreen.style.opacity = '0';
    }
    
    stopMatrixAnimation();

    setTimeout(() => {
      // Hide all sections
      document.querySelectorAll('section').forEach(sec => {
        sec.classList.remove('active');
        sec.setAttribute('aria-hidden', 'true');
      });
      
      // Show target section
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add('active');
        targetSection.setAttribute('aria-hidden', 'false');
        
        // Focus on section title for accessibility
        const heading = targetSection.querySelector('h1');
        if (heading) {
          heading.focus();
        }
      }
      
      currentSection = sectionId;
      navigationIndex = sections.indexOf(sectionId);
      
      // Show back button
      const backBtn = document.getElementById('backBtn');
      if (backBtn) {
        backBtn.style.display = 'block';
      }
      
      hideLoading();
      updateURL(sectionId);
    }, 200);
  } catch (error) {
    console.error('Section display error:', error);
    hideLoading();
  }
}

function goHome() {
  playSound(500, 150);
  showLoading();
  
  setTimeout(() => {
    // Hide all sections
    document.querySelectorAll('section').forEach(sec => {
      sec.classList.remove('active');
      sec.setAttribute('aria-hidden', 'true');
    });
    
    // Show main screen
    const mainScreen = document.getElementById('mainScreen');
    if (mainScreen) {
      mainScreen.style.opacity = '1';
    }
    
    // Hide back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.style.display = 'none';
    }
    
    currentSection = null;
    navigationIndex = 0;
    
    // Restart matrix animation
    startMatrixAnimation();
    
    hideLoading();
    updateURL('');
  }, 200);
}

// ---------------------
// Loading States
// ---------------------
function showLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.classList.add('show');
  }
}

function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.classList.remove('show');
  }
}

// ---------------------
// URL Management
// ---------------------
function updateURL(sectionId) {
  const url = sectionId ? `#${sectionId}` : '#';
  history.replaceState(null, '', url);
}

// ---------------------
// Matrix Rain Animation
// ---------------------
function initializeMatrix() {
  try {
    matrixCanvas = document.getElementById('matrixCanvas');
    if (!matrixCanvas) return;
    
    matrixCtx = matrixCanvas.getContext('2d');
    if (!matrixCtx) return;

    resizeMatrixCanvas();
    setupMatrixColumns();
    startMatrixAnimation();

    // Handle window resize
    window.addEventListener('resize', debounce(resizeMatrixCanvas, 250));
    matrixInitialized = true;
  } catch (error) {
    console.error('Matrix initialization error:', error);
  }
}

function resizeMatrixCanvas() {
  if (!matrixCanvas || !matrixCtx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = window.devicePixelRatio || 1;

  matrixCanvas.width = width * ratio;
  matrixCanvas.height = height * ratio;
  matrixCanvas.style.width = width + 'px';
  matrixCanvas.style.height = height + 'px';

  // Reset transform and apply pixel ratio scaling
  matrixCtx.setTransform(1, 0, 0, 1, 0, 0);
  matrixCtx.scale(ratio, ratio);

  setupMatrixColumns();
}

function setupMatrixColumns() {
  if (!matrixCanvas) return;
  
  const fontSize = 14;
  const columnWidth = fontSize * 0.8;
  const numColumns = Math.floor(matrixCanvas.width / (window.devicePixelRatio || 1) / columnWidth);
  
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
  
  if (matrixAnimationId) {
    cancelAnimationFrame(matrixAnimationId);
  }
  
  matrixAnimationId = requestAnimationFrame(animateMatrix);
}

function stopMatrixAnimation() {
  if (matrixAnimationId) {
    cancelAnimationFrame(matrixAnimationId);
    matrixAnimationId = null;
  }
}

function animateMatrix() {
  if (!matrixCtx || !matrixCanvas) return;
  
  // Clear canvas with fade effect
  matrixCtx.fillStyle = 'rgba(15, 15, 15, 0.1)';
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  
  // Update and render each column
  matrixColumns.forEach(column => {
    updateMatrixColumn(column);
    renderMatrixColumn(column);
  });
  
  matrixAnimationId = requestAnimationFrame(animateMatrix);
}

function updateMatrixColumn(column) {
  // Move column down
  column.y += column.speed;
  
  // Reset column when it goes off screen
  if (column.y > matrixCanvas.height + column.length * column.fontSize) {
    column.y = Math.random() * -200 - 100;
    column.speed = Math.random() * 3 + 1;
    column.opacity = Math.random() * 0.5 + 0.3;
  }
  
  updateColumnCharacters(column);
}

function updateColumnCharacters(column) {
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // Add new character occasionally
  if (column.characters.length === 0 || Math.random() > 0.85) {
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    column.characters.unshift({ 
      char: randomChar, 
      brightness: 1.0 
    });
  }
  
  // Update character brightness and remove dim ones
  column.characters = column.characters
    .map(c => ({ ...c, brightness: c.brightness * 0.95 }))
    .filter(c => c.brightness > 0.1)
    .slice(0, column.length);
}

function renderMatrixColumn(column) {
  if (!matrixCtx) return;
  
  matrixCtx.font = `${column.fontSize}px 'Courier New', monospace`;
  
  column.characters.forEach((char, i) => {
    const y = column.y + i * column.fontSize;
    
    // Skip if character is off screen
    if (y < 0 || y > matrixCanvas.height) return;
    
    // Brightest character at the front
    const alpha = i === 0 ? char.brightness : char.brightness * 0.7;
    matrixCtx.fillStyle = `rgba(0, 255, 153, ${alpha * column.opacity})`;
    matrixCtx.fillText(char.char, column.x, y);
  });
}

// ---------------------
// Event Handlers
// ---------------------
function setupClickHandlers() {
  // Navigation links
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      if (sectionId) {
        showSection(sectionId);
      }
    });
  });
  
  // Back button
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', goHome);
  }
  
  // Sound toggle button
  const soundBtn = document.getElementById('soundBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', toggleSound);
  }
  
  // Theme toggle button
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
}

function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Escape':
        goHome();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        if (currentSection) {
          e.preventDefault();
          navigateSection(-1);
        }
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        if (currentSection) {
          e.preventDefault();
          navigateSection(1);
        }
        break;
    }
  });
}

function navigateSection(direction) {
  const currentIndex = sections.indexOf(currentSection);
  let newIndex = currentIndex + direction;
  
  // Wrap around
  if (newIndex < 0) newIndex = sections.length - 1;
  if (newIndex >= sections.length) newIndex = 0;
  
  showSection(sections[newIndex]);
}

function setupAccessibility() {
  // Set initial ARIA states
  document.querySelectorAll('section').forEach(section => {
    section.setAttribute('aria-hidden', 'true');
  });
  
  // Add skip link functionality
  const skipLinks = document.querySelectorAll('a[href^="#"]');
  skipLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.focus();
      }
    });
  });
}

// ---------------------
// Utility Functions
// ---------------------
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ---------------------
// Initialize on Hash Change
// ---------------------
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.substring(1);
  if (hash && sections.includes(hash)) {
    showSection(hash);
  } else if (!hash) {
    goHome();
  }
});

// Initialize based on current hash on load
window.addEventListener('load', () => {
  const hash = window.location.hash.substring(1);
  if (hash && sections.includes(hash)) {
    setTimeout(() => showSection(hash), 100);
  }
});
