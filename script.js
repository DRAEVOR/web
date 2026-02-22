/**
 * DRAEVOR - ULTRA ADVANCED SCRIPT
 * Handles: Loader, Cursor Physics, Canvas Particles, Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. LOADING SEQUENCE
    // =========================================
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    
    // Simulate complex loading process
    setTimeout(() => {
        loaderBar.style.width = '100%';
    }, 100);

    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // Initialize animations after load
            initScrollAnimations();
            initTypewriter();
        }, 1000);
    }, 2500);

    // =========================================
    // 2. CUSTOM CURSOR PHYSICS
    // =========================================
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    const cursorGlow = document.querySelector('[data-cursor-glow]');
    
    // Mouse position state
    let mouseX = 0;
    let mouseY = 0;
    
    // Outline position state (for lag effect)
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot moves instantly
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        
        // Glow moves with slight lag
        cursorGlow.animate({
            left: `${mouseX}px`,
            top: `${mouseY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Smooth outline animation loop
    function animateCursor() {
        // Linear interpolation for smooth follow
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover Effects for Interactive Elements
    const interactiveElements = document.querySelectorAll('a, button, .glass-panel, .project-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // =========================================
    // 3. MAGNETIC BUTTONS
    // =========================================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move button slightly towards cursor
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // =========================================
    // 4. CANVAS PARTICLE NETWORK
    // =========================================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Resize handling
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5; // Velocity X
            this.vy = (Math.random() - 0.5) * 0.5; // Velocity Y
            this.size = Math.random() * 2;
            this.color = 'rgba(212, 175, 55, 0.5)'; // Gold
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    // Initialize Particles
    function initParticles() {
        particles = [];
        const particleCount = Math.floor(width / 15); // Responsive count
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    initParticles();
    
    // Animation Loop
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Draw connections
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 - distance/1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();

    // =========================================
    // 5. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    // =========================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optional: Stop observing once animated
                    // observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);
        
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        revealElements.forEach(el => observer.observe(el));
    }

    // =========================================
    // 6. TYPEWRITER EFFECT
    // =========================================
    function initTypewriter() {
        const textElement = document.getElementById('typewriter');
        const phrases = [" // Building the Future.", " // Designing Impact.", " // Code is Law."];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                textElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        }
        
        type();
    }
});