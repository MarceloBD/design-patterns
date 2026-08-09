type SoundEffect = "click" | "hit" | "hurt" | "gameover" | "purchase" | "coin" | "levelup" | "lightning";

interface AudioEngineState {
  isMuted: boolean;
  context: AudioContext | null;
  backgroundGain: GainNode | null;
  sfxGain: GainNode | null;
  currentOscillators: OscillatorNode[];
  loopTimeout: ReturnType<typeof setTimeout> | null;
  isPlaying: boolean;
  pendingMusic: ("creational" | "structural" | "behavioral" | "boss") | null;
}

const state: AudioEngineState = {
  isMuted: false,
  context: null,
  backgroundGain: null,
  sfxGain: null,
  currentOscillators: [],
  loopTimeout: null,
  isPlaying: false,
  pendingMusic: null,
};

function getContext(): AudioContext {
  if (!state.context) {
    state.context = new AudioContext();
    state.backgroundGain = state.context.createGain();
    state.backgroundGain.gain.value = 0.06;
    state.backgroundGain.connect(state.context.destination);
    state.sfxGain = state.context.createGain();
    state.sfxGain.gain.value = 0.08;
    state.sfxGain.connect(state.context.destination);
  }
  if (state.context.state === "suspended") {
    state.context.resume().then(() => {
      if (state.pendingMusic && !state.isPlaying && !state.isMuted) {
        const realm = state.pendingMusic;
        state.pendingMusic = null;
        playBackgroundMusic(realm);
      }
    });
  }
  return state.context;
}

function warmUpContext(): void {
  if (!state.context) {
    getContext();
  } else if (state.context.state === "suspended") {
    state.context.resume().then(() => {
      if (state.pendingMusic && !state.isPlaying && !state.isMuted) {
        const realm = state.pendingMusic;
        state.pendingMusic = null;
        playBackgroundMusic(realm);
      }
    });
  }
}

function setupInteractionListener(): void {
  if (typeof window === "undefined") return;

  let initialized = false;

  const initOnInteraction = () => {
    if (!initialized) {
      initialized = true;
      warmUpContext();
    } else if (state.context && state.context.state === "suspended") {
      state.context.resume().then(() => {
        if (state.pendingMusic && !state.isPlaying && !state.isMuted) {
          const realm = state.pendingMusic;
          state.pendingMusic = null;
          playBackgroundMusic(realm);
        }
      });
    }
  };

  window.addEventListener("pointerdown", initOnInteraction, { passive: true });
  window.addEventListener("keydown", initOnInteraction, { once: true, passive: true });
}

if (typeof window !== "undefined") {
  setupInteractionListener();
}

const FADE_IN = 0.02;
const FADE_OUT = 0.06;

function playNote(frequency: number, duration: number, type: OscillatorType, gainNode: GainNode, delay = 0): OscillatorNode {
  const context = getContext();
  const oscillator = context.createOscillator();
  const envelope = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  const startTime = context.currentTime + delay;
  const endTime = startTime + duration;
  const fadeIn = Math.min(FADE_IN, duration * 0.3);
  const fadeOut = Math.min(FADE_OUT, duration * 0.4);

  envelope.gain.setValueAtTime(0, startTime);
  envelope.gain.linearRampToValueAtTime(1, startTime + fadeIn);
  envelope.gain.setValueAtTime(1, endTime - fadeOut);
  envelope.gain.linearRampToValueAtTime(0, endTime);

  oscillator.connect(envelope);
  envelope.connect(gainNode);
  oscillator.start(startTime);
  oscillator.stop(endTime + 0.01);

  return oscillator;
}

export function playBackgroundMusic(realm: "creational" | "structural" | "behavioral" | "boss"): void {
  if (state.isMuted) return;

  stopBackgroundMusic();

  const context = getContext();
  if (!state.backgroundGain) return;

  if (context.state === "suspended") {
    state.pendingMusic = realm;
    return;
  }

  state.pendingMusic = null;
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

  if (state.backgroundGain && state.context) {
    state.backgroundGain.gain.linearRampToValueAtTime(0, state.context.currentTime + 0.3);
    setTimeout(() => {
      state.currentOscillators.forEach((osc) => {
        try { osc.stop(); } catch { /* already stopped */ }
      });
      state.currentOscillators = [];
      if (state.backgroundGain) {
        state.backgroundGain.gain.value = 0.06;
      }
    }, 350);
  } else {
    state.currentOscillators.forEach((osc) => {
      try { osc.stop(); } catch { /* already stopped */ }
    });
    state.currentOscillators = [];
  }
}

export function playSoundEffect(effect: SoundEffect): void {
  if (state.isMuted || !state.sfxGain) {
    if (!state.isMuted) getContext();
    if (state.isMuted || !state.sfxGain) return;
  }

  const sfxGain = state.sfxGain;

  switch (effect) {
    case "click":
      playNote(800, 0.06, "square", sfxGain);
      playNote(1200, 0.04, "square", sfxGain, 0.04);
      break;
    case "hit":
      playNote(523, 0.12, "sine", sfxGain);
      playNote(659, 0.12, "sine", sfxGain, 0.06);
      playNote(784, 0.18, "sine", sfxGain, 0.12);
      break;
    case "hurt":
      playNote(300, 0.15, "sawtooth", sfxGain);
      playNote(200, 0.25, "sawtooth", sfxGain, 0.12);
      break;
    case "gameover":
      playNote(392, 0.35, "sawtooth", sfxGain);
      playNote(330, 0.35, "sawtooth", sfxGain, 0.35);
      playNote(261, 0.35, "sawtooth", sfxGain, 0.7);
      playNote(196, 0.5, "sawtooth", sfxGain, 1.05);
      break;
    case "purchase":
      playNote(523, 0.1, "sine", sfxGain);
      playNote(659, 0.1, "sine", sfxGain, 0.1);
      playNote(784, 0.1, "sine", sfxGain, 0.2);
      playNote(1047, 0.18, "sine", sfxGain, 0.3);
      break;
    case "coin":
      playNote(988, 0.08, "square", sfxGain);
      playNote(1318, 0.12, "square", sfxGain, 0.08);
      break;
    case "levelup":
      playNote(523, 0.12, "sine", sfxGain);
      playNote(659, 0.12, "sine", sfxGain, 0.12);
      playNote(784, 0.12, "sine", sfxGain, 0.24);
      playNote(1047, 0.35, "sine", sfxGain, 0.36);
      break;
    case "lightning":
      playNote(80, 0.35, "sawtooth", sfxGain);
      playNote(60, 0.15, "sawtooth", sfxGain, 0.08);
      playNote(100, 0.25, "sawtooth", sfxGain, 0.2);
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
