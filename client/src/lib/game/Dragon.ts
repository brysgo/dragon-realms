import { useGameState } from '@/lib/stores/useGameState';

export interface Fireball {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  active: boolean;
}

export interface Laser {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  active: boolean;
}

export class Dragon {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  lastAttackTime: number;
  attackCooldown: number;
  fireballs: Fireball[];
  animationTime: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 120;
    this.height = 80;
    this.health = 3;
    this.lastAttackTime = 0;
    this.attackCooldown = 2000; // 2 seconds
    this.fireballs = [];
    this.animationTime = 0;
  }

  update(deltaTime: number) {
    this.animationTime += deltaTime;

    // Update fireballs
    this.fireballs = this.fireballs.filter(fireball => {
      if (fireball.active) {
        fireball.x += fireball.velocityX * deltaTime;
        fireball.y += fireball.velocityY * deltaTime;
        
        // Remove fireballs that go off screen
        if (fireball.x < -50 || fireball.x > 2000 || fireball.y > 1000) {
          fireball.active = false;
        }
      }
      return fireball.active;
    });

    // Attack pattern
    const now = Date.now();
    if (now - this.lastAttackTime > this.attackCooldown) {
      this.attack();
      this.lastAttackTime = now;
    }
  }

  attack() {
    // Create fireball
    const fireball: Fireball = {
      x: this.x,
      y: this.y + this.height / 2,
      width: 20,
      height: 20,
      velocityX: -300, // Move towards player
      velocityY: Math.random() * 100 - 50, // Some vertical variation
      active: true
    };
    
    this.fireballs.push(fireball);
  }

  takeDamage() {
    this.health--;
    useGameState.getState().damageDragon();
  }

  render(ctx: CanvasRenderingContext2D) {
    // Dragon body (dark red/black)
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Dragon head
    ctx.fillStyle = '#B22222';
    ctx.fillRect(this.x + this.width - 40, this.y - 20, 60, 40);
    
    // Eyes
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(this.x + this.width - 30, this.y - 15, 8, 8);
    ctx.fillRect(this.x + this.width - 15, this.y - 15, 8, 8);
    
    // Wings (animated)
    const wingOffset = Math.sin(this.animationTime * 3) * 10;
    ctx.fillStyle = '#4A0000';
    ctx.fillRect(this.x - 20, this.y - wingOffset, 30, 60);
    ctx.fillRect(this.x - 20, this.y + 40 + wingOffset, 30, 60);
    
    // Render fireballs
    ctx.fillStyle = '#FF4500';
    this.fireballs.forEach(fireball => {
      if (fireball.active) {
        ctx.beginPath();
        ctx.arc(
          fireball.x + fireball.width / 2,
          fireball.y + fireball.height / 2,
          fireball.width / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // Fire effect
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(
          fireball.x + fireball.width / 2,
          fireball.y + fireball.height / 2,
          fireball.width / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.fillStyle = '#FF4500';
      }
    });
  }

  checkFireballCollision(playerBounds: any): boolean {
    for (const fireball of this.fireballs) {
      if (fireball.active &&
          playerBounds.x < fireball.x + fireball.width &&
          playerBounds.x + playerBounds.width > fireball.x &&
          playerBounds.y < fireball.y + fireball.height &&
          playerBounds.y + playerBounds.height > fireball.y) {
        fireball.active = false;
        return true;
      }
    }
    return false;
  }

  checkLaserCollision(laser: Laser): boolean {
    if (laser.active &&
        laser.x < this.x + this.width &&
        laser.x + laser.width > this.x &&
        laser.y < this.y + this.height &&
        laser.y + laser.height > this.y) {
      this.takeDamage();
      return true;
    }
    return false;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}
