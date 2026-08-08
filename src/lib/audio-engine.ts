type SoundEffect = "click" | "hit" | "hurt" | "gameover" | "purchase" | "coin" | "levelup" | "lightning";

interface AudioEngineState {
  isMuted: boolean;
  context: AudioContext | null;
  backgroundGain: GainNode | null;
  sfxGain: GainNode | null;
  currentOscillators: OscillatorNode[];
  loopTimeout: ReturnType<typeof setTimeout> | null;
  isPlaying: boolean;
}

const state: AudioEngineState = {
  isMuted: false,
  context: null,
  backgroundGain: null,
  sfxGain: null,
  currentOscillators: [],
  loopTimeout: null,
  isPlaying: false,
};

function getContext(): AudioContext {
  if (!state.context) {
    state.context = new AudioContext();
    state.backgroundGain = state.context.createGain();
    state.backgroundGain.gain.value = 0.08;
    state.backgroundGain.connect(state.context.destination);
    state.sfxGain = state.context.createGain();
    state.sfxGain.gain.value = 0.15;
    state.sfxGain.connect(state.context.destination);
  }
  if (state.context.state === "suspended") {
    state.context.resume();
  }
  return state.context;
}

function playNote(frequency: number, duration: number, type: OscillatorType, gainNode: GainNode, delay = 0): OscillatorNode {
  const context = getContext();
  const oscillator = context.createOscillator();
  const envelope = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  envelope.gain.value = 0;
  envelope.gain.setValueAtTime(0, context.currentTime + delay);
  envelope.gain.linearRampToValueAtTime(1, context.currentTime + delay + 0.05);
  envelope.gain.setValueAtTime(1, context.currentTime + delay + duration - 0.05);
  envelope.gain.linearRampToValueAtTime(0, context.currentTime + delay + duration);

  oscillator.connect(envelope);
  envelope.connect(gainNode);
  oscillator.start(context.currentTime + delay);
  oscillator.stop(context.currentTime + delay + duration);

  return oscillator;
}

export function playBackgroundMusic(realm: "creational" | "structural" | "behavioral" | "boss"): void {
  if (state.isMuted) return;

  stopBackgroundMusic();

  getContext();
  if (!state.backgroundGain) return;

  state.isPlaying = true;

  const patterns: Record<string, { notes: number[]; duration: number; type: OscillatorType }> = {
    creational: { notes: [220, 261, 329, 261, 293, 349, 293, 261], duration: 0.6, type: "sine" },
    structural: { notes: [330, 392, 440, 392, 523, 494, 440, 392], duration: 0.7, type: "triangle" },
    behavioral: { notes: [196, 233, 261, 293, 261, 233, 196, 174], duration: 0.5, type: "sawtooth" },
    boss: { notes: [146, 174, 196, 174, 146, 130, 146, 174], duration: 0.35, type: "square" },
  };

  const pattern = patterns[realm];
  let noteIndex = 0;

  function scheduleNotes() {
    if (!state.isPlaying || state.isMuted || !state.backgroundGain) return;

    for (let i = 0; i < pattern.notes.length; i++) {
      const osc = playNote(
        pattern.notes[(noteIndex + i) % pattern.notes.length],
        pattern.duration * 0.9,
        pattern.type,
        state.backgroundGain,
        i * pattern.duration
      );
      state.currentOscillators.push(osc);
    }

    noteIndex = (noteIndex + pattern.notes.length) % pattern.notes.length;

    const loopDuration = pattern.notes.length * pattern.duration * 1000;
    state.loopTimeout = setTimeout(scheduleNotes, loopDuration);
  }

  scheduleNotes();
}

export function stopBackgroundMusic(): void {
  state.isPlaying = false;

  if (state.loopTimeout) {
    clearTimeout(state.loopTimeout);
    state.loopTimeout = null;
  }

  state.currentOscillators.forEach((osc) => {
    try { osc.stop(); } catch { /* already stopped */ }
  });
  state.currentOscillators = [];
}

export function playSoundEffect(effect: SoundEffect): void {
  if (state.isMuted || !state.sfxGain) {
    if (!state.isMuted) getContext();
    if (state.isMuted || !state.sfxGain) return;
  }

  const sfxGain = state.sfxGain;

  switch (effect) {
    case "click":
      playNote(800, 0.05, "square", sfxGain);
      playNote(1200, 0.03, "square", sfxGain, 0.03);
      break;
    case "hit":
      playNote(523, 0.1, "sine", sfxGain);
      playNote(659, 0.1, "sine", sfxGain, 0.05);
      playNote(784, 0.15, "sine", sfxGain, 0.1);
      break;
    case "hurt":
      playNote(300, 0.1, "sawtooth", sfxGain);
      playNote(200, 0.2, "sawtooth", sfxGain, 0.1);
      break;
    case "gameover":
      playNote(392, 0.3, "sawtooth", sfxGain);
      playNote(330, 0.3, "sawtooth", sfxGain, 0.3);
      playNote(261, 0.3, "sawtooth", sfxGain, 0.6);
      playNote(196, 0.5, "sawtooth", sfxGain, 0.9);
      break;
    case "purchase":
      playNote(523, 0.08, "sine", sfxGain);
      playNote(659, 0.08, "sine", sfxGain, 0.08);
      playNote(784, 0.08, "sine", sfxGain, 0.16);
      playNote(1047, 0.15, "sine", sfxGain, 0.24);
      break;
    case "coin":
      playNote(988, 0.06, "square", sfxGain);
      playNote(1318, 0.1, "square", sfxGain, 0.06);
      break;
    case "levelup":
      playNote(523, 0.1, "sine", sfxGain);
      playNote(659, 0.1, "sine", sfxGain, 0.1);
      playNote(784, 0.1, "sine", sfxGain, 0.2);
      playNote(1047, 0.3, "sine", sfxGain, 0.3);
      break;
    case "lightning":
      playNote(80, 0.3, "sawtooth", sfxGain);
      playNote(60, 0.1, "sawtooth", sfxGain, 0.05);
      playNote(100, 0.2, "sawtooth", sfxGain, 0.15);
      break;
  }
}

export function setMuted(muted: boolean): void {
  state.isMuted = muted;
  if (muted) {
    stopBackgroundMusic();
  }
  if (typeof window !== "undefined") {
    localStorage.setItem("audio-muted", String(muted));
  }
}

export function isMuted(): boolean {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("audio-muted");
    if (stored !== null) {
      state.isMuted = stored === "true";
    }
  }
  return state.isMuted;
}
