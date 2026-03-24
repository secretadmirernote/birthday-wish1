function updateCountdown() {
    const birthDate = new Date('2026-03-25T00:00:00').getTime();
    
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = birthDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
        if (distance < 0) {
            clearInterval(interval);
            document.getElementById('countdown').innerHTML = '<h2>Happy Birthday Alice! 🎉</h2>';
        }
    }, 1000);
}

class Confetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles(x, y) {
        const colors = ['#ffd700', '#ff6b9d', '#4ecdc4', '#45b7d1', '#ff9ff3', '#54a0ff'];
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 2,
                life: 1,
                size: Math.random() * 5 + 2,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }
    
    update() {
        this.particles = this.particles.filter(p => p.life > 0);
        
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life -= 0.02;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    animate() {
        this.update();
        this.draw();
        
        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
    
    burst(x, y) {
        this.createParticles(x, y);
        
        if (!this.animationId) {
            this.animate();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    
    const canvas = document.getElementById('confetti');
    const confetti = new Confetti(canvas);
    
    document.addEventListener('click', (e) => {
        confetti.burst(e.clientX, e.clientY);
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.wish-card').forEach(card => {
        observer.observe(card);
    });
});
