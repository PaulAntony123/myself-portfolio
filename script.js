// Loading Screen Handler
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // Animate percentage counter
        const percentEl = loadingScreen.querySelector('.loading-percentage');
        const subtitleEl = loadingScreen.querySelector('.loading-subtitle');
        const loadingMessages = [
            'Building terrain...',
            'Spawning mobs...',
            'Planting trees...',
            'Generating ores...',
            'Lighting sky...',
            'Almost there...'
        ];
        let msgIndex = 0;

        if (percentEl) {
            let progress = 0;
            const percentInterval = setInterval(() => {
                progress += 1;
                if (progress > 100) progress = 100;
                percentEl.textContent = progress + '%';
                if (progress >= 100) clearInterval(percentInterval);
            }, 30); // ~3s to reach 100
        }

        if (subtitleEl) {
            const msgInterval = setInterval(() => {
                msgIndex = (msgIndex + 1) % loadingMessages.length;
                subtitleEl.style.opacity = '0';
                setTimeout(() => {
                    subtitleEl.textContent = loadingMessages[msgIndex];
                    subtitleEl.style.opacity = '1';
                }, 200);
            }, 500);
            // Clear when loading screen hides
            setTimeout(() => clearInterval(msgInterval), 3200);
        }
        // Ensure the loading bar animation has time to be seen (e.g., 3 seconds minimum)
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Trigger Hero Typewriter after loading screen starts fading
            if (typeof startTypewriter === 'function') {
                setTimeout(startTypewriter, 500); // Small delay after fade starts
            }

            // Remove from DOM after transition to keep performance high
            setTimeout(() => {
                loadingScreen.remove();
            }, 800);
        }, 3200);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation & Hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Form Submission (Prevent Default for Demo)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.querySelector('span').innerText;
            btn.querySelector('span').innerText = 'Sent!';
            btn.style.background = '#4cd137';
            setTimeout(() => {
                btn.querySelector('span').innerText = originalText;
                contactForm.reset();
            }, 3000);
        });
    }

    // Interactive Hero Background & Particles
    const heroSection = document.getElementById('hero');
    const heroBg = document.getElementById('hero-bg');
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    
    // Mouse tracking
    let mouse = {
        x: undefined,
        y: undefined,
        currentX: undefined,
        currentY: undefined
    };

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Minecraft theme colors for particles
    const overworldColors = ['#ffb6c1', '#ffc0cb', '#ff69b4', '#db7093']; // Cherry Blossom Pink Colors
    const netherColors = ['#576574', '#8395a7', '#222f3e', '#1e272e', '#ff4d4d']; // Ash and occasional ember
    let colors = document.body.classList.contains('theme-day') ? overworldColors : netherColors;

    class Particle {
        constructor() {
            this.reset();
            // Start scattered across screen initially
            this.y = Math.random() * height;
        }

        reset() {
            this.isDay = document.body.classList.contains('theme-day');
            
            // Size: Leaves are slightly larger rectangle/squares, Ash is tiny squares
            this.size = this.isDay ? (Math.random() * 6 + 3) : (Math.random() * 4 + 2);
            this.baseSize = this.size;
            
            this.x = Math.random() * width;
            
            if (this.isDay) {
                // Cherry Blossom Leaves: fall down and drift sideways
                this.y = -this.size - 10;
                this.vx = (Math.random() - 0.5) * 2; // Drift left/right
                this.vy = Math.random() * 1.5 + 0.5; // Fall slowly down
            } else {
                // Nether Ash: drift upwards slowly
                this.y = height + this.size + 10;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = Math.random() * -1.5 - 0.5; // Float up
            }
            
            this.color = colors[Math.floor(Math.random() * colors.length)];
            
            // For cherry blossom wobble effect
            this.angle = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.05 + 0.02;
        }

        update() {
            this.isDay = document.body.classList.contains('theme-day');
            
            if (this.isDay) {
                // Leaf falling math
                this.x += this.vx + Math.sin(this.angle) * 1;
                this.y += this.vy;
                this.angle += this.wobbleSpeed;
                
                // Reset at bottom
                if (this.y > height + this.size) this.reset();
                if (this.x > width + this.size) this.x = -this.size;
                if (this.x < -this.size) this.x = width + this.size;
                
            } else {
                // Ash floating math
                this.x += this.vx;
                this.y += this.vy;
                
                // Reset at top
                if (this.y < -this.size) this.reset();
                if (this.x > width + this.size) this.x = -this.size;
                if (this.x < -this.size) this.x = width + this.size;
            }

            // Mouse interaction: move away and slightly enlarge
            if (mouse.currentX !== undefined && mouse.currentY !== undefined) {
                let dx = mouse.currentX - this.x;
                let dy = mouse.currentY - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let maxDistance = 150;

                if (distance < maxDistance) {
                    let force = (maxDistance - distance) / maxDistance;
                    this.x -= (dx / distance) * force * 3;
                    this.y -= (dy / distance) * force * 3;
                    this.size = this.baseSize + force * 5;
                } else {
                    if (this.size > this.baseSize) this.size -= 0.1;
                }
            } else {
                if (this.size > this.baseSize) this.size -= 0.1;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            
            // Ash has no glow to look powdery, leaves have slight glow, embers have bright glow
            if (this.color === '#ff4d4d') {
                ctx.shadowBlur = 10;
            } else if (this.isDay) {
                ctx.shadowBlur = 3;
            } else {
                ctx.shadowBlur = 0;
            }
            
            // Draw as square (pixel theme)
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.shadowBlur = 0; // Reset
        }
    }

    // Init particles
    function initParticles() {
        particles = [];
        let numParticles = (window.innerWidth < 768) ? 30 : 60;
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    initParticles();

    // Mouse movement in hero area
    heroSection.addEventListener('mousemove', (e) => {
        let rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.currentX = mouse.x;
        mouse.currentY = mouse.y;

        // Parallax background hover effect
        let xFactor = (mouse.x / width) - 0.5;
        let yFactor = (mouse.y / height) - 0.5;
        heroBg.style.transform = `translate(${xFactor * -40}px, ${yFactor * -40}px) scale(1.05)`;
    });

    heroSection.addEventListener('mouseleave', () => {
        mouse.currentX = undefined;
        mouse.currentY = undefined;
        heroBg.style.transform = `translate(0px, 0px) scale(1)`;
    });

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw slightly transparent black to leave trails? No, clear entirely is cleaner for blocks
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        requestAnimationFrame(animate);
    }

    animate();

    // Day/Night Theme Toggle with Portal Effect
    const themeToggleBtn = document.getElementById('theme-toggle');
    const portalOverlay = document.getElementById('portal-overlay');
    if (themeToggleBtn && portalOverlay) {
        themeToggleBtn.addEventListener('click', () => {
            // Activate the Nether Portal swirl screen
            portalOverlay.classList.add('active');
            
            // Wait for it to become fully visible (1200ms based on CSS transition)
            setTimeout(() => {
                document.body.classList.toggle('theme-day');
                
                if (document.body.classList.contains('theme-day')) {
                    themeToggleBtn.innerText = '🌙';
                    colors = overworldColors;
                } else {
                    themeToggleBtn.innerText = '🌞';
                    colors = netherColors;
                }
                
                // Update particles direction and color
                particles.forEach(p => {
                    p.reset(); 
                    // Scatter so they don't all start at the absolute top/bottom exactly at once
                    p.y = Math.random() * height; 
                });
                
                // Hold the portal for a tiny bit, then fade it out
                setTimeout(() => {
                    portalOverlay.classList.remove('active');
                }, 300);
            }, 1200);
        });
    }

    // RPG Typing Effect
    const typewriterEl = document.getElementById('typewriter-text');
    if (typewriterEl) {
        const textToType = typewriterEl.getAttribute('data-text');
        typewriterEl.innerText = '';
        let i = 0;
        function typeWriter() {
            if (i < textToType.length) {
                typewriterEl.innerHTML += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 50); // Typing speed
            }
        }
        
        // Define global-ish function to trigger this
        window.startTypewriter = () => {
             typeWriter();
        };
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Audio Feedback (using simple synth)
    let audioCtx;
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playClickSound() {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    function playHoverSound() {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    }

    // Attach audio to interactive elements
    document.querySelectorAll('a, button, .mc-button').forEach(el => {
        el.addEventListener('mouseenter', playHoverSound);
        el.addEventListener('click', playClickSound);
    });

    // 3D Glass Card Tilt Effect (Glassmorphism + 3D)
    const tiltCards = document.querySelectorAll('.glass-card');
    tiltCards.forEach(card => {
        if (card.classList.contains('no-tilt')) return;
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 8 degrees for subtlety)
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            // Disable CSS transition temporarily for smooth cursor tracking
            card.style.transition = 'none';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Restore transition and smoothly return to original state
            card.style.transition = 'all 0.4s ease';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)`;
            
            setTimeout(() => {
                // Clear inline styles so default CSS takes back over completely
                card.style.transform = '';
                card.style.transition = '';
            }, 400);
        });
        
        card.addEventListener('mouseenter', () => {
            // Quick transition when entering the card
            card.style.transition = 'all 0.1s ease';
        });
    });

    // Minecraft Advancement System
    const advancementToast = document.getElementById('advancement-toast');
    const advancementDesc = document.getElementById('advancement-desc');
    let isAdvancementShowing = false;
    let advancementQueue = [];

    function showAdvancement(text) {
        if (isAdvancementShowing) {
            advancementQueue.push(text);
            return;
        }
        
        isAdvancementShowing = true;
        advancementDesc.innerText = `"${text}"`;
        
        // Play levelup/chime sound if desired
        playClickSound(); // Temporary feedback ping
        
        advancementToast.classList.add('show');
        
        setTimeout(() => {
            advancementToast.classList.remove('show');
            setTimeout(() => {
                isAdvancementShowing = false;
                if (advancementQueue.length > 0) {
                    showAdvancement(advancementQueue.shift());
                }
            }, 600); // Wait for transition out
        }, 4000); // Show for 4 seconds
    }

    const advancementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'about') {
                    showAdvancement('Getting an Upgrade');
                } else if (entry.target.id === 'contact') {
                    showAdvancement('The End?');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    advancementObserver.observe(document.getElementById('about'));
    advancementObserver.observe(document.getElementById('contact'));

    // Easter Egg (type "minecraft")
    let secretCode = "minecraft";
    let inputBuffer = "";
    const creeper = document.getElementById('creeper-easter-egg');

    document.addEventListener('keydown', (e) => {
        // Only accept single printable characters (ignore Shift, Control, Alt, etc.)
        if (e.key.length !== 1) return;
        
        inputBuffer += e.key.toLowerCase();
        
        // Keep buffer size limited to length of secret code
        if (inputBuffer.length > secretCode.length) {
            inputBuffer = inputBuffer.substring(inputBuffer.length - secretCode.length);
        }
        
        if (inputBuffer === secretCode) {
            inputBuffer = ""; // Reset
            
            // Flash the screen green first
            const flash = document.createElement('div');
            flash.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0da135;z-index:10000;opacity:0;transition:opacity 0.15s;pointer-events:none;';
            document.body.appendChild(flash);
            requestAnimationFrame(() => {
                flash.style.opacity = '0.6';
                setTimeout(() => {
                    flash.style.opacity = '0';
                    setTimeout(() => flash.remove(), 300);
                }, 200);
            });

            // Show creeper
            setTimeout(() => {
                creeper.classList.add('active');
            }, 300);
            
            // Play a scary synth "hiss" warning
            initAudio();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 1.5);
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 1.5);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 1.5);
            
            setTimeout(() => {
                creeper.classList.remove('active');
            }, 4000);
        }
    });

    // Certificates Modal Logic
    const certModal = document.getElementById('certificates-modal');
    const viewCertBtn = document.getElementById('view-certificates-btn');
    const closeCertBtn = certModal ? certModal.querySelector('.close-modal') : null;

    if (viewCertBtn && certModal) {
        viewCertBtn.addEventListener('click', (e) => {
            e.preventDefault();
            certModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
    }

    if (closeCertBtn && certModal) {
        closeCertBtn.addEventListener('click', () => {
            certModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close on outside click
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                certModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

});
