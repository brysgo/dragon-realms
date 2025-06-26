export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  onGround: boolean;
  facingRight: boolean;
}

export class PlayerController {
  player: Player;
  keys: { [key: string]: boolean } = {};
  canShoot: boolean = true;
  lastShotTime: number = 0;

  constructor(x: number, y: number) {
    this.player = {
      x,
      y,
      width: 32,
      height: 48,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      facingRight: true
    };
    
    this.setupControls();
  }

  setupControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  update(deltaTime: number) {
    // Horizontal movement
    this.player.velocityX = 0;
    
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
      this.player.velocityX = -200;
      this.player.facingRight = false;
    }
    if (this.keys['KeyD'] || this.keys['ArrowRight']) {
      this.player.velocityX = 200;
      this.player.facingRight = true;
    }

    // Jumping
    if ((this.keys['KeyW'] || this.keys['ArrowUp']) && this.player.onGround) {
      this.player.velocityY = -400;
      this.player.onGround = false;
    }

    // Apply gravity
    this.player.velocityY += 800 * deltaTime; // gravity

    // Update position
    this.player.x += this.player.velocityX * deltaTime;
    this.player.y += this.player.velocityY * deltaTime;

    // Update shooting cooldown
    if (Date.now() - this.lastShotTime > 300) {
      this.canShoot = true;
    }
  }

  canShootLaser(): boolean {
    return this.canShoot && (this.keys['Space']);
  }

  shoot() {
    if (this.canShoot) {
      this.canShoot = false;
      this.lastShotTime = Date.now();
      return true;
    }
    return false;
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw character with specified colors
    const { x, y, width, height } = this.player;
    
    // Body (blue jacket)
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(x + 8, y + 16, width - 16, height - 32);
    
    // Pants (brown)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 8, y + height - 24, width - 16, 16);
    
    // Shoes (yellow)
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + 4, y + height - 8, width - 8, 8);
    
    // Helmet (yellow with white goggles)
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + 6, y, width - 12, 20);
    
    // Goggles (white)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 8, y + 4, 6, 6);
    ctx.fillRect(x + width - 14, y + 4, 6, 6);
    
    // Simple face
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(x + 10, y + 12, width - 20, 8);
  }

  getBounds() {
    return {
      x: this.player.x,
      y: this.player.y,
      width: this.player.width,
      height: this.player.height
    };
  }

  setPosition(x: number, y: number) {
    this.player.x = x;
    this.player.y = y;
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    this.player.onGround = false;
  }

  setOnGround(onGround: boolean) {
    this.player.onGround = onGround;
    if (onGround) {
      this.player.velocityY = 0;
    }
  }
}
