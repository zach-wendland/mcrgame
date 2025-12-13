/**
 * Audio Generator - Creates procedural audio using Web Audio API
 * Since no audio files exist, this generates thematic placeholder sounds
 */

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  volume: number;
  filterFreq?: number;
  reverb?: number;
}

const SOUND_CONFIGS: Record<string, SoundConfig> = {
  'piano-note': {
    frequency: 440, // A4
    duration: 2.0,
    type: 'sine',
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 1.5 },
    volume: 0.5,
    reverb: 0.3
  },
  'distant-drums': {
    frequency: 80,
    duration: 0.8,
    type: 'triangle',
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.5 },
    volume: 0.4,
    filterFreq: 200
  },
  'blade-draw': {
    frequency: 2000,
    duration: 0.5,
    type: 'sawtooth',
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.3 },
    volume: 0.3,
    filterFreq: 4000
  },
  'impact': {
    frequency: 60,
    duration: 0.6,
    type: 'square',
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.1, release: 0.35 },
    volume: 0.6,
    filterFreq: 150
  },
  'g-note': {
    frequency: 392, // G4
    duration: 4.0,
    type: 'sine',
    envelope: { attack: 0.1, decay: 0.5, sustain: 0.6, release: 2.5 },
    volume: 0.6,
    reverb: 0.5
  }
};

class AudioGenerator {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;
  private convolver: ConvolverNode | null = null;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      await this.createReverb();
      this.isInitialized = true;
      console.log('AudioGenerator initialized');
    } catch (err) {
      console.warn('AudioGenerator failed to initialize:', err);
    }
  }

  private async createReverb(): Promise<void> {
    if (!this.audioContext) return;

    // Create a simple impulse response for reverb
    const length = this.audioContext.sampleRate * 2;
    const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (this.audioContext.sampleRate * 0.5));
      left[i] = (Math.random() * 2 - 1) * decay;
      right[i] = (Math.random() * 2 - 1) * decay;
    }

    this.convolver = this.audioContext.createConvolver();
    this.convolver.buffer = impulse;
  }

  async play(soundKey: string): Promise<void> {
    if (!this.isInitialized) {
      await this.init();
    }

    if (!this.audioContext) {
      console.warn('AudioContext not available');
      return;
    }

    const config = SOUND_CONFIGS[soundKey];
    if (!config) {
      console.warn(`Unknown sound: ${soundKey}`);
      return;
    }

    // Resume context if suspended (mobile requirement)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const now = this.audioContext.currentTime;

    // Create oscillator
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, now);

    // Create gain for envelope
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, now);

    // ADSR envelope
    const { attack, decay, sustain, release } = config.envelope;
    const sustainLevel = config.volume * sustain;

    gainNode.gain.linearRampToValueAtTime(config.volume, now + attack);
    gainNode.gain.linearRampToValueAtTime(sustainLevel, now + attack + decay);
    gainNode.gain.setValueAtTime(sustainLevel, now + config.duration - release);
    gainNode.gain.linearRampToValueAtTime(0, now + config.duration);

    // Create filter if specified
    let lastNode: AudioNode = oscillator;

    if (config.filterFreq) {
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(config.filterFreq, now);
      filter.Q.setValueAtTime(1, now);
      oscillator.connect(filter);
      lastNode = filter;
    }

    // Connect to gain
    lastNode.connect(gainNode);

    // Add reverb if specified
    if (config.reverb && this.convolver) {
      const dryGain = this.audioContext.createGain();
      const wetGain = this.audioContext.createGain();
      dryGain.gain.setValueAtTime(1 - config.reverb, now);
      wetGain.gain.setValueAtTime(config.reverb, now);

      gainNode.connect(dryGain);
      gainNode.connect(this.convolver);
      this.convolver.connect(wetGain);

      dryGain.connect(this.audioContext.destination);
      wetGain.connect(this.audioContext.destination);
    } else {
      gainNode.connect(this.audioContext.destination);
    }

    // Play
    oscillator.start(now);
    oscillator.stop(now + config.duration + 0.1);
  }

  // Generate a more complex piano-like sound
  async playPiano(note: number = 440): Promise<void> {
    if (!this.audioContext) {
      await this.init();
    }
    if (!this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const now = this.audioContext.currentTime;

    // Multiple harmonics for richer sound
    const harmonics = [1, 2, 3, 4, 5];
    const gains = [1, 0.5, 0.25, 0.125, 0.0625];

    harmonics.forEach((harmonic, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note * harmonic, now);

      const baseVolume = 0.3 * gains[i]!;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(baseVolume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3);

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);

      osc.start(now);
      osc.stop(now + 3.5);
    });
  }

  // Drum hit for marching sound
  async playDrum(): Promise<void> {
    if (!this.audioContext) {
      await this.init();
    }
    if (!this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const now = this.audioContext.currentTime;

    // Bass drum
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + 0.5);

    // Snare noise component
    const noise = this.audioContext.createBufferSource();
    const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.2, this.audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    noise.buffer = noiseBuffer;

    const noiseGain = this.audioContext.createGain();
    const noiseFilter = this.audioContext.createBiquadFilter();

    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1000, now);

    noiseGain.gain.setValueAtTime(0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.audioContext.destination);

    noise.start(now);
  }

  destroy(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.convolver = null;
    this.isInitialized = false;
  }
}

export const audioGenerator = new AudioGenerator();
