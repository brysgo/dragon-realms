export interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export class ParticleSystem {
  particles: Particle[] = [];

  createExplosion(x: number, y: number, count: number = 10) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
      const speed = 100 + Math.random() * 200;
      
      this.particles.push({
        x,
        y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        color: '#FF' + Math.floor(Math.random() * 128 + 127).toString(16) + '00',
        size: 3 + Math.random() * 4
      });
    }
  }

  createLaserHit(x: number, y: number) {
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 100;
      
      this.particles.push({
        x,
        y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        life: 0.5,
        maxLife: 0.5,
        color: '#00FF00',
        size: 2 + Math.random() * 2
      });
    }
  }

  update(deltaTime: number) {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.velocityX * deltaTime;
      particle.y += particle.velocityY * deltaTime;
      particle.life -= deltaTime;
      
      // Apply gravity to explosion particles
      if (particle.color.includes('FF')) {
        particle.velocityY += 200 * deltaTime;
      }
      
      return particle.life > 0;
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}
