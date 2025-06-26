import { useGameState } from '@/lib/stores/useGameState';
import { useAudio } from '@/lib/stores/useAudio';

export default function GameUI() {
  const { currentRealm, playerHealth, dragonHealth, gamePhase } = useGameState();
  const { isMuted, toggleMute } = useAudio();

  if (gamePhase !== 'playing') return null;

  const realmNames = [
    'Lava Parkour',
    'Lightning Storm', 
    'Ice Spikes',
    'Explosive Pillars',
    'The Choice',
    'Dragon Boss'
  ];

  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
      <div className="flex justify-between items-start">
        {/* Realm Info */}
        <div className="bg-black bg-opacity-70 text-white p-4 rounded pointer-events-auto">
          <h3 className="text-xl font-bold text-yellow-400">
            Realm {currentRealm}: {realmNames[currentRealm - 1]}
          </h3>
        </div>

        {/* Player Health */}
        <div className="bg-black bg-opacity-70 text-white p-4 rounded pointer-events-auto">
          <div className="flex items-center space-x-2">
            <span className="font-bold">Health:</span>
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded ${
                  i < playerHealth ? 'bg-red-500' : 'bg-gray-600'
                }`}
              >
                ❤️
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dragon Health (Boss Battle Only) */}
      {currentRealm === 6 && (
        <div className="absolute top-20 right-4 bg-black bg-opacity-70 text-white p-4 rounded pointer-events-auto">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-red-400">Dragon:</span>
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded ${
                  i < dragonHealth ? 'bg-red-500' : 'bg-gray-600'
                }`}
              >
                🔥
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio Toggle */}
      <button
        className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded pointer-events-auto hover:bg-opacity-90 transition-all"
        onClick={toggleMute}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded pointer-events-auto text-sm">
        <div>Move: A/D or ←→</div>
        <div>Jump: W or ↑</div>
        {currentRealm === 6 && <div>Shoot: Space</div>}
      </div>
    </div>
  );
}
