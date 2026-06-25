// Portfolio Interaction Suite
// Author: Shreyash Shashikant Anawane (Enhanced by Antigravity AI)

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Core State & Toggles
    // -------------------------------------------------------------
    const state = {
        theme: localStorage.getItem('theme') || 'dark',
        mouse: { x: null, y: null, targetX: 0, targetY: 0 },
        terminalOpen: false
    };

    const themeToggleBtn = document.getElementById('theme-toggle');

    // Initialize Theme
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();

    // -------------------------------------------------------------
    // 2. Sound Effects Stub (Disabled)
    // -------------------------------------------------------------
    const soundEffects = {
        hover: () => {},
        click: () => {},
        success: () => {},
        error: () => {},
        synthClick: () => {},
        terminalKey: () => {},
        toggle: () => {}
    };

    // Initialize Theme Toggle Action
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', state.theme);
            localStorage.setItem('theme', state.theme);
            soundEffects.toggle();
            updateThemeIcon();
        });
    }

    function updateThemeIcon() {
        if (!themeToggleBtn) return;
        const sunIcon = themeToggleBtn.querySelector('.theme-sun');
        const moonIcon = themeToggleBtn.querySelector('.theme-moon');
        if (state.theme === 'light') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            themeToggleBtn.title = "Switch to Dark Mode";
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            themeToggleBtn.title = "Switch to Light Mode";
        }
    }

    // -------------------------------------------------------------
    // 3. Custom Cursor Following Mechanics
    // -------------------------------------------------------------
    const cursorDot = document.createElement('div');
    const cursorFollower = document.createElement('div');
    cursorDot.className = 'custom-cursor';
    cursorFollower.className = 'custom-cursor-follower';
    
    // Only append custom cursor on desktop devices
    if (window.matchMedia('(pointer: fine)').matches) {
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorFollower);

        let followerX = 0;
        let followerY = 0;

        window.addEventListener('mousemove', (e) => {
            state.mouse.x = e.clientX;
            state.mouse.y = e.clientY;
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
        });

        // Smooth cursor follower animation loop
        const animateCursor = () => {
            if (state.mouse.x !== null) {
                const dx = state.mouse.x - followerX;
                const dy = state.mouse.y - followerY;
                followerX += dx * 0.15;
                followerY += dy * 0.15;
                cursorFollower.style.left = `${followerX}px`;
                cursorFollower.style.top = `${followerY}px`;
            }
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Mouse hover effects
        const addHoverEffects = () => {
            const hoverables = document.querySelectorAll('a, button, .btn-icon, .timeline-card, .project-card, .terminal-button');
            hoverables.forEach(el => {
                if (el.dataset.cursorBound) return;
                el.dataset.cursorBound = 'true';
                
                el.addEventListener('mouseenter', () => {
                    cursorDot.classList.add('hover');
                    cursorFollower.classList.add('hover');
                });
                el.addEventListener('mouseleave', () => {
                    cursorDot.classList.remove('hover');
                    cursorFollower.classList.remove('hover');
                });
            });
        };
        addHoverEffects();
        // Hook hover updates to DOM changes
        const observer = new MutationObserver(addHoverEffects);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // -------------------------------------------------------------
    // 4. Interactive Particles Background Canvas
    // -------------------------------------------------------------
    const bgCanvas = document.getElementById('canvas-bg');
    if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        let particles = [];
        const maxParticles = 90;

        const resizeCanvas = () => {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * bgCanvas.width;
                this.y = Math.random() * bgCanvas.height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > bgCanvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > bgCanvas.height) this.vy *= -1;

                // Move slightly towards mouse if close
                if (state.mouse.x !== null) {
                    const dx = state.mouse.x - this.x;
                    const dy = state.mouse.y - this.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 180) {
                        this.x += dx * 0.005;
                        this.y += dy * 0.005;
                    }
                }
            }

            draw() {
                const themeCyan = getComputedStyle(document.documentElement).getPropertyValue('--accent-cyan').trim();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = themeCyan;
                ctx.globalAlpha = this.alpha;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        // Animation Loop
        const animateBg = () => {
            ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
            
            const themeCyan = getComputedStyle(document.documentElement).getPropertyValue('--accent-cyan').trim();
            const opacityMultiplier = state.theme === 'light' ? 0.08 : 0.18;

            // Connect particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = themeCyan;
                        ctx.globalAlpha = (1 - (dist / 110)) * opacityMultiplier;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateBg);
        };
        animateBg();
    }

    // -------------------------------------------------------------
    // 5. Scroll-linked Animations & Intersection Observer
    // -------------------------------------------------------------
    const animateOnScroll = () => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const scrollAnims = document.querySelectorAll('.timeline-item, .glass-panel, .project-card, .hero-content, .contact-card');
        scrollAnims.forEach(el => observer.observe(el));
    };
    animateOnScroll();

    // Timeline Vertical Path Fill on Scroll
    const updateTimelineFill = () => {
        const fillLine = document.querySelector('.timeline-line-fill');
        const container = document.querySelector('.timeline-container');
        if (!fillLine || !container) return;

        const containerRect = container.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.6;
        
        let percentage = 0;
        if (containerRect.top < triggerPoint) {
            const totalHeight = containerRect.height;
            const scrolled = triggerPoint - containerRect.top;
            percentage = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100));
        }
        
        fillLine.style.height = `${percentage}%`;
    };
    if (document.querySelector('.timeline-container')) {
        window.addEventListener('scroll', updateTimelineFill);
        updateTimelineFill(); // Init on load
    }

    // -------------------------------------------------------------
    // 6. Interactive Developer Command CLI Terminal
    // -------------------------------------------------------------
    const terminalOverlay = document.getElementById('terminal-overlay');
    const toggleTerminalBtns = document.querySelectorAll('#toggle-terminal, .terminal-button');
    const closeTerminalBtn = document.getElementById('close-terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    const terminalCommands = {
        help: () => `Available command directives:
  about       - Summarize profile biographical parameters
  education   - Review academic timeline nodes
  experience  - Show professional internship files
  projects    - Output active code projects metadata
  contact     - Display communication links
  matrix      - Trigger digital matrix falling script
  hack        - Decrypt classified developer files
  clear       - Purge terminal stdout history
  help        - List terminal directives`,
        about: () => `BIOMETRIC DATA ACQUISITION COMPLETED:
  NAME      : Shreyash Shashikant Anawane
  AGE       : 19
  DOB       : 18-December-2006
  ADDRESS   : Shimpi Galli, Kalkai Chowk, tal. Shrigonda, dist. Ahilyanagar
  FOCUS     : AI/ML Developer & Full Stack Web Engineer`,
        education: () => `ACADEMIC RECORDS LOADED:
  [2023 - 2026] Diploma in Computer Engineering
    - Institution : Parikrama Polytechnic
    - Status      : 80% Grade Point Average
  
  [2022 - 2023] Secondary School (10th)
    - Institution : Shrigonda Madhyamik Vidyalay
    - Status      : 81% Grade Point Average

  [2026 - ONGOING] BTech Computer Engineering
    - Status      : Active Enrollment`,
        experience: () => `INTERNSHIP ARCHIVES:
  [Sumago Infotech Pvt. Ltd.] (2-Jun-2025 - 22-Aug-2025)
    - Position : Data Science and AI/ML Intern
    - Project  : VIRA (Visionary Image Reading Assistant)
    - Activity : Implemented text recognition and OCR parsers in Python.
  
  [Softspire Solutions] (1-Jun-2026 - 31-Aug-2026)
    - Position : Full Stack Web Developer Intern
    - Project  : Active Development Stack Integration`,
        projects: () => `REPOSITORY DIRECTORIES:
  1. VAST Project - Python object recognition system.
  2. Project VIRA - Vision OCR scanner & Image processing library.
  3. DefAI       - Custom neural network for face detection.`,
        contact: () => `COMMUNICATION SOCKETS OPEN:
  PHONE     : +91 9172617718
  EMAIL     : shreyashanawane@gmail.com
  LINKEDIN  : linkedin.com/in/shreyash-anawane-b3536837a
  GITHUB    : github.com/BBSHREY247`,
        clear: () => {
            terminalOutput.innerHTML = '';
            return '';
        }
    };

    let isMatrixRunning = false;
    let matrixInterval = null;

    function runMatrixEffect() {
        if (isMatrixRunning) return "Matrix script already running. Press Ctrl+C or run 'clear' to exit.";
        isMatrixRunning = true;
        terminalOutput.innerHTML = '';
        
        const canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.margin = '10px 0';
        canvas.width = terminalOutput.clientWidth || 600;
        canvas.height = 200;
        terminalOutput.appendChild(canvas);
        
        const mCtx = canvas.getContext('2d');
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        matrixInterval = setInterval(() => {
            mCtx.fillStyle = 'rgba(4, 7, 18, 0.05)';
            mCtx.fillRect(0, 0, canvas.width, canvas.height);
            
            mCtx.fillStyle = '#39ff14';
            mCtx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }, 30);

        return "STREAMS INITIATED. TYPE 'clear' TO ABORT MATRIX GRID...";
    }

    function runHackSimulation() {
        terminalOutput.innerHTML = '';
        let line = 0;
        const hackLines = [
            "Initializing deep scan bypass protocol...",
            "Connecting to neural repository mainframe at IP: 192.168.24.7...",
            "Overriding firewalls... SUCCESS",
            "Bypassing AES-256 handshake protocols...",
            "Decrypting Shreyash's developer secret keys...",
            "ACCESS GRANTED.",
            "--------------------------------------------------",
            "SKILL MATRIX UNLOCKED:",
            "  LANGUAGES   : Python, JavaScript, HTML5, CSS3, SQL",
            "  FRAMEWORKS  : React, Node.js, OpenCV, TensorFlow",
            "  AI TECHS    : OCR Scanning, Object Recognition, Face Meshing",
            "  DEVELOPMENT : Git, Web Socketing, Responsive Grid UI",
            "--------------------------------------------------",
            "Biometric decryption finalized. Shell security intact."
        ];

        const outputNextLine = () => {
            if (line < hackLines.length) {
                const textNode = document.createElement('div');
                textNode.textContent = hackLines[line];
                terminalOutput.appendChild(textNode);
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                soundEffects.terminalKey();
                
                let delay = 300 + Math.random() * 400;
                if (line >= 7) delay = 100; // fast print skills
                
                line++;
                setTimeout(outputNextLine, delay);
            } else {
                soundEffects.success();
            }
        };
        outputNextLine();
        return "DECRYPTOR VIRA_DECRYPT_V1.0 INITIALIZING...";
    }

    if (toggleTerminalBtns.length > 0 && terminalOverlay) {
        const toggleTerminal = () => {
            state.terminalOpen = !state.terminalOpen;
            if (state.terminalOpen) {
                terminalOverlay.classList.add('open');
                setTimeout(() => terminalInput.focus(), 150);
                soundEffects.synthClick();
            } else {
                terminalOverlay.classList.remove('open');
                soundEffects.synthClick();
            }
        };

        toggleTerminalBtns.forEach(btn => btn.addEventListener('click', toggleTerminal));
        if (closeTerminalBtn) {
            closeTerminalBtn.addEventListener('click', toggleTerminal);
        }

        // Close on ESC
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.terminalOpen) {
                toggleTerminal();
            }
        });
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            soundEffects.terminalKey();
            if (e.key === 'Enter') {
                const fullCmd = terminalInput.value.trim();
                const cmd = fullCmd.toLowerCase();
                terminalInput.value = '';

                // Print command prompt
                const cmdLine = document.createElement('div');
                cmdLine.innerHTML = `<span style="color:var(--accent-purple)">guest@shreyash-terminal:~$</span> <span style="color:#fff">${fullCmd}</span>`;
                terminalOutput.appendChild(cmdLine);

                // Stop matrix if running other command
                if (isMatrixRunning && cmd !== '') {
                    clearInterval(matrixInterval);
                    isMatrixRunning = false;
                }

                let outputText = "";
                if (cmd === 'matrix') {
                    outputText = runMatrixEffect();
                } else if (cmd === 'hack') {
                    outputText = runHackSimulation();
                } else if (terminalCommands[cmd]) {
                    outputText = terminalCommands[cmd]();
                } else if (cmd === '') {
                    outputText = '';
                } else {
                    soundEffects.error();
                    outputText = `Terminal command '${fullCmd}' not recognized. Type 'help' for directory rules.`;
                }

                if (outputText !== '') {
                    const outLine = document.createElement('div');
                    outLine.className = 'terminal-log-output';
                    outLine.textContent = outputText;
                    terminalOutput.appendChild(outLine);
                }

                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        });

        // Focus input if clicked anywhere inside terminal body
        document.querySelector('.terminal-body').addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // -------------------------------------------------------------
    // 7. Interactive Canvas Project Simulators (Visualizers)
    // -------------------------------------------------------------
    
    // -- DefAI Face Recognition Simulator --
    const initDefAiCanvas = () => {
        const canvas = document.getElementById('defai-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        let faceNodes = [];
        const numNodes = 15;

        // Generate points resembling a stylized face mask contour
        for (let i = 0; i < numNodes; i++) {
            faceNodes.push({
                x: width/2 + (Math.sin(i * 0.5) * 50) + (Math.random() - 0.5) * 15,
                y: height/2 - 40 + (i * 8) + (Math.random() - 0.5) * 15,
                targetX: 0,
                targetY: 0,
                baseX: width/2 + (Math.sin(i * 0.5) * 45),
                baseY: height/2 - 40 + (i * 8),
                angle: Math.random() * Math.PI * 2
            });
        }

        const animateDefAi = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Draw scanning mesh
            ctx.strokeStyle = 'rgba(185, 39, 252, 0.25)';
            ctx.lineWidth = 0.8;
            
            faceNodes.forEach((node, idx) => {
                node.angle += 0.03;
                node.x = node.baseX + Math.sin(node.angle) * 3;
                node.y = node.baseY + Math.cos(node.angle) * 3;
            });

            // Connect nodes with lines to simulate 3D mesh
            for (let i = 0; i < faceNodes.length; i++) {
                for (let j = i + 1; j < faceNodes.length; j++) {
                    const dist = Math.hypot(faceNodes[i].x - faceNodes[j].x, faceNodes[i].y - faceNodes[j].y);
                    if (dist < 55) {
                        ctx.beginPath();
                        ctx.moveTo(faceNodes[i].x, faceNodes[i].y);
                        ctx.lineTo(faceNodes[j].x, faceNodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw scanning tracker bounding box
            const themeCyan = getComputedStyle(document.documentElement).getPropertyValue('--accent-cyan').trim();
            const themePurple = getComputedStyle(document.documentElement).getPropertyValue('--accent-purple').trim();
            
            ctx.strokeStyle = themePurple;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(width/2 - 60, height/2 - 50, 120, 100);

            // Bounding box markers
            ctx.fillStyle = themeCyan;
            ctx.fillRect(width/2 - 62, height/2 - 52, 10, 3);
            ctx.fillRect(width/2 - 62, height/2 - 52, 3, 10);
            ctx.fillRect(width/2 + 52, height/2 - 52, 10, 3);
            ctx.fillRect(width/2 + 59, height/2 - 52, 3, 10);
            ctx.fillRect(width/2 - 62, height/2 + 45, 10, 3);
            ctx.fillRect(width/2 - 62, height/2 + 38, 3, 10);
            ctx.fillRect(width/2 + 52, height/2 + 45, 10, 3);
            ctx.fillRect(width/2 + 59, height/2 + 38, 3, 10);

            // Tracking text
            ctx.fillStyle = themeCyan;
            ctx.font = '9px monospace';
            ctx.fillText("TARGET: HELLO", width/2 - 55, height/2 - 58);
            ctx.fillText("CONF: 99.42%", width/2 - 55, height/2 + 62);

            requestAnimationFrame(animateDefAi);
        };
        animateDefAi();
    };

    // -- Project VIRA Text OCR Scanner Simulator --
    const initViraCanvas = () => {
        const canvas = document.getElementById('vira-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        const codeLines = [
            "import tensorflow as tf",
            "model = tf.keras.models.load()",
            "img = cv2.imread('text.png')",
            "processed = ocr.extract_text(img)",
            "print('Extracted:', processed)",
            "output_socket.emit(processed)"
        ];

        let scanY = 0;
        let scanSpeed = 1.2;

        const animateVira = () => {
            ctx.clearRect(0, 0, width, height);

            const themeCyan = getComputedStyle(document.documentElement).getPropertyValue('--accent-cyan').trim();
            const themeText = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();

            // Render code lines
            ctx.font = '10px monospace';
            codeLines.forEach((line, idx) => {
                const lineY = 35 + (idx * 20);
                
                // If the laser is below the line, render it glowing (as decoded)
                if (scanY > lineY) {
                    ctx.fillStyle = themeCyan;
                    ctx.fillText(line, 20, lineY);
                } else {
                    ctx.fillStyle = themeText;
                    // Draw gibberish/encrypted text before scanning
                    const enc = line.replace(/[a-zA-Z]/g, () => Math.random() > 0.5 ? '1' : '0');
                    ctx.fillText(enc, 20, lineY);
                }
            });

            // Draw laser bar
            ctx.strokeStyle = themeCyan;
            ctx.shadowColor = themeCyan;
            ctx.shadowBlur = 8;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(10, scanY);
            ctx.lineTo(width - 10, scanY);
            ctx.stroke();

            // Clear shadow blur for rest of drawing calls
            ctx.shadowBlur = 0;

            scanY += scanSpeed;
            if (scanY > height - 10 || scanY < 15) {
                scanSpeed *= -1; // bounce
            }

            requestAnimationFrame(animateVira);
        };
        animateVira();
    };

    // -- VAST Object Recognition Simulator --
    const initVastCanvas = () => {
        const canvas = document.getElementById('vast-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        class SimObject {
            constructor(label) {
                this.label = label;
                this.x = Math.random() * (width - 80) + 40;
                this.y = Math.random() * (height - 60) + 30;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.w = 50 + Math.random() * 20;
                this.h = 40 + Math.random() * 20;
                this.conf = (90 + Math.random() * 9).toFixed(1);
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 10 || this.x + this.w > width - 10) this.vx *= -1;
                if (this.y < 10 || this.y + this.h > height - 10) this.vy *= -1;
            }

            draw() {
                const themeGreen = getComputedStyle(document.documentElement).getPropertyValue('--accent-green').trim();
                const themeCyan = getComputedStyle(document.documentElement).getPropertyValue('--accent-cyan').trim();
                
                // Draw green bounding box
                ctx.strokeStyle = themeGreen;
                ctx.lineWidth = 1.5;
                ctx.strokeRect(this.x, this.y, this.w, this.h);

                // Draw label tag background
                ctx.fillStyle = themeGreen;
                ctx.fillRect(this.x, this.y - 14, this.w, 14);

                // Draw text label
                ctx.fillStyle = '#040712';
                ctx.font = 'bold 8px monospace';
                ctx.fillText(`${this.label}: ${this.conf}%`, this.x + 3, this.y - 4);
            }
        }

        const objects = [
            new SimObject("person"),
            new SimObject("laptop"),
            new SimObject("cup")
        ];

        const animateVast = () => {
            ctx.clearRect(0, 0, width, height);

            objects.forEach(obj => {
                obj.update();
                obj.draw();
            });

            requestAnimationFrame(animateVast);
        };
        animateVast();
    };

    // Initialize all canvas projects
    initDefAiCanvas();
    initViraCanvas();
    initVastCanvas();



    // -------------------------------------------------------------
    // 8. Clipboard Contact Action
    // -------------------------------------------------------------
    const clipboardContainers = document.querySelectorAll('.copy-container');
    clipboardContainers.forEach(container => {
        const link = container.querySelector('.contact-link');
        const hint = container.querySelector('.copy-hint');
        if (link && hint) {
            container.addEventListener('click', (e) => {
                e.preventDefault();
                let textToCopy = link.getAttribute('href') || link.innerText;
                if (textToCopy.startsWith('mailto:')) textToCopy = textToCopy.replace('mailto:', '');
                if (textToCopy.startsWith('tel:')) textToCopy = textToCopy.replace('tel:', '');
                
                navigator.clipboard.writeText(textToCopy).then(() => {
                    soundEffects.success();
                    hint.classList.add('visible');
                    setTimeout(() => hint.classList.remove('visible'), 2000);
                }).catch(() => {
                    soundEffects.error();
                });
            });
        }
    });

    // -------------------------------------------------------------
    // 8.5. Mobile Navigation Menu Drawer Setup
    // -------------------------------------------------------------
    const navControls = document.querySelector('.nav-controls');
    if (navControls) {
        const menuToggleBtn = document.createElement('button');
        menuToggleBtn.className = 'btn-icon';
        menuToggleBtn.id = 'menu-toggle';
        menuToggleBtn.title = 'Toggle Menu';
        menuToggleBtn.innerHTML = `
            <svg class="menu-open" viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor;">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
            <svg class="menu-close" viewBox="0 0 24 24" style="display:none;width:18px;height:18px;fill:currentColor;">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        `;
        navControls.appendChild(menuToggleBtn);

        const navLinks = document.querySelector('.nav-links');

        menuToggleBtn.addEventListener('click', () => {
            menuToggleBtn.classList.toggle('active');
            if (navLinks) {
                navLinks.classList.toggle('mobile-active');
            }
            
            if (state.audioEnabled && soundEffects && typeof soundEffects.click === 'function') {
                soundEffects.click();
            }

            const menuOpenIcon = menuToggleBtn.querySelector('.menu-open');
            const menuCloseIcon = menuToggleBtn.querySelector('.menu-close');
            if (menuToggleBtn.classList.contains('active')) {
                if (menuOpenIcon) menuOpenIcon.style.display = 'none';
                if (menuCloseIcon) menuCloseIcon.style.display = 'block';
                document.body.style.overflow = 'hidden';
            } else {
                if (menuOpenIcon) menuOpenIcon.style.display = 'block';
                if (menuCloseIcon) menuCloseIcon.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        menuToggleBtn.addEventListener('mouseenter', () => {
            if (state.audioEnabled && soundEffects && typeof soundEffects.hover === 'function') {
                soundEffects.hover();
            }
        });

        // Close menu when a link is clicked
        if (navLinks) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menuToggleBtn.classList.remove('active');
                    navLinks.classList.remove('mobile-active');
                    const menuOpenIcon = menuToggleBtn.querySelector('.menu-open');
                    const menuCloseIcon = menuToggleBtn.querySelector('.menu-close');
                    if (menuOpenIcon) menuOpenIcon.style.display = 'block';
                    if (menuCloseIcon) menuCloseIcon.style.display = 'none';
                    document.body.style.overflow = '';
                });
            });
        }
    }

    // -------------------------------------------------------------
    // 9. Premium Fullscreen Page Transition Overlay Interceptor
    // -------------------------------------------------------------
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            // Intercept internal page navigations only
            if (href && (href.endsWith('.html') || href === '/' || href.startsWith('#')) && !link.target && !href.startsWith('http')) {
                link.addEventListener('click', (e) => {
                    // Check if it's a simple internal hash anchor on the current page
                    const isHashAnchor = href.startsWith('#') || href.includes('#') && href.split('#')[0] === window.location.pathname.split('/').pop();
                    if (isHashAnchor) return; // allow browser default scroll behavior

                    e.preventDefault();
                    overlay.classList.add('active');
                    soundEffects.synthClick();
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 500); // syncs with CSS slide transition time
                });
            }
        });

        // Trigger fade-in wipe on page load complete
        window.addEventListener('pageshow', () => {
            overlay.classList.remove('active');
        });
    }
});
