import { useEffect, useRef } from 'react';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import { useGameState } from '@/lib/stores/useGameState';
import { useAudio } from '@/lib/stores/useAudio';

export default function Game() {
  const { gamePhase, startGame } = useGameState();
  const { setBackgroundMusic, setHitSound, setSuccessSound, startBackgroundMusic } = useAudio();
  
  // Initialize audio
  useEffect(() => {
    const backgroundMusic = new Audio('/sounds/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    setBackgroundMusic(backgroundMusic);
    
    const hitSound = new Audio('/sounds/hit.mp3');
    hitSound.volume = 0.5;
    setHitSound(hitSound);
    
    const successSound = new Audio('/sounds/success.mp3');
    successSound.volume = 0.7;
    setSuccessSound(successSound);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Start background music when game starts
  useEffect(() => {
    if (gamePhase === 'playing') {
      startBackgroundMusic();
    }
  }, [gamePhase, startBackgroundMusic]);

  return (
    <div className="w-full h-full relative bg-black">
      <GameCanvas />
      <GameUI />
      
      {gamePhase === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-8 text-yellow-400">
              PARKOUR REALMS
            </h1>
            <p className="text-xl mb-8">
              Navigate through 5 dangerous realms and defeat the dragon!
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="bg-gray-800 p-4 rounded">
                <h3 className="text-yellow-400 font-bold">Controls:</h3>
                <p>A/D or Arrow Keys - Move left/right</p>
                <p>W or Up Arrow - Jump</p>
                <p>Space - Shoot (Boss Battle)</p>
              </div>
            </div>
            <button 
              className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded transition-colors"
              onClick={() => useGameState.getState().startGame()}
            >
              START GAME
            </button>
          </div>
        </div>
      )}
      
      {gamePhase === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4 text-red-400">GAME OVER</h2>
            <p className="text-xl mb-8">You have fallen to the realm's dangers!</p>
            <button 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded transition-colors"
              onClick={() => useGameState.getState().restartGame()}
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      )}
      
      {gamePhase === 'victory' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4 text-green-400">VICTORY!</h2>
            <p className="text-xl mb-8">You have conquered all realms and defeated the dragon!</p>
            <button 
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded transition-colors"
              onClick={() => useGameState.getState().restartGame()}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
