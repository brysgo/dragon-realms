import { useEffect, useRef } from 'react';
import { GameEngine } from '@/lib/game/GameEngine';
import { useGameState } from '@/lib/stores/useGameState';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const { gamePhase } = useGameState();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize game engine
    gameEngineRef.current = new GameEngine(ctx, canvas.width, canvas.height);
    
    // Start game loop
    let animationId: number;
    const gameLoop = (timestamp: number) => {
      if (gameEngineRef.current && gamePhase === 'playing') {
        gameEngineRef.current.update(timestamp);
        gameEngineRef.current.render();
      }
      animationId = requestAnimationFrame(gameLoop);
    };
    
    animationId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [gamePhase]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
}
