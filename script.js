// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER LOGIC ---
    const preloader = document.querySelector('.preloader');
    const logo = document.querySelector('.loader-logo');
    const progressBar = document.querySelector('.progress-bar');
    
    // Animate Logo
    gsap.to(logo, { opacity: 1, duration: 1, ease: "power2.out" });
    
    // Simulate Loading
    gsap.to(progressBar, {
        width: '100%',
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
            gsap.to(preloader, {
                y: '-100%',
                duration: 1,
                ease: "expo.inOut",
                delay: 0.5
            });
            initSiteAnimations();
        }
    });

    // --- 2. CUSTOM CURSOR ---
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Outline follows with lag (GSAP)
        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            duration: 0.15,
            ease: "power2.out"
        });
    });

    // Hover Effect for Links/Buttons
    const hoverables = document.querySelectorAll('a, button, .project-card, .timeline-item');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });

    // --- 3. THREE.JS BACKGROUND ---
    const initThreeJS = () => {
        const canvas = document.querySelector('#webgl-canvas');
        const scene = new THREE.Scene();
        
        // Fog for depth
        scene.fog = new THREE.FogExp2(0x050505, 0.002);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            // Spread particles wide
            posArray[i] = (Math.random() - 0.5) * 15; 
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.02,
            color: 0xD4AF37, // Gold
            transparent: true,
            opacity: 0.8,
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        // Grid Floor
        const gridHelper = new THREE.GridHelper(30, 30, 0xFF003C, 0x222222);
        gridHelper.position.y = -2;
        scene.add(gridHelper);

        camera.position.z = 3;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX / window.innerWidth - 0.5;
            mouseY = event.clientY / window.innerHeight - 0.5;
        });

        // Animation Loop
        const clock = new THREE.Clock();

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            // Rotate entire particle system slowly
            particlesMesh.rotation.y = elapsedTime * 0.05;
            particlesMesh.rotation.x = mouseY * 0.5;
            particlesMesh.rotation.y += mouseX * 0.5;

            // Move grid to simulate forward motion
            gridHelper.position.z = (elapsedTime * 2) % 10;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Resize Handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    initThreeJS();

    // --- 4. GSAP SCROLL ANIMATIONS ---
    gsap.registerPlugin(ScrollTrigger);

    const initSiteAnimations = () => {
        
        // Hero Content Stagger
        const tl = gsap.timeline();
        
        tl.to('.hero-label', { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
          .from('.hero-title .line', { 
              y: 100, 
              opacity: 0, 
              duration: 1, 
              stagger: 0.2, 
              ease: "power4.out" 
          }, "-=0.5")
          .to('.typewriter-container', { opacity: 1, duration: 0.5 }, "-=0.5")
          .to('.hero-cta-group', { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.5");

        // Typewriter Effect
        const typeText = "Full Stack Developer | Creative Technologist | UI/UX Designer";
        const typeContainer = document.querySelector('.typewriter');
        let i = 0;
        
        function typeWriter() {
            if (i < typeText.length) {
                typeContainer.innerHTML += typeText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        setTimeout(typeWriter, 1500); // Start after hero load

        // Navbar Scroll Effect
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        // Reveal Animations (General)
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        
        revealElements.forEach(el => {
            gsap.fromTo(el, 
                { 
                    opacity: 0, 
                    y: 50,
                    x: el.classList.contains('reveal-left') ? -50 : (el.classList.contains('reveal-right') ? 50 : 0)
                },
                {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Stats Counter Animation
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            
            gsap.to(counter, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                scrollTrigger: {
                    trigger: counter,
                    start: "top 80%",
                    once: true
                }
            });
        });

        // Magnetic Buttons
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: "elastic.out(1, 0.3)" });
            });
        });
    };
});