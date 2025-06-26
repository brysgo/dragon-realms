export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class CollisionDetector {
  static checkAABB(rect1: Rectangle, rect2: Rectangle): boolean {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  static checkGroundCollision(player: Rectangle, platforms: any[]): { collision: boolean, platform?: any } {
    for (const platform of platforms) {
      // Check if player is falling onto platform from above
      if (player.x < platform.x + platform.width &&
          player.x + player.width > platform.x &&
          player.y + player.height > platform.y &&
          player.y + player.height < platform.y + platform.height + 10) {
        return { collision: true, platform };
      }
    }
    return { collision: false };
  }

  static resolveCollision(player: Rectangle, platform: any, playerVelocityY: number): { newY: number, onGround: boolean } {
    // Landing on top of platform
    if (playerVelocityY > 0) {
      return {
        newY: platform.y - player.height,
        onGround: true
      };
    }
    
    return { newY: player.y, onGround: false };
  }

  static checkBounds(player: Rectangle, canvasWidth: number, canvasHeight: number): Rectangle {
    const bounded = { ...player };
    
    // Left and right bounds
    if (bounded.x < 0) bounded.x = 0;
    if (bounded.x + bounded.width > canvasWidth) bounded.x = canvasWidth - bounded.width;
    
    // Bottom bound (death)
    if (bounded.y > canvasHeight) {
      // Player fell off screen
      return { ...bounded, y: canvasHeight + 100 }; // Signal death
    }
    
    return bounded;
  }

  static pointInRect(pointX: number, pointY: number, rect: Rectangle): boolean {
    return pointX >= rect.x &&
           pointX <= rect.x + rect.width &&
           pointY >= rect.y &&
           pointY <= rect.y + rect.height;
  }
}
