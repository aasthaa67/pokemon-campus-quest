/**
 * Retro Pokémon Web Audio API Sound Generator
 * Generates authentic 8-bit chimes and fanfares completely offline with zero external audio assets!
 */

let audioCtx: AudioContext | null = null;
let soundMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isAudioMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('pokemon_quest_muted') === 'true' || soundMuted;
}

export function setAudioMuted(muted: boolean): void {
  soundMuted = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('pokemon_quest_muted', muted ? 'true' : 'false');
  }
}

/**
 * Play a simple single synth note
 */
function playNote(freq: number, type: OscillatorType, duration: number, delay = 0, gainLevel = 0.15) {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(gainLevel, ctx.currentTime + delay + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

/**
 * Checkpoint Unlocked Fanfare (Pokémon Gym Badge style arpeggio)
 */
export function playCheckpointUnlockSound() {
  if (isAudioMuted()) return;
  // Notes: G4, C5, E5, G5, C6 (classic victory arpeggio)
  const notes = [392.0, 523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    playNote(freq, 'triangle', 0.28, idx * 0.09, 0.2);
    playNote(freq * 0.5, 'sine', 0.28, idx * 0.09, 0.1);
  });

  // Haptic feedback if available on mobile
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([100, 50, 200]);
    } catch {
      // Ignored if device doesn't support or permission denied
    }
  }
}

/**
 * Radar Proximity Sonar Ping
 */
export function playProximityPing() {
  if (isAudioMuted()) return;
  playNote(880, 'sine', 0.15, 0, 0.1);
  playNote(1760, 'sine', 0.2, 0.08, 0.08);

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(60);
    } catch {}
  }
}

/**
 * Power-Up collected jingle (Sparkling ascending glissando)
 */
export function playPowerUpSound() {
  if (isAudioMuted()) return;
  const notes = [587.33, 739.99, 880.0, 1174.66];
  notes.forEach((freq, idx) => {
    playNote(freq, 'square', 0.18, idx * 0.07, 0.08);
  });
}

/**
 * Grand Victory (All 5 checkpoints captured)
 */
export function playGrandVictoryFanfare() {
  if (isAudioMuted()) return;
  // Majestic Pokémon League theme fragment
  const notes = [
    { f: 523.25, d: 0.15 },
    { f: 659.25, d: 0.15 },
    { f: 783.99, d: 0.15 },
    { f: 1046.5, d: 0.4 },
    { f: 880.0, d: 0.2 },
    { f: 1046.5, d: 0.6 },
  ];
  let time = 0;
  notes.forEach(({ f, d }) => {
    playNote(f, 'triangle', d, time, 0.22);
    time += d;
  });

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200, 100, 400]);
    } catch {}
  }
}

/**
 * Harsh 8-bit Penalty Buzzer (Negative points deduction)
 */
export function playPenaltyBuzzerSound() {
  if (isAudioMuted()) return;
  // Low discordant square wave buzz
  playNote(130, 'sawtooth', 0.28, 0, 0.22);
  playNote(110, 'sawtooth', 0.35, 0.08, 0.25);

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([180, 70, 180]);
    } catch {}
  }
}

/**
 * Subtle button tap blip
 */
export function playClickSound() {
  if (isAudioMuted()) return;
  playNote(440, 'triangle', 0.05, 0, 0.05);
}
