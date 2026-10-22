// Web Audio API Synthesizer for EEC Virtual Laboratory
// Generates AC hums, clicks, spark buzzes, and success fanfare chimes without any external audio files.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.acHumOsc = null;
    this.acHumGain = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted && this.acHumGain) {
      this.acHumGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  // Switch or relay mechanical click
  playClick() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio context may be restricted by autoplay policy
    }
  }

  // Topic Completion Celebration Chime (Major triad arpeggio: C5 -> E5 -> G5 -> C6)
  playSuccessChime() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.1;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    } catch {
      // Ignore
    }
  }

  // Electrical spark / short-circuit crackle
  playSpark() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.setValueAtTime(450, this.ctx.currentTime + 0.03);
      osc.frequency.setValueAtTime(70, this.ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // Ignore
    }
  }

  // Logic Gate Buzzer (440Hz beep)
  playBuzzer() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Ignore
    }
  }
}

export const audioEngine = new AudioEngine();

// Convenience Named Exports
export const playMechanicalClick = () => audioEngine.playClick();
export const playClick = () => audioEngine.playClick();
export const playSuccessChime = () => audioEngine.playSuccessChime();
export const playSpark = () => audioEngine.playSpark();
export const playBuzzer = () => audioEngine.playBuzzer();
export const playAcHum = (duration = 0.4) => {
  if (audioEngine.isMuted) return;
  try {
    audioEngine.init();
    if (!audioEngine.ctx) return;
    const osc = audioEngine.ctx.createOscillator();
    const gain = audioEngine.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(50, audioEngine.ctx.currentTime); // 50 Hz Mains Hum
    gain.gain.setValueAtTime(0.08, audioEngine.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioEngine.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioEngine.ctx.destination);
    osc.start();
    osc.stop(audioEngine.ctx.currentTime + duration);
  } catch {}
};
