/**
 * Web Audio API procedural sound engine & Speech Synthesis
 * Provides 100% royalty-free, self-contained background music tracks & sound effects
 */

class AudioSynthesizerEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: any = null;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.25;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.5;
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMusicVolume(val: number) {
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  // --- SOUND EFFECTS ---
  public playWhoosh() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Filtered white noise whoosh
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.12);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + 0.35);
  }

  public playDing() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  public playPop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playBassDrop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.6);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  // --- PROCEDURAL BACKGROUND BEATS ---
  public startBackgroundMusic(mood: string = 'phonk') {
    this.initContext();
    if (!this.ctx || !this.musicGain || this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // Tempo based on mood
    const isPhonk = mood.toLowerCase().includes('phonk') || mood.toLowerCase().includes('energetic');
    const bpm = isPhonk ? 130 : 90;
    const stepDuration = 60 / bpm / 2; // eighth notes

    let step = 0;
    const bassNotes = isPhonk ? [55, 55, 65, 55, 73, 55, 65, 49] : [65, 65, 78, 73, 65, 58, 65, 73];

    const playStep = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;
      const now = this.ctx.currentTime;

      // Kick on 1 and 3
      if (step % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(120, now);
        kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.1);
        kickGain.gain.setValueAtTime(0.4, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        kickOsc.connect(kickGain);
        kickGain.connect(this.musicGain);
        kickOsc.start(now);
        kickOsc.stop(now + 0.15);
      }

      // Snare / clap on 2 and 4
      if (step % 4 === 2) {
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(220, now);
        snareGain.gain.setValueAtTime(0.2, now);
        snareGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        snareOsc.connect(snareGain);
        snareGain.connect(this.musicGain);
        snareOsc.start(now);
        snareOsc.stop(now + 0.08);
      }

      // Bass synth
      if (step % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassFilter = this.ctx.createBiquadFilter();
        const bassGain = this.ctx.createGain();

        bassOsc.type = isPhonk ? 'sawtooth' : 'triangle';
        const note = bassNotes[(step / 2) % bassNotes.length];
        bassOsc.frequency.setValueAtTime(note, now);

        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(isPhonk ? 650 : 400, now);

        bassGain.gain.setValueAtTime(0.25, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + stepDuration * 0.9);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.musicGain);

        bassOsc.start(now);
        bassOsc.stop(now + stepDuration);
      }

      step++;
    };

    this.musicInterval = setInterval(playStep, stepDuration * 1000);
  }

  public stopBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public isPlaying(): boolean {
    return this.isMusicPlaying;
  }
}

export const audioSynthesizer = new AudioSynthesizerEngine();

// --- SPEECH SYNTHESIS ENGINE ---
export interface VoiceOption {
  name: string;
  lang: string;
  gender: string;
}

export class SpeechEngine {
  private static synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  public static getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices().filter((v) => v.lang.startsWith('en'));
  }

  public static speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      voiceIndex?: number;
      onWord?: (charIndex: number, word: string) => void;
      onEnd?: () => void;
    } = {}
  ) {
    if (!this.synth) {
      options.onEnd?.();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.15; // Punchy, brisk short-form pace
    utterance.pitch = options.pitch || 1.05;

    const voices = this.getVoices();
    if (voices.length > 0) {
      const idx = options.voiceIndex !== undefined && options.voiceIndex < voices.length ? options.voiceIndex : 0;
      utterance.voice = voices[idx];
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIdx = event.charIndex;
        const remaining = text.slice(charIdx);
        const match = remaining.match(/\w+/);
        const currentWord = match ? match[0] : '';
        options.onWord?.(charIdx, currentWord);
      }
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public static stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public static isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}
