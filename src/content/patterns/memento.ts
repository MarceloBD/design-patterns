import { PatternContent } from "@/types/pattern";

export const mementoContent: PatternContent = {
  slug: "memento",
  name: "Memento",
  category: "behavioral",
  difficulty: "intermediate",
  order: 5,
  xpReward: 150,
  lore: "Deep beneath the Storm Nexus lies the Chamber of Echoes — where every state was once preserved. Undo a mistake. Restore a fallen comrade. Travel back to a checkpoint before the damage. The art of saving without breaking privacy awaits.",
  hook: "Save and restore an object's previous state (undo)",
  analogy: "Saving a game before a boss fight. If you die, you reload from the save point — the game state is restored exactly as it was (position, health, inventory). The save file is a memento: a snapshot of state that can be restored without knowing the game's internal details.",
  antiPattern: `// The naive approach: exposing all internals for undo/redo
class TextEditor {
  public content: string = "";    // must be public for external save
  public cursorPos: number = 0;   // breaks encapsulation
  public selection: Range | null; // internal state leaked
  public undoStack: string[] = []; // undo logic mixed with editing
}

// External code saving state must know ALL fields
function saveState(editor: TextEditor) {
  return {
    content: editor.content,
    cursorPos: editor.cursorPos,
    selection: editor.selection,
    // If editor adds a new field, this breaks silently!
  };
}

// Breaking encapsulation: anyone can modify internal state
// Adding a field means updating every save/restore function
// No protection against partial/invalid snapshots`,
  problem: `You want to implement undo/redo or snapshots for a complex object (text editor, drawing app, game state). To save state, you'd need to access all the object's fields — including private ones.

Making all fields public breaks encapsulation. Having external code reach into private fields creates tight coupling.

You also need to store multiple snapshots (history) without the storage mechanism knowing the internal structure of what it's storing.`,
  solution: `Memento lets the object itself create a snapshot of its state (since it can access its own private fields). The snapshot is stored in a Memento object with a limited interface — outsiders can't peek inside.

A Caretaker manages the history of mementos (stores, retrieves) but never modifies or reads their contents. Only the original object (Originator) can create and restore from mementos.

Encapsulation is preserved: state saving happens inside the object that owns the state.`,
  glossary: [
    { term: "Originator", definition: "The object whose state you want to save and restore. Creates mementos from its current state." },
    { term: "Memento", definition: "A snapshot object storing the originator's state. Has a minimal interface to prevent external tampering." },
    { term: "Caretaker", definition: "Manages memento history (save/undo/redo). Doesn't modify mementos — just stores and retrieves them." },
    { term: "Encapsulation", definition: "Keeping internal state hidden from outside. Memento preserves this: only the originator reads its own snapshots." },
    { term: "Snapshot", definition: "A frozen copy of an object's state at a specific moment in time." },
    { term: "Memento + Command", definition: "Often used together: Command performs the operation, Memento saves state before each command. Undo = restore the memento saved before the last command." },
  ],
  highlightLines: [15, 16, 17, 18, 19, 20, 35, 36, 37],
  diagramDescription: "Originator → creates Memento (snapshot of state) → Caretaker stores it in history → on undo, Caretaker gives Memento back to Originator → state is restored.",
  codeExample: `// Memento — stores snapshot (opaque to outsiders)
class EditorMemento {
  constructor(
    private readonly content: string,
    private readonly cursorPosition: number,
    private readonly selectionStart: number,
    private readonly selectionEnd: number,
    private readonly timestamp: Date
  ) {}

  getContent(): string { return this.content; }
  getCursorPosition(): number { return this.cursorPosition; }
  getSelectionStart(): number { return this.selectionStart; }
  getSelectionEnd(): number { return this.selectionEnd; }
  getTimestamp(): Date { return this.timestamp; }
}

// Originator — creates and restores from mementos
class TextEditor {
  private content = "";
  private cursorPosition = 0;
  private selectionStart = 0;
  private selectionEnd = 0;

  type(text: string): void {
    this.content =
      this.content.slice(0, this.cursorPosition) +
      text +
      this.content.slice(this.cursorPosition);
    this.cursorPosition += text.length;
  }

  deleteSelection(): void {
    if (this.selectionStart !== this.selectionEnd) {
      this.content =
        this.content.slice(0, this.selectionStart) +
        this.content.slice(this.selectionEnd);
      this.cursorPosition = this.selectionStart;
      this.selectionEnd = this.selectionStart;
    }
  }

  select(start: number, end: number): void {
    this.selectionStart = start;
    this.selectionEnd = end;
  }

  // Creates a snapshot
  save(): EditorMemento {
    return new EditorMemento(
      this.content, this.cursorPosition,
      this.selectionStart, this.selectionEnd, new Date()
    );
  }

  // Restores from a snapshot
  restore(memento: EditorMemento): void {
    this.content = memento.getContent();
    this.cursorPosition = memento.getCursorPosition();
    this.selectionStart = memento.getSelectionStart();
    this.selectionEnd = memento.getSelectionEnd();
  }

  getContent(): string { return this.content; }
}

// Caretaker — manages history without knowing state details
class EditorHistory {
  private undoStack: EditorMemento[] = [];
  private redoStack: EditorMemento[] = [];

  save(memento: EditorMemento): void {
    this.undoStack.push(memento);
    this.redoStack = [];
  }

  undo(): EditorMemento | undefined {
    const memento = this.undoStack.pop();
    if (memento) this.redoStack.push(memento);
    return this.undoStack[this.undoStack.length - 1];
  }

  redo(): EditorMemento | undefined {
    const memento = this.redoStack.pop();
    if (memento) this.undoStack.push(memento);
    return memento;
  }
}

// Usage
const editor = new TextEditor();
const history = new EditorHistory();

history.save(editor.save()); // Save initial state
editor.type("Hello");
history.save(editor.save());
editor.type(" World");
history.save(editor.save());

console.log(editor.getContent()); // "Hello World"

const previous = history.undo();
if (previous) editor.restore(previous);
console.log(editor.getContent()); // "Hello"

const redo = history.redo();
if (redo) editor.restore(redo);
console.log(editor.getContent()); // "Hello World"`,
};
