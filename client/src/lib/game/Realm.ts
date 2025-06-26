export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  explosive?: boolean;
  exploded?: boolean;
}

export interface Spike {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Door {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Lightning {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  timer: number;
}

export interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
  deadly: boolean;
}

export class RealmManager {
  currentRealm: number = 1;
  platforms: Platform[] = [];
  spikes: Spike[] = [];
  door: Door | null = null;
  lightning: Lightning[] = [];
  walls: Wall[] = [];
  canvasWidth: number;
  canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.setupRealm(1);
  }

  setupRealm(realmNumber: number) {
    this.currentRealm = realmNumber;
    this.platforms = [];
    this.spikes = [];
    this.lightning = [];
    this.walls = [];
    this.door = null;

    const ground = this.canvasHeight - 60;

    switch (realmNumber) {
      case 1: // Lava Parkour
        this.setupLavaRealm(ground);
        break;
      case 2: // Lightning Storm
        this.setupLightningRealm(ground);
        break;
      case 3: // Ice Spikes
        this.setupIceRealm(ground);
        break;
      case 4: // Explosive Pillars
        this.setupExplosiveRealm(ground);
        break;
      case 5: // The Choice
        this.setupChoiceRealm(ground);
        break;
      case 6: // Boss Battle
        this.setupBossRealm(ground);
        break;
    }
  }

  setupLavaRealm(ground: number) {
    // Starting platform
    this.platforms.push({ x: 50, y: ground, width: 100, height: 60, color: '#8B4513' });
    
    // Lava platforms
    this.platforms.push({ x: 200, y: ground - 80, width: 80, height: 20, color: '#FF4500' });
    this.platforms.push({ x: 350, y: ground - 120, width: 80, height: 20, color: '#FF4500' });
    this.platforms.push({ x: 500, y: ground - 160, width: 80, height: 20, color: '#FF4500' });
    this.platforms.push({ x: 650, y: ground - 100, width: 80, height: 20, color: '#FF4500' });
    this.platforms.push({ x: 800, y: ground - 60, width: 80, height: 20, color: '#FF4500' });
    
    // Door
    this.door = { x: this.canvasWidth - 100, y: ground - 80, width: 60, height: 80 };
  }

  setupLightningRealm(ground: number) {
    // Platforms
    this.platforms.push({ x: 50, y: ground, width: 100, height: 60, color: '#4A4A4A' });
    this.platforms.push({ x: 200, y: ground - 60, width: 80, height: 20, color: '#4A4A4A' });
    this.platforms.push({ x: 350, y: ground - 120, width: 80, height: 20, color: '#4A4A4A' });
    this.platforms.push({ x: 500, y: ground - 80, width: 80, height: 20, color: '#4A4A4A' });
    this.platforms.push({ x: 650, y: ground - 140, width: 80, height: 20, color: '#4A4A4A' });
    
    // Lightning bolts
    for (let i = 0; i < 5; i++) {
      this.lightning.push({
        x: 250 + i * 150,
        y: 0,
        width: 20,
        height: this.canvasHeight,
        active: false,
        timer: Math.random() * 3000
      });
    }
    
    this.door = { x: this.canvasWidth - 100, y: ground - 80, width: 60, height: 80 };
  }

  setupIceRealm(ground: number) {
    // Ground spikes
    for (let x = 0; x < this.canvasWidth; x += 40) {
      this.spikes.push({ x, y: ground + 60, width: 30, height: 30 });
    }
    
    // Ice pillars of different sizes
    this.platforms.push({ x: 50, y: ground - 40, width: 60, height: 100, color: '#87CEEB' });
    this.platforms.push({ x: 180, y: ground - 80, width: 40, height: 140, color: '#87CEEB' });
    this.platforms.push({ x: 280, y: ground - 120, width: 50, height: 180, color: '#87CEEB' });
    this.platforms.push({ x: 400, y: ground - 60, width: 45, height: 120, color: '#87CEEB' });
    this.platforms.push({ x: 520, y: ground - 100, width: 55, height: 160, color: '#87CEEB' });
    this.platforms.push({ x: 640, y: ground - 140, width: 40, height: 200, color: '#87CEEB' });
    this.platforms.push({ x: 750, y: ground - 80, width: 60, height: 140, color: '#87CEEB' });
    
    this.door = { x: this.canvasWidth - 100, y: ground - 80, width: 60, height: 80 };
  }

  setupExplosiveRealm(ground: number) {
    // White room background
    this.platforms.push({ x: 0, y: ground, width: this.canvasWidth, height: 60, color: '#FFFFFF' });
    
    // 5 pillars total - 4 on right (explosive), 1 on left (explosive), others safe
    const pillarWidth = 80;
    const pillarHeight = 200;
    
    // Safe starting platform
    this.platforms.push({ x: 50, y: ground, width: 100, height: 60, color: '#FFFFFF' });
    
    // Left side pillar (explosive - red)
    this.platforms.push({
      x: 200,
      y: ground - pillarHeight,
      width: pillarWidth,
      height: pillarHeight,
      color: '#FF6B6B',
      explosive: true,
      exploded: false
    });
    
    // Safe middle pillars (green)
    this.platforms.push({
      x: 320,
      y: ground - pillarHeight,
      width: pillarWidth,
      height: pillarHeight,
      color: '#90EE90',
      explosive: false,
      exploded: false
    });
    
    this.platforms.push({
      x: 440,
      y: ground - pillarHeight,
      width: pillarWidth,
      height: pillarHeight,
      color: '#90EE90',
      explosive: false,
      exploded: false
    });
    
    // Right side pillars (4 explosive - red)
    for (let i = 0; i < 4; i++) {
      this.platforms.push({
        x: this.canvasWidth - 200 - i * 100,
        y: ground - pillarHeight,
        width: pillarWidth,
        height: pillarHeight,
        color: '#FF6B6B',
        explosive: true,
        exploded: false
      });
    }
    
    this.door = { x: this.canvasWidth - 100, y: ground - 80, width: 60, height: 80 };
  }

  setupChoiceRealm(ground: number) {
    // Ground platform for walking
    this.platforms.push({ x: 0, y: ground, width: this.canvasWidth, height: 60, color: '#8B4513' });
    
    // Starting area (left side)
    this.platforms.push({ x: 50, y: ground - 20, width: 150, height: 20, color: '#A0522D' });
    
    // Two walls with gaps to walk through
    this.walls.push({
      x: this.canvasWidth / 2 - 150,
      y: ground - 200,
      width: 100,
      height: 140, // Shorter so player can walk under
      deadly: true // Left wall kills
    });
    
    this.walls.push({
      x: this.canvasWidth / 2 + 50,
      y: ground - 200,
      width: 100,
      height: 140, // Shorter so player can walk under
      deadly: false // Right wall is safe
    });
    
    // Platform after the choice
    this.platforms.push({ x: this.canvasWidth - 200, y: ground - 20, width: 100, height: 20, color: '#A0522D' });
    
    this.door = { x: this.canvasWidth - 100, y: ground - 80, width: 60, height: 80 };
  }

  setupBossRealm(ground: number) {
    // Simple arena
    this.platforms.push({ x: 0, y: ground, width: this.canvasWidth, height: 60, color: '#333333' });
    this.door = { x: this.canvasWidth - 100, y: ground - 80, width: 60, height: 80 };
  }

  update(deltaTime: number) {
    // Update lightning
    this.lightning.forEach(bolt => {
      bolt.timer -= deltaTime * 1000;
      if (bolt.timer <= 0) {
        bolt.active = !bolt.active;
        bolt.timer = bolt.active ? 500 : 1000 + Math.random() * 2000;
      }
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    // Clear with realm-specific background
    const backgrounds = {
      1: '#8B0000', // Dark red for lava
      2: '#2F2F2F', // Dark gray for lightning
      3: '#E0F6FF', // Light blue for ice
      4: '#FFFFFF', // White for explosive room
      5: '#4A4A4A', // Gray for choice room
      6: '#1A1A1A'  // Very dark for boss
    };
    
    ctx.fillStyle = backgrounds[this.currentRealm as keyof typeof backgrounds] || '#000000';
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Render platforms
    this.platforms.forEach(platform => {
      if (!platform.exploded) {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        if (platform.explosive) {
          // Add warning pattern
          ctx.fillStyle = '#FFFF00';
          ctx.fillRect(platform.x + 10, platform.y + 10, platform.width - 20, 10);
        }
      }
    });

    // Render spikes
    ctx.fillStyle = '#FFFFFF';
    this.spikes.forEach(spike => {
      ctx.beginPath();
      ctx.moveTo(spike.x, spike.y + spike.height);
      ctx.lineTo(spike.x + spike.width / 2, spike.y);
      ctx.lineTo(spike.x + spike.width, spike.y + spike.height);
      ctx.closePath();
      ctx.fill();
    });

    // Render lightning
    this.lightning.forEach(bolt => {
      if (bolt.active) {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(bolt.x, bolt.y, bolt.width, bolt.height);
        
        // Add electrical effect
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let y = bolt.y; y < bolt.y + bolt.height; y += 20) {
          ctx.lineTo(bolt.x + bolt.width / 2 + Math.random() * 10 - 5, y);
        }
        ctx.stroke();
      }
    });

    // Render walls
    this.walls.forEach(wall => {
      ctx.fillStyle = wall.deadly ? '#FF0000' : '#00FF00';
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
      
      // Add text indicator
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        wall.deadly ? 'DEATH' : 'SAFE',
        wall.x + wall.width / 2,
        wall.y + wall.height / 2
      );
    });

    // Render door
    if (this.door) {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(this.door.x, this.door.y, this.door.width, this.door.height);
      
      // Door details
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(this.door.x + 10, this.door.y + 10, this.door.width - 20, this.door.height - 20);
      ctx.fillStyle = '#000000';
      ctx.fillRect(this.door.x + this.door.width - 15, this.door.y + this.door.height / 2 - 3, 6, 6);
    }
  }

  explodePillar(platformIndex: number) {
    if (this.platforms[platformIndex] && this.platforms[platformIndex].explosive) {
      this.platforms[platformIndex].exploded = true;
    }
  }

  checkCollisions(playerBounds: any): { collision: boolean, type: string, index?: number } {
    // Check platform collisions
    for (let i = 0; i < this.platforms.length; i++) {
      const platform = this.platforms[i];
      if (platform.exploded) continue;
      
      if (this.rectCollision(playerBounds, platform)) {
        return { collision: true, type: 'platform', index: i };
      }
    }

    // Check spike collisions
    for (const spike of this.spikes) {
      if (this.rectCollision(playerBounds, spike)) {
        return { collision: true, type: 'spike' };
      }
    }

    // Check lightning collisions
    for (const bolt of this.lightning) {
      if (bolt.active && this.rectCollision(playerBounds, bolt)) {
        return { collision: true, type: 'lightning' };
      }
    }

    // Check wall collisions
    for (const wall of this.walls) {
      if (this.rectCollision(playerBounds, wall)) {
        return { collision: true, type: wall.deadly ? 'deadly_wall' : 'safe_wall' };
      }
    }

    // Check door collision
    if (this.door && this.rectCollision(playerBounds, this.door)) {
      return { collision: true, type: 'door' };
    }

    return { collision: false, type: '' };
  }

  private rectCollision(rect1: any, rect2: any): boolean {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }
}
