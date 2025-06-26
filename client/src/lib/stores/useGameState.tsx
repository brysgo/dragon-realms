import { create } from 'zustand';

export type GamePhase = 'menu' | 'playing' | 'gameOver' | 'victory';

interface GameState {
  gamePhase: GamePhase;
  currentRealm: number;
  playerHealth: number;
  dragonHealth: number;
  
  // Actions
  startGame: () => void;
  restartGame: () => void;
  nextRealm: () => void;
  damagePlayer: () => void;
  damageDragon: () => void;
  resetHealth: () => void;
  gameOver: () => void;
  victory: () => void;
}

export const useGameState = create<GameState>((set, get) => ({
  gamePhase: 'menu',
  currentRealm: 1,
  playerHealth: 3,
  dragonHealth: 3,
  
  startGame: () => {
    set({
      gamePhase: 'playing',
      currentRealm: 1,
      playerHealth: 3,
      dragonHealth: 3
    });
  },
  
  restartGame: () => {
    set({
      gamePhase: 'menu',
      currentRealm: 1,
      playerHealth: 3,
      dragonHealth: 3
    });
  },
  
  nextRealm: () => {
    const { currentRealm } = get();
    
    if (currentRealm < 6) {
      set({ 
        currentRealm: currentRealm + 1,
        playerHealth: 3,
        dragonHealth: currentRealm === 5 ? 3 : get().dragonHealth
      });
    } else {
      set({ gamePhase: 'victory' });
    }
  },
  
  damagePlayer: () => {
    const { playerHealth } = get();
    const newHealth = playerHealth - 1;
    if (newHealth <= 0) {
      set({ playerHealth: 0, gamePhase: 'gameOver' });
    } else {
      set({ playerHealth: newHealth });
    }
  },
  
  damageDragon: () => {
    const { dragonHealth, currentRealm } = get();
    if (currentRealm === 6) {
      const newHealth = dragonHealth - 1;
      if (newHealth <= 0) {
        set({ dragonHealth: 0 });
        setTimeout(() => get().victory(), 1000);
      } else {
        set({ dragonHealth: newHealth });
      }
    }
  },
  
  resetHealth: () => {
    set({ playerHealth: 3 });
  },
  
  gameOver: () => {
    set({ gamePhase: 'gameOver' });
  },
  
  victory: () => {
    set({ gamePhase: 'victory' });
  }
}));
