/* Typing Animation Styles */
.typing-cursor::after {
  content: '▋';
  color: #00ff99;
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Terminal-style lines */
.terminal-line {
  font-family: 'Courier New', monospace;
  color: #00ff99;
  margin: 4px 0;
  opacity: 0;
  animation: fadeIn 0.3s ease-in forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Boot sequence container */
#bootContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 100;
}

/* Typing animation class for section content */
.type-animate {
  opacity: 0;
}

/* Enhanced boot text styling */
#bootText {
  font-family: 'Courier New', monospace;
  color: #00ff99;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(0, 255, 153, 0.5);
}

/* Main interface fade-in */
.main-interface {
  opacity: 0;
  transition: opacity 1s ease-in;
}

/* Section titles with typing effect */
section h1 {
  font-family: 'Courier New', monospace;
  color: #00ff99;
  text-shadow: 0 0 10px rgba(0, 255, 153, 0.3);
}

/* Loading screen enhancements */
#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

#loading.show {
  opacity: 1;
  visibility: visible;
}

#loading::after {
  content: 'Loading...';
  color: #00ff99;
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Matrix canvas positioning */
#matrixCanvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  pointer-events: none;
}

/* Button styling */
button {
  background: transparent;
  border: 2px solid #00ff99;
  color: #00ff99;
  padding: 10px 20px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 5px;
}

button:hover {
  background: #00ff99;
  color: #000;
  box-shadow: 0 0 15px rgba(0, 255, 153, 0.5);
}

/* Navigation styling */
nav a {
  color: #00ff99;
  text-decoration: none;
  font-family: 'Courier New', monospace;
  padding: 10px 15px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  display: inline-block;
  margin: 5px;
}

nav a:hover {
  border-color: #00ff99;
  background: rgba(0, 255, 153, 0.1);
  box-shadow: 0 0 10px rgba(0, 255, 153, 0.3);
}
// Call it on DOM load or when screen initializes
document.addEventListener('DOMContentLoaded', () => {
  typeText('bootText', '>> Initializing Cano.exe', 75);
});
