document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('name-form');
    const nameInput = document.getElementById('name-input');
    const entryScreen = document.getElementById('entry-screen');
    const darkScreen = document.getElementById('dark-screen');
    const typingText = document.getElementById('typing-text');
    const flashOverlay = document.getElementById('flash-overlay');
    const mainBg = document.getElementById('main-bg');
    const shapesContainer = document.getElementById('shapes-container');
    const wishScreen = document.getElementById('wish-screen');
    const bdayName = document.getElementById('bday-name');
    const resetBtn = document.getElementById('reset-btn');
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');

    // Generate Floating Background Shapes (Balloons)
    const birthdayEmojis = ['🎈', '🎊', '🎁', '🎈', '⭐', '🎈'];
    for(let i=0; i<15; i++) {
        const shape = document.createElement('div');
        shape.classList.add('shape');
        shape.textContent = birthdayEmojis[Math.floor(Math.random() * birthdayEmojis.length)];
        shape.style.left = `${Math.random() * 100}vw`;
        shape.style.fontSize = `${Math.random() * 2 + 2}rem`;
        shape.style.animationDuration = `${Math.random() * 10 + 10}s`;
        shape.style.animationDelay = `${Math.random() * 5}s`;
        shapesContainer.appendChild(shape);
    }

    // 3D Tilt Effect on Cards
    const cards = document.querySelectorAll('.tiltable');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            card.style.transition = `transform 0.5s ease`;
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = `none`;
        });
    });

    // Epic Confetti Cannon System
    let particles = [];
    let animationId;
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#ff9ff3', '#5f27cd'];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(x, y, isBurst = false) {
            this.x = x;
            this.y = y;
            this.isBurst = isBurst;
            this.size = Math.random() * 15 + 8;
            
            if (isBurst) {
                const directionX = x < canvas.width/2 ? 1 : -1;
                this.speedX = (Math.random() * 20 + 5) * directionX;
                this.speedY = -(Math.random() * 30 + 15);
            } else {
                this.speedX = Math.random() * 6 - 3;
                this.speedY = Math.random() * 5 + 2;
            }
            
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 20 - 10;
            this.shape = Math.random() > 0.5 ? 'circle' : 'square';
            this.gravity = 0.6;
        }

        update() {
            if (this.isBurst) {
                this.speedY += this.gravity;
                this.x += this.speedX;
                this.y += this.speedY;
            } else {
                this.y += this.speedY;
                this.x += this.speedX;
            }
            this.rotation += this.rotationSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            if(this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            }
            ctx.restore();
        }
    }

    function shootCannons() {
        for(let i=0; i<150; i++) particles.push(new Particle(0, canvas.height, true));
        for(let i=0; i<150; i++) particles.push(new Particle(canvas.width, canvas.height, true));
        for(let i=0; i<100; i++) particles.push(new Particle(Math.random() * canvas.width, -20, false));
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.y < canvas.height + 50);
        particles.forEach(p => { p.update(); p.draw(); });
        
        if (Math.random() > 0.9 && particles.length < 400) {
            particles.push(new Particle(Math.random() * canvas.width, -20, false));
        }
        animationId = requestAnimationFrame(animateConfetti);
    }

    function stopConfetti() {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = [];
    }

    const typeText = async (text, delay = 70) => {
        typingText.textContent = '';
        for (let i = 0; i < text.length; i++) {
            typingText.textContent += text.charAt(i);
            await new Promise(r => setTimeout(r, delay));
        }
    };
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        if (!name) return;
        
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Opening...</span>';
        btn.style.pointerEvents = 'none';

        try {
            const response = await fetch('/api/greet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name })
            });
            if (!response.ok) throw new Error("Backend not responding");
            const data = await response.json();

            entryScreen.classList.remove('fade-in');
            entryScreen.classList.add('zoom-out');
            mainBg.style.opacity = '0';
            shapesContainer.style.opacity = '0';

            setTimeout(async () => {
                entryScreen.classList.add('hidden');
                btn.innerHTML = originalText;
                btn.style.pointerEvents = 'auto';
                
                // Birthday Format Sequence
                darkScreen.classList.remove('hidden');
                
                await sleep(500);
                await typeText(`Close your eyes...`, 90);
                await sleep(1500);
                
                await typeText(`Make a wish, ${name}...`, 80);
                await sleep(1500);
                
                await typeText(`Blow out the candles in...`, 70);
                await sleep(800);
                
                typingText.textContent = '3';
                typingText.style.fontSize = '8rem';
                await sleep(1000);
                typingText.textContent = '2';
                await sleep(1000);
                typingText.textContent = '1';
                await sleep(800);

                flashOverlay.classList.add('flash-active');
                
                setTimeout(() => {
                    darkScreen.classList.add('hidden');
                    typingText.style.fontSize = '4rem'; 
                    typingText.textContent = '';
                    
                    mainBg.style.opacity = '1';
                    shapesContainer.style.opacity = '1';
                    
                    bdayName.textContent = data.message + "!";
                    wishScreen.classList.remove('hidden');
                    wishScreen.classList.add('zoom-in');
                    
                    shootCannons();
                    animateConfetti();
                    
                    flashOverlay.classList.remove('flash-active');
                    flashOverlay.classList.add('flash-fade');
                    setTimeout(() => { flashOverlay.classList.remove('flash-fade'); }, 2000);
                }, 100);
            }, 800);
            
        } catch (error) {
            btn.innerHTML = originalText;
            btn.style.pointerEvents = 'auto';
            console.error("Error:", error);
            alert("Could not connect to backend.");
        }
    });

    resetBtn.addEventListener('click', () => {
        stopConfetti();
        wishScreen.classList.remove('zoom-in');
        wishScreen.classList.add('fade-out');

        setTimeout(() => {
            wishScreen.classList.add('hidden');
            wishScreen.classList.remove('fade-out');
            nameInput.value = '';
            entryScreen.classList.remove('hidden');
            entryScreen.classList.remove('zoom-out');
            entryScreen.classList.add('fade-in');
            nameInput.focus();
            entryScreen.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        }, 500);
    });
});
