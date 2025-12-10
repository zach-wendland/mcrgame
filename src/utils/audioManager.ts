/**
 * Audio management using Howler.js for The Black Parade: Carry On
 */

import { Howl, Howler } from 'howler';

interface AudioTrack {
  howl: Howl;
  volume: number;
}

class AudioManager {
  private music: Map<string, AudioTrack> = new Map();
  private sfx: Map<string, AudioTrack> = new Map();
  private currentMusic: string | null = null;
  private masterVolume = 1;
  private musicVolume = 0.7;
  private sfxVolume = 0.8;
  private isMuted = false;

  constructor() {
    // Attempt to unlock audio on first user interaction (mobile requirement)
    this.setupMobileUnlock();
  }

  private setupMobileUnlock(): void {
    const unlock = () => {
      Howler.ctx?.resume();
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    };
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('click', unlock, { once: true });
  }

  // Load a music track
  loadMusic(key: string, src: string, loop = true, volume = 1): void {
    if (this.music.has(key)) return;

    const howl = new Howl({
      src: [src],
      loop,
      volume: volume * this.musicVolume * this.masterVolume,
      html5: true, // Better for long music tracks
      preload: true
    });

    this.music.set(key, { howl, volume });
  }

  // Load a sound effect
  loadSfx(key: string, src: string, volume = 1): void {
    if (this.sfx.has(key)) return;

    const howl = new Howl({
      src: [src],
      volume: volume * this.sfxVolume * this.masterVolume,
      preload: true
    });

    this.sfx.set(key, { howl, volume });
  }

  // Play music with fade
  playMusic(key: string, fadeInMs = 1000): void {
    const track = this.music.get(key);
    if (!track) {
      console.warn(`Music track not found: ${key}`);
      return;
    }

    // Fade out current music if playing
    if (this.currentMusic && this.currentMusic !== key) {
      this.stopMusic(fadeInMs);
    }

    if (this.currentMusic === key) return; // Already playing

    track.howl.volume(0);
    track.howl.play();
    track.howl.fade(0, track.volume * this.musicVolume * this.masterVolume, fadeInMs);
    this.currentMusic = key;
  }

  // Stop music with fade
  stopMusic(fadeOutMs = 1000): void {
    if (!this.currentMusic) return;

    const track = this.music.get(this.currentMusic);
    if (track) {
      const currentKey = this.currentMusic;
      track.howl.fade(track.howl.volume(), 0, fadeOutMs);
      setTimeout(() => {
        const t = this.music.get(currentKey);
        if (t) t.howl.stop();
      }, fadeOutMs);
    }
    this.currentMusic = null;
  }

  // Play a sound effect
  playSfx(key: string): void {
    const track = this.sfx.get(key);
    if (!track) {
      console.warn(`SFX not found: ${key}`);
      return;
    }
    track.howl.play();
  }

  // Set master volume
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  // Set music volume
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  // Set SFX volume
  setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  // Mute/unmute
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
    return this.isMuted;
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    Howler.mute(muted);
  }

  private updateAllVolumes(): void {
    this.music.forEach((track) => {
      track.howl.volume(track.volume * this.musicVolume * this.masterVolume);
    });
    this.sfx.forEach((track) => {
      track.howl.volume(track.volume * this.sfxVolume * this.masterVolume);
    });
  }

  // Get current state (for settings UI)
  getState() {
    return {
      masterVolume: this.masterVolume,
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      isMuted: this.isMuted,
      currentMusic: this.currentMusic
    };
  }

  // Cleanup
  destroy(): void {
    this.music.forEach((track) => track.howl.unload());
    this.sfx.forEach((track) => track.howl.unload());
    this.music.clear();
    this.sfx.clear();
    this.currentMusic = null;
  }
}

// Singleton instance
export const audioManager = new AudioManager();
