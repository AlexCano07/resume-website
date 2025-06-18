<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matrix Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <style>
        :root {
          --primary-color: #00ff99;
          --bg-color: #0f0f0f;
          --text-color: #00ff99;
          --border-color: #00ff99;
          --hover-bg: #00ff99;
          --hover-text: #0f0f0f;
          --transition-speed: 0.3s;
        }

        [data-theme="light"] {
          --primary-color: #0066cc;
          --bg-color: #f0f0f0;
          --text-color: #0066cc;
          --border-color: #0066cc;
          --hover-bg: #0066cc;
          --hover-text: #f0f0f0;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background-color: #0f0f0f !important;
          color: #00ff99 !important;
          font-family: 'Press Start 2P', monospace;
          overflow: hidden;
          line-height: 1.6;
          font-size: 12px;
          transition: background-color var(--transition-speed), color var(--transition-speed);
        }

        /* Responsive font sizing */
        @media (min-width: 768px) {
          body { font-size: 14px; }
        }

        @media (min-width: 1024px) {
          body { font-size: 16px; }
        }

        /* Matrix rain canvas - positioned behind main content but visible */
        .matrix-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          opacity: 1 !important;
          pointer-events: none;
          background: #0f0f0f;
        }

        .screen {
          padding: 1rem;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          transition: opacity var(--transition-speed);
          z-index: 10;
          background: transparent; /* Completely transparent to show matrix */
        }

        /* Reduce matrix opacity when transitioning sections */
        .screen.transitioning .matrix-canvas {
          opacity: 0.2;
        }

        @media (min-width: 768px) {
          .screen { padding: 2rem; }
        }

        /* Boot text with animated cursor */
        .boot {
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          max-width: 300px;
          text-align: center;
          margin-bottom: 1rem;
          position: relative;
          min-height: 1.5em;
          z-index: 20;
          background-color: rgba(15, 15, 15, 0.8);
          padding: 0.5rem;
          border-radius: 4px;
        }

        /* Blinking cursor effect */
        .boot::after {
          content: '';
          position: absolute;
          width: 0.1em;
          height: 1em;
          background-color: var(--primary-color);
          animation: blink 1s steps(2, start) infinite;
          margin-left: 2px;
        }

        @media (min-width: 768px) {
          .boot {
            max-width: none;
          }
        }

        @keyframes blink {
          from, to { opacity: 0; }
          50% { opacity: 1; }
        }

        nav {
          margin-top: 1rem;
          width: 100%;
          max-width: 300px;
          z-index: 20;
          position: relative;
        }

        @media (min-width: 768px) {
          nav {
            margin-top: 2rem;
            max-width: none;
          }
        }

        nav a {
          display: block;
          margin: 0.5rem 0;
          color: var(--text-color);
          text-decoration: none;
          font-size: 0.8em;
          border: 1px solid var(--border-color);
          padding: 0.5rem 1rem;
          transition: all var(--transition-speed);
          text-align: center;
          cursor: pointer;
          position: relative;
          outline: none;
          background-color: rgba(15, 15, 15, 0.8);
        }

        @media (min-width: 768px) {
          nav a {
            margin: 1rem 0;
            font-size: 1em;
          }
        }

        nav a:hover,
        nav a:focus {
          background-color: var(--hover-bg);
          color: var(--hover-text);
          transform: scale(1.02);
        }

        nav a:focus {
          box-shadow: 0 0 0 2px var(--primary-color);
        }

        nav a:active {
          transform: scale(0.98);
        }

        .controls {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 1000;
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .control-btn {
          background: rgba(15, 15, 15, 0.9);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          padding: 0.25rem 0.5rem;
          font-family: inherit;
          font-size: 0.6em;
          cursor: pointer;
          transition: all var(--transition-speed);
        }

        .control-btn:hover,
        .control-btn:focus {
          background-color: var(--hover-bg);
          color: var(--hover-text);
        }

        section {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 15, 15, 0.95) !important;
          padding: 1rem;
          overflow-y: auto;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          transition: all var(--transition-speed) ease-out;
          pointer-events: none;
          z-index: 10;
        }

        @media (min-width: 768px) {
          section { padding: 2rem; }
        }

        section.active {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }

        section h1 {
          color: var(--primary-color);
          margin-bottom: 1rem;
          font-size: 1.2em;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.5rem;
          min-height: 1.8em;
        }

        @media (min-width: 768px) {
          section h1 { font-size: 1.5em; }
        }

        section p, section li {
          line-height: 1.8;
          margin-bottom: 1rem;
          font-size: 0.8em;
        }

        @media (min-width: 768px) {
          section p, section li { font-size: 1em; }
        }

        section ul {
          list-style: none;
          padding: 0;
        }

        section li::before {
          content: '> ';
          color: var(--primary-color);
        }

        .back-btn {
          position: fixed;
          bottom: 1rem;
          left: 1rem;
          background: rgba(15, 15, 15, 0.9);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          padding: 0.5rem 1rem;
          font-family: inherit;
          font-size: 0.7em;
          cursor: pointer;
          transition: all var(--transition-speed);
          z-index: 100;
        }

        .back-btn:hover,
        .back-btn:focus {
          background-color: var(--hover-bg);
          color: var(--hover-text);
        }

        .keyboard-hint {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          font-size: 0.5em;
          opacity: 0.7;
          z-index: 100;
        }

        @media (min-width: 768px) {
          .keyboard-hint { font-size: 0.6em; }
        }

        /* Loading animation */
        .loading {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--transition-speed);
        }

        .loading.show {
          opacity: 1;
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          :root {
            --primary-color: #ffffff;
            --bg-color: #000000;
            --text-color: #ffffff;
            --border-color: #ffffff;
          }
        }

        /* Focus indicators for keyboard navigation and accessibility */
        .screen:focus-within nav a:focus {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }

        /* Make section headings focusable for accessibility */
        section h1[tabindex="-1"]:focus {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }

        /* About section styling */
        .about-wrapper {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .pixel-avatar {
          width: 120px;
          height: auto;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
          border: 2px solid var(--border-color);
          border-radius: 4px;
          transition: all var(--transition-speed);
          flex-shrink: 0;
        }

        .pixel-avatar:hover {
          transform: scale(1.05);
          border-color: var(--primary-color);
          filter: brightness(1.1);
        }

        @media (min-width: 768px) {
          .pixel-avatar {
            width: 150px;
          }
          
          .about-wrapper {
            gap: 2rem;
          }
        }

        @media (max-width: 600px) {
          .about-wrapper {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .pixel-avatar {
            width: 100px;
          }
        }

        /* Error message styling */
        .error {
          color: #ff4444;
          font-size: 0.7em;
          margin-top: 1rem;
          opacity: 0;
          transition: opacity var(--transition-speed);
        }

        .error.show {
          opacity: 1;
        }

        /* Mobile-specific adjustments */
        @media (max-width: 767px) {
          .controls {
            top: 0.5rem;
            right: 0.5rem;
          }
          
          .back-btn {
            bottom: 0.5rem;
            left: 0.5rem;
            font-size: 0.6em;
            padding: 0.4rem 0.8rem;
          }
          
          .keyboard-hint {
            display: none;
          }
        }

        /* Print styles */
        @media print {
          body { 
            background: white; 
            color: black; 
            font-size: 12pt;
          }
          .controls, .back-btn, .keyboard-hint { 
            display: none; 
          }
          section { 
            position: static; 
            opacity: 1; 
            transform: none; 
            height: auto; 
            page-break-after: always; 
          }
        }
    </style>
</head>
<body>
    <!-- Matrix Rain Canvas -->
    <canvas class="matrix-canvas" id="matrixCanvas"></canvas>

    <!-- Main Screen -->
    <div class="screen" id="mainScreen">
        <div class="boot" id="bootText"></div>
        <div id="portfolioTitle" style="display: none; color: var(--primary-color); font-size: 1.8em; margin-bottom: 1.5rem; text-align: center; z-index: 20; position: relative;">Alex Cano Portfolio</div>
        <nav id="mainNav" style="display: none;">
            <a href="#" onclick="showSection('about')">About</a>
            <a href="#" onclick="showSection('projects')">Projects</a>
            <a href="#" onclick="showSection('skills')">Skills</a>
            <a href="#" onclick="showSection('contact')">Contact</a>
        </nav>
    </div>

    <!-- Controls -->
    <div class="controls">
        <button class="control-btn" onclick="toggleTheme()">Toggle Theme</button>
        <button class="control-btn" onclick="toggleMatrix()">Toggle Matrix</button>
    </div>

    <!-- Sections -->
    <section id="about">
        <h1>About Me</h1>
        <div class="about-wrapper">
            <div>
                <p>Welcome to my digital realm. I'm a developer who believes in the power of clean code and innovative solutions.</p>
                <p>My journey began with curiosity about how things work and evolved into a passion for creating digital experiences that matter.</p>
                <p>When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or debugging the matrix.</p>
            </div>
        </div>
    </section>

    <section id="projects">
        <h1>Projects</h1>
        <p>Here are some of the projects I've worked on:</p>
        <ul>
            <li>Project Alpha - A revolutionary web application</li>
            <li>Matrix Dashboard - Real-time data visualization</li>
            <li>Code Compiler - Online IDE for multiple languages</li>
            <li>Digital Portfolio - This very website you're browsing</li>
        </ul>
    </section>

    <section id="skills">
        <h1>Skills</h1>
        <p>Technologies I work with:</p>
        <ul>
            <li>JavaScript / TypeScript</li>
            <li>React / Vue.js</li>
            <li>Node.js / Express</li>
            <li>Python / Django</li>
            <li>Database Design</li>
            <li>Cloud Architecture</li>
        </ul>
    </section>

    <section id="contact">
        <h1>Contact</h1>
        <p>Ready to connect? Reach out through these channels:</p>
        <ul>
            <li>Email: developer@matrix.com</li>
            <li>GitHub: @matrixdev</li>
            <li>LinkedIn: /in/matrixdeveloper</li>
            <li>Twitter: @matrixcoder</li>
        </ul>
    </section>

    <!-- Back Button -->
    <button class="back-btn" id="backBtn" onclick="showMain()" style="display: none;">Back to Main</button>

    <!-- Keyboard Hint -->
    <div class="keyboard-hint">Press ESC to return</div>

    <script>
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
            'LOADING NEURAL NETWORK...',
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
    </script>
</body>
</html>
