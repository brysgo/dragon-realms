import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  isBackgroundMusicPlaying: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: true, // Start muted by default
  isBackgroundMusicPlaying: false,
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  toggleMute: () => {
    const { isMuted, backgroundMusic, isBackgroundMusicPlaying } = get();
    const newMutedState = !isMuted;
    
    // Handle background music muting
    if (backgroundMusic) {
      if (newMutedState) {
        // Muting - stop background music
        backgroundMusic.pause();
        set({ isMuted: newMutedState, isBackgroundMusicPlaying: false });
      } else {
        // Unmuting - start background music if it was playing
        set({ isMuted: newMutedState });
        // Auto-start background music when unmuting
        setTimeout(() => get().startBackgroundMusic(), 100);
      }
    } else {
      set({ isMuted: newMutedState });
    }
    
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  startBackgroundMusic: () => {
    const { backgroundMusic, isMuted, isBackgroundMusicPlaying } = get();
    if (backgroundMusic && !isMuted && !isBackgroundMusicPlaying) {
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.2; // Lower volume so it doesn't overpower effects
      backgroundMusic.play()
        .then(() => {
          set({ isBackgroundMusicPlaying: true });
          console.log('Background music started');
        })
        .catch(error => {
          console.log('Background music play prevented:', error);
        });
    }
  },
  
  stopBackgroundMusic: () => {
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      backgroundMusic.pause();
      set({ isBackgroundMusicPlaying: false });
      console.log('Background music stopped');
    }
  },
}));
