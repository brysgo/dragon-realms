import { PlayerController } from './Player';
import { RealmManager } from './Realm';
import { Dragon, type Laser } from './Dragon';
import { CollisionDetector } from './Collision';
import { ParticleSystem } from './Particle';
import { useGameState } from '@/lib/stores/useGameState';
import { useAudio } from '@/lib/stores/useAudio';

export class GameEngine {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  player: PlayerController;
  realmManager: RealmManager;
  dragon: Dragon | null = null;
  particles: ParticleSystem;
  lasers: Laser[] = [];
  lastTime: number = 0;
  lastRealmTransition: number = 0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.canvasWidth = width;
    this.canvasHeight = height;
    
    // Initialize game objects
    this.player = new PlayerController(100, this.canvasHeight - 200);
    this.realmManager = new RealmManager(width, height);
    this.particles = new ParticleSystem();
    
    // Set up realm change listener
    this.setupRealmListener();
  }

  setupRealmListener() {
    // Listen for realm changes using the proper Zustand subscribe method
    let currentRealm = useGameState.getState().currentRealm;
    
    useGameState.subscribe((state) => {
      if (state.currentRealm !== currentRealm) {
        currentRealm = state.currentRealm;
        this.switchRealm(currentRealm);
      }
    });
  }

  switchRealm(realmNumber: number) {
    this.realmManager.setupRealm(realmNumber);
    
    // Reset player position
    this.player.setPosition(100, this.canvasHeight - 200);
    
    // Setup dragon for boss battle
    if (realmNumber === 6) {
      this.dragon = new Dragon(this.canvasWidth - 200, this.canvasHeight - 200);
    } else {
      this.dragon = null;
    }
    
    // Clear projectiles
    this.lasers = [];
    
    // Play sound
    useAudio.getState().playSuccess();
  }

  update(timestamp: number) {
    const deltaTime = this.lastTime ? (timestamp - this.lastTime) / 1000 : 0;
    this.lastTime = timestamp;
    
    if (deltaTime > 0.1) return; // Skip large time jumps

    const gameState = useGameState.getState();
    if (gameState.gamePhase !== 'playing') return;

    // Update game objects
    this.player.update(deltaTime);
    this.realmManager.update(deltaTime);
    this.particles.update(deltaTime);
    
    if (this.dragon) {
      this.dragon.update(deltaTime);
    }

    // Update lasers
    this.updateLasers(deltaTime);

    // Handle shooting
    if (gameState.currentRealm === 6 && this.player.canShootLaser()) {
      if (this.player.shoot()) {
        this.createLaser();
        console.log('Laser fired! Total lasers:', this.lasers.length);
      }
    }

    // Check collisions
    this.checkCollisions();
  }

  updateLasers(deltaTime: number) {
    this.lasers = this.lasers.filter(laser => {
      if (laser.active) {
        laser.x += laser.velocityX * deltaTime;
        
        // Remove lasers that go off screen
        if (laser.x > this.canvasWidth + 50) {
          laser.active = false;
        }
        
        // Check dragon collision
        if (this.dragon && this.dragon.checkLaserCollision(laser)) {
          laser.active = false;
          this.particles.createLaserHit(laser.x, laser.y);
          useAudio.getState().playHit();
        }
      }
      return laser.active;
    });
  }

  createLaser() {
    const playerBounds = this.player.getBounds();
    const laserX = this.player.player.facingRight ? 
      playerBounds.x + playerBounds.width : 
      playerBounds.x - 35;
    
    this.lasers.push({
      x: laserX,
      y: playerBounds.y + playerBounds.height / 2 - 2,
      width: 35,
      height: 4,
      velocityX: this.player.player.facingRight ? 600 : -600,
      active: true
    });
    
    // Create muzzle flash effect
    this.particles.createLaserHit(laserX, playerBounds.y + playerBounds.height / 2);
  }

  checkCollisions() {
    const playerBounds = this.player.getBounds();
    const gameState = useGameState.getState();

    // Check bounds
    const bounded = CollisionDetector.checkBounds(playerBounds, this.canvasWidth, this.canvasHeight);
    if (bounded.y > this.canvasHeight) {
      gameState.damagePlayer();
      return;
    }

    // Ground collision detection
    const groundCheck = CollisionDetector.checkGroundCollision(
      playerBounds,
      this.realmManager.platforms.filter(p => !p.exploded)
    );
    
    if (groundCheck.collision && this.player.player.velocityY > 0) {
      const resolved = CollisionDetector.resolveCollision(
        playerBounds,
        groundCheck.platform!,
        this.player.player.velocityY
      );
      this.player.player.y = resolved.newY;
      this.player.setOnGround(resolved.onGround);
      
      // Check if player landed on an explosive platform
      if (groundCheck.platform && groundCheck.platform.explosive) {
        // Find the platform index
        const platformIndex = this.realmManager.platforms.findIndex(p => p === groundCheck.platform);
        if (platformIndex !== -1) {
          this.realmManager.explodePillar(platformIndex);
          this.particles.createExplosion(
            groundCheck.platform.x + groundCheck.platform.width / 2,
            groundCheck.platform.y + groundCheck.platform.height / 2
          );
          gameState.resetHealth();
          this.player.setPosition(100, this.canvasHeight - 200);
          useAudio.getState().playHit();
          return;
        }
      }
    }

    // Realm-specific collision checks
    const realmCollision = this.realmManager.checkCollisions(playerBounds);
    
    if (realmCollision.collision) {
      switch (realmCollision.type) {
        case 'spike':
        case 'lightning':
        case 'deadly_wall':
          gameState.resetHealth();
          this.player.setPosition(100, this.canvasHeight - 200);
          useAudio.getState().playHit();
          break;
          

          
        case 'door':
          const now = Date.now();
          if (now - this.lastRealmTransition > 1000) { // 1 second cooldown
            this.lastRealmTransition = now;
            gameState.nextRealm();
          }
          break;
          
        case 'safe_wall':
          // Player can pass through
          break;
      }
    }

    // Dragon fireball collision
    if (this.dragon) {
      if (this.dragon.checkFireballCollision(playerBounds)) {
        gameState.damagePlayer();
        useAudio.getState().playHit();
      }
    }
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Render realm
    this.realmManager.render(this.ctx);
    
    // Render player (with laser gun in boss battle)
    if (useGameState.getState().currentRealm === 6) {
      this.player.renderWithLaserGun(this.ctx);
    } else {
      this.player.render(this.ctx);
    }
    
    // Render dragon
    if (this.dragon) {
      this.dragon.render(this.ctx);
    }
    
    // Render lasers with bright glow effect
    this.lasers.forEach(laser => {
      if (laser.active) {
        // Outer glow
        this.ctx.shadowColor = '#00FF00';
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillRect(laser.x - 2, laser.y - 1, laser.width + 4, laser.height + 2);
        
        // Inner bright core
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
      }
    });
    
    // Render particles
    this.particles.render(this.ctx);
  }
}
