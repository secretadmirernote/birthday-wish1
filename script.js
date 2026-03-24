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
        const colors = ['#ffd166', '#ff8acb', '#8be7ff', '#c7f464', '#a78bfa'];
        for (let index = 0; index < 40; index += 1) {
            this.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 2,
                life: 1,
                size: Math.random() * 5 + 1,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    update() {
        this.particles = this.particles.filter((particle) => particle.life > 0);
        this.particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.18;
            particle.life -= 0.02;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach((particle) => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    animate() {
        this.update();
        this.draw();

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationId = null;
        }
    }

    burst(x, y) {
        this.createParticles(x, y);
        if (!this.animationId) {
            this.animate();
        }
    }
}

function setupRevealAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));
}

function setupRotatingLine() {
    const lines = [
        'She doesn’t chase noise; she chases purpose — and that’s why she shines.',
        'Focused mind, fearless heart, and a soul full of fire.',
        'Some people glow with trends; she glows with ambition.'
    ];

    let current = 0;
    const lineNode = document.getElementById('rotatingLine');

    setInterval(() => {
        current = (current + 1) % lines.length;
        lineNode.textContent = lines[current];
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const confetti = new Confetti(document.getElementById('confetti'));

    document.getElementById('burstBtn').addEventListener('click', (event) => {
        confetti.burst(event.clientX, event.clientY);
    });

    document.addEventListener('click', (event) => {
        confetti.burst(event.clientX, event.clientY);
    });

    setupRevealAnimation();
    setupRotatingLine();
});
