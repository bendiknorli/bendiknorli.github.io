const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let time = 0;

const mouse = {
    x: undefined,
    y: undefined,
    radius: 200
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'rgba(255, 255, 255, 0.5)';
        
        // Unique properties to prevent clumping
        this.angleOffset = (Math.random() - 0.5) * 0.8; // Slight deviation from the flow
        this.speedModifier = Math.random() * 0.5 + 0.8; // Vary speed between 0.8x and 1.3x
        this.friction = Math.random() * 0.04 + 0.94; // Vary friction slightly (0.94 - 0.98)
    }

    update() {
        // Dynamic Flow field effect
        const scale = 0.008;
        // Add angleOffset so each particle sees a slightly different "version" of the flow
        const flowAngle = ((Math.cos(this.x * scale + time) + Math.sin(this.y * scale + time)) * Math.PI) + this.angleOffset;
        
        this.speedX += Math.cos(flowAngle) * 0.1 * this.speedModifier;
        this.speedY += Math.sin(flowAngle) * 0.1 * this.speedModifier;

        // Friction
        this.speedX *= this.friction;
        this.speedY *= this.friction;

        // Mouse interaction
        if (mouse.x != undefined && mouse.y != undefined) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = forceDirectionX * force * 3;
                const directionY = forceDirectionY * force * 3;
                
                this.speedX -= directionX;
                this.speedY -= directionY;
            }
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 5000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    // Update time for the flow field
    time += 0.002;

    ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Connect particles
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance/1000})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

init();
animate();
