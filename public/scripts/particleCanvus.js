"use strict";

export function sporeCanvas(
  targetElementClassName,
  particleCount = 400,
  particleMinSize = 1,
  particleMaxSize = 3.5,
  particleMinSpeed = 0.1,
  particleMaxSpeed = 1.5,
  particleWobbleSpeed = 0.1,
  particleWobble = 0,
  canvasSize = 2000,
) {
  const particleColors = ["#FFFFFF"];
  // Reduce particle count on mobile devices
  if (window.innerWidth < 768) {
    particleCount = particleCount > 40 ? 20 : particleCount;
    canvasSize = canvasSize > 1000 ? 1000 : canvasSize;
  }

  const canvasElements = document.querySelectorAll(
    targetElementClassName,
  );

  canvasElements.forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const particles = [];

    class Particle {

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size =
          Math.random() * (particleMaxSize - particleMinSize) + particleMinSize;
        this.speedY =
          Math.random() * (particleMaxSpeed - particleMinSpeed) -
          particleMaxSpeed;
        this.wobble = Math.random() * particleWobble;
        this.wobbleSpeed = Math.random() * particleWobbleSpeed;
        // Assign a random color from particleColors
        this.color =
          particleColors[Math.floor(Math.random() * particleColors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * this.wobbleSpeed) * this.wobble;

        if (this.y < -20) {
          this.y = canvas.height + Math.random() * 20;
          this.x = Math.random() * canvas.width;
          // Optionally, assign a new random color when respawned
          this.color =
            particleColors[Math.floor(Math.random() * particleColors.length)];
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  });

  window.addEventListener("resize", () => {
    canvasElements.forEach((canvas) => {
      canvas.width = canvasSize;
      canvas.height = canvasSize;
    });
  });
}
