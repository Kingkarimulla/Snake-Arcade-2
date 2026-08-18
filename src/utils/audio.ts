// Web Audio API Sound & Multi-Track Synthesizer for Snake Game
import { MusicTrack } from '../types';

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'cyber_viper',
    title: 'Cyber Viper',
    genre: 'Synthwave',
    bpm: 124,
    description: 'Pulsing cybernetic bassline with futuristic lead arpeggios',
  },
  {
    id: '8bit_arcade',
    title: '8-Bit Arcade Rush',
    genre: 'Chiptune',
    bpm: 140,
    description: 'Fast-paced authentic nostalgic 8-bit arcade melody',
  },
  {
    id: 'neon_midnight',
    title: 'Neon Midnight',
    genre: 'Chillwave',
    bpm: 106,
    description: 'Atmospheric ambient retro vibes with soft melodic chords',
  },
  {
    id: 'emerald_groove',
    title: 'Emerald Groove',
    genre: 'Retro Funk',
    bpm: 118,
    description: 'Upbeat bouncy groove with funky syncopated bass',
  },
];

class SoundManager {
  private ctx: AudioContext | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private musicGainNode: GainNode | null = null;
  private isMusicPlaying = false;
  private currentTrackId: string = 'cyber_viper';
  private musicVolume: number = 0.8;
  private soundVolume: number = 0.85;
  private musicInterval: number | null = null;
  private stepCounter = 0;
  private unlocked = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.unlockAudio();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
      };
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
      window.addEventListener('touchstart', unlock, { passive: true });
    }
  }

  public unlockAudio() {
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    this.unlocked = true;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        // Master dynamics compressor to keep audio loud, clear, and punchy without distortion
        try {
          this.compressor = this.ctx.createDynamicsCompressor();
          this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
          this.compressor.knee.setValueAtTime(25, this.ctx.currentTime);
          this.compressor.ratio.setValueAtTime(5, this.ctx.currentTime);
          this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
          this.compressor.release.setValueAtTime(0.18, this.ctx.currentTime);
          this.compressor.connect(this.ctx.destination);
        } catch (e) {
          console.warn('Compressor init failed', e);
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getMasterDestination(): AudioNode {
    if (this.compressor) return this.compressor;
    return this.ctx!.destination;
  }

  // Set overall music and sound volumes (0.0 to 1.0)
  setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGainNode && this.ctx) {
      try {
        // High clear gain scaling
        const targetGain = Math.pow(this.musicVolume, 1.2) * 0.75;
        this.musicGainNode.gain.setValueAtTime(Math.max(0.0001, targetGain), this.ctx.currentTime);
      } catch (e) {
        // ignore
      }
    }
  }

  setSoundVolume(vol: number) {
    this.soundVolume = Math.max(0, Math.min(1, vol));
  }

  // Play button click / UI sound
  playClickSound(enabled = true) {
    if (!enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.06);

      const effectiveGain = 0.35 * this.soundVolume;
      gain.gain.setValueAtTime(effectiveGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.getMasterDestination());

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Play intro boot sound
  playIntroSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5]; // C major flourish
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        const effGain = 0.3 * this.soundVolume;
        gain.gain.setValueAtTime(effGain, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.22);

        osc.connect(gain);
        gain.connect(this.getMasterDestination());

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.22);
      });
    } catch (e) {
      console.warn('Intro sound failed', e);
    }
  }

  // Play eat food sound
  playEatSound(isGolden = false, enabled = true) {
    if (!enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      if (isGolden) {
        // Sparkly golden chime arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.035);

          const effGain = 0.4 * this.soundVolume;
          gain.gain.setValueAtTime(effGain, now + idx * 0.035);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.18);

          osc.connect(gain);
          gain.connect(this.getMasterDestination());

          osc.start(now + idx * 0.035);
          osc.stop(now + idx * 0.035 + 0.18);
        });
      } else {
        // Crisp pop/chime for standard food
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.09);

        const effGain = 0.45 * this.soundVolume;
        gain.gain.setValueAtTime(effGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(this.getMasterDestination());

        osc.start(now);
        osc.stop(now + 0.09);
      }
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Play achievement unlock chime
  playAchievementSound(enabled = true) {
    if (!enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major triumphant chime
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        const effGain = 0.35 * this.soundVolume;
        gain.gain.setValueAtTime(effGain, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(this.getMasterDestination());
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    } catch (e) {
      console.warn('Achievement sound failed', e);
    }
  }

  // Play game over sound
  playGameOverSound(enabled = true) {
    if (!enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.5);

      const effGain = 0.45 * this.soundVolume;
      gain.gain.setValueAtTime(effGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.getMasterDestination());

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Play triumphant high score fanfare
  playHighScoreSound(enabled = true) {
    if (!enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const fanfareNotes = [
        { freq: 440, time: 0, dur: 0.12 },
        { freq: 554.37, time: 0.12, dur: 0.12 },
        { freq: 659.25, time: 0.24, dur: 0.12 },
        { freq: 880, time: 0.36, dur: 0.45 },
      ];

      fanfareNotes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        const effGain = 0.4 * this.soundVolume;
        gain.gain.setValueAtTime(effGain, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(this.getMasterDestination());

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Switch Track and keep playing if music is enabled
  switchTrack(trackId: string, enabled: boolean) {
    this.currentTrackId = trackId;
    if (enabled) {
      this.stopMusic();
      this.startMusic();
    }
  }

  // Toggle background retro ambient synth loop
  setMusic(enabled: boolean, trackId?: string) {
    if (trackId) this.currentTrackId = trackId;
    if (enabled && !this.isMusicPlaying) {
      this.startMusic();
    } else if (!enabled && this.isMusicPlaying) {
      this.stopMusic();
    }
  }

  getIsMusicPlaying() {
    return this.isMusicPlaying;
  }

  getCurrentTrackId() {
    return this.currentTrackId;
  }

  private startMusic() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopMusic();
    this.stepCounter = 0;

    try {
      this.musicGainNode = ctx.createGain();
      const targetGain = Math.pow(this.musicVolume, 1.2) * 0.75;
      this.musicGainNode.gain.setValueAtTime(Math.max(0.0001, targetGain), ctx.currentTime);
      this.musicGainNode.connect(this.getMasterDestination());

      // Track compositions
      let intervalMs = 260;
      let playNote: (step: number, now: number) => void;

      switch (this.currentTrackId) {
        case '8bit_arcade': {
          intervalMs = 200;
          const bassline = [130.81, 146.83, 164.81, 174.61, 196.0, 220.0, 246.94, 261.63];
          const melody = [523.25, 0, 659.25, 783.99, 659.25, 587.33, 659.25, 783.99];
          playNote = (step, now) => {
            // Bass (square wave - punchy chiptune)
            const bOsc = ctx.createOscillator();
            const bGain = ctx.createGain();
            bOsc.type = 'square';
            const bFreq = bassline[step % bassline.length];
            bOsc.frequency.setValueAtTime(bFreq, now);
            bGain.gain.setValueAtTime(0.18, now);
            bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            bOsc.connect(bGain);
            bGain.connect(this.musicGainNode!);
            bOsc.start(now);
            bOsc.stop(now + 0.18);

            // Melody lead (triangle/pulse)
            const mFreq = melody[step % melody.length];
            if (mFreq > 0) {
              const mOsc = ctx.createOscillator();
              const mGain = ctx.createGain();
              mOsc.type = 'triangle';
              mOsc.frequency.setValueAtTime(mFreq, now);
              mGain.gain.setValueAtTime(0.22, now);
              mGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
              mOsc.connect(mGain);
              mGain.connect(this.musicGainNode!);
              mOsc.start(now);
              mOsc.stop(now + 0.18);
            }

            // Retro snare hit on step 2 and 6
            if (step % 4 === 2) {
              const nOsc = ctx.createOscillator();
              const nGain = ctx.createGain();
              nOsc.type = 'sawtooth';
              nOsc.frequency.setValueAtTime(280, now);
              nOsc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
              nGain.gain.setValueAtTime(0.12, now);
              nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
              nOsc.connect(nGain);
              nGain.connect(this.musicGainNode!);
              nOsc.start(now);
              nOsc.stop(now + 0.08);
            }
          };
          break;
        }

        case 'neon_midnight': {
          intervalMs = 360;
          const chords = [
            [220.0, 261.63, 329.63, 440.0], // Am7
            [174.61, 220.0, 261.63, 349.23], // Fmaj7
            [261.63, 329.63, 392.0, 523.25], // Cmaj7
            [196.0, 246.94, 293.66, 392.0], // G7
          ];
          const leadNotes = [523.25, 659.25, 587.33, 440, 659.25, 783.99, 659.25, 523.25];
          playNote = (step, now) => {
            const chordIndex = Math.floor(step / 4) % chords.length;
            const currentChord = chords[chordIndex];
            const arpeggioNote = currentChord[step % currentChord.length];

            // Ambient warm chord arpeggio
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(arpeggioNote, now);
            gain.gain.setValueAtTime(0.24, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            osc.connect(gain);
            gain.connect(this.musicGainNode!);
            osc.start(now);
            osc.stop(now + 0.45);

            // Melodic lead
            if (step % 2 === 0) {
              const lOsc = ctx.createOscillator();
              const lGain = ctx.createGain();
              lOsc.type = 'sine';
              lOsc.frequency.setValueAtTime(leadNotes[(step / 2) % leadNotes.length], now);
              lGain.gain.setValueAtTime(0.22, now);
              lGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
              lOsc.connect(lGain);
              lGain.connect(this.musicGainNode!);
              lOsc.start(now);
              lOsc.stop(now + 0.4);
            }
          };
          break;
        }

        case 'emerald_groove': {
          intervalMs = 240;
          const bassRiff = [110, 110, 130.81, 146.83, 110, 164.81, 146.83, 123.47];
          const chimeRiff = [440, 523.25, 659.25, 0, 783.99, 659.25, 587.33, 440];
          playNote = (step, now) => {
            // Funky triangle bass
            const bOsc = ctx.createOscillator();
            const bGain = ctx.createGain();
            bOsc.type = 'triangle';
            bOsc.frequency.setValueAtTime(bassRiff[step % bassRiff.length], now);
            bGain.gain.setValueAtTime(0.24, now);
            bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            bOsc.connect(bGain);
            bGain.connect(this.musicGainNode!);
            bOsc.start(now);
            bOsc.stop(now + 0.22);

            const cFreq = chimeRiff[step % chimeRiff.length];
            if (cFreq > 0) {
              const cOsc = ctx.createOscillator();
              const cGain = ctx.createGain();
              cOsc.type = 'sine';
              cOsc.frequency.setValueAtTime(cFreq, now);
              cGain.gain.setValueAtTime(0.20, now);
              cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
              cOsc.connect(cGain);
              cGain.connect(this.musicGainNode!);
              cOsc.start(now);
              cOsc.stop(now + 0.22);
            }
          };
          break;
        }

        case 'cyber_viper':
        default: {
          intervalMs = 250;
          const bassNotes = [110, 110, 138.59, 146.83, 110, 164.81, 146.83, 130.81];
          const leadNotes = [440, 554.37, 659.25, 880, 783.99, 659.25, 554.37, 440];
          playNote = (step, now) => {
            // Sawtooth cyber bass
            const bOsc = ctx.createOscillator();
            const bGain = ctx.createGain();
            bOsc.type = 'sawtooth';
            bOsc.frequency.setValueAtTime(bassNotes[step % bassNotes.length], now);
            bGain.gain.setValueAtTime(0.20, now);
            bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
            bOsc.connect(bGain);
            bGain.connect(this.musicGainNode!);
            bOsc.start(now);
            bOsc.stop(now + 0.24);

            // Arpeggio Lead
            const lOsc = ctx.createOscillator();
            const lGain = ctx.createGain();
            lOsc.type = 'triangle';
            lOsc.frequency.setValueAtTime(leadNotes[step % leadNotes.length], now);
            lGain.gain.setValueAtTime(0.22, now);
            lGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
            lOsc.connect(lGain);
            lGain.connect(this.musicGainNode!);
            lOsc.start(now);
            lOsc.stop(now + 0.24);

            // Synth Kick/Beat pulse on every 4th step
            if (step % 4 === 0) {
              const kOsc = ctx.createOscillator();
              const kGain = ctx.createGain();
              kOsc.type = 'sine';
              kOsc.frequency.setValueAtTime(150, now);
              kOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
              kGain.gain.setValueAtTime(0.25, now);
              kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
              kOsc.connect(kGain);
              kGain.connect(this.musicGainNode!);
              kOsc.start(now);
              kOsc.stop(now + 0.12);
            }
          };
          break;
        }
      }

      this.isMusicPlaying = true;
      playNote(this.stepCounter, ctx.currentTime);

      this.musicInterval = window.setInterval(() => {
        if (this.isMusicPlaying && this.ctx) {
          this.stepCounter++;
          playNote(this.stepCounter, this.ctx.currentTime);
        } else {
          this.stopMusic();
        }
      }, intervalMs);
    } catch (e) {
      console.warn('Failed to start music loop', e);
    }
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGainNode) {
      try {
        this.musicGainNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.musicGainNode = null;
    }
  }

  triggerVibration(enabled = true, ms = 30) {
    if (!enabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // ignore
      }
    }
  }
}

export const soundManager = new SoundManager();

