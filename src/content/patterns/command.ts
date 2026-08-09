import { PatternContent } from "@/types/pattern";

export const commandContent: PatternContent = {
  slug: "command",
  name: "Command",
  category: "behavioral",
  difficulty: "intermediate",
  order: 2,
  xpReward: 150,
  lore: "In the Nexus armory, every action was once a scroll — a command object that could be stored, sent across the realm, undone if regretted, or replayed for training. The armory is sealed. Its scrolls hold the power of undo itself.",
  hook: "Turn requests into stand-alone objects with all request info",
  analogy: "A restaurant order ticket. The waiter writes down your order (command object) and puts it in the queue. The kitchen (receiver) executes it whenever ready. The ticket can be queued, delayed, logged, or even undone (if you change your mind before cooking starts). The waiter doesn't cook — they just create command objects.",
  antiPattern: `// The naive approach: button handlers directly call business logic
class ToolbarButton {
  onClick() {
    // Direct coupling: button knows exactly what to do
    document.selection.copy(); // Can't undo this
    // Can't queue, log, or replay this action
    // Can't assign this same action to a keyboard shortcut
  }
}

class KeyboardShortcut {
  onCtrlC() {
    document.selection.copy(); // Duplicated logic!
    // If copy behavior changes, must update in 2+ places
  }
}

// No undo/redo history, no command queue, no macro recording
// Each invoker (button, shortcut, menu) duplicates the logic
// Adding undo means adding reverse logic to EVERY handler`,
  problem: `You're building a text editor with toolbar buttons. Each button does something different: copy, paste, bold, undo. But buttons also have keyboard shortcuts that do the same thing.

If you put the logic directly in the button's onClick, you duplicate it for keyboard shortcuts. You also can't implement undo/redo because there's no record of what was done.

Operations aren't objects — they're scattered code that can't be queued, logged, or reversed.`,
  solution: `Command encapsulates a request as an object, containing all information needed to perform the action.

Each operation becomes a class (CopyCommand, PasteCommand, BoldCommand) that implements an execute() method. Commands also implement undo() for reversibility.

Now the button just calls command.execute(). Keyboard shortcuts call the same command. A history stack stores executed commands for undo. Commands can be queued, serialized, or replayed.`,
  glossary: [
    { term: "Command", definition: "An interface declaring execute() and optionally undo(). Encapsulates a single operation." },
    { term: "Concrete Command", definition: "Implements execute() with the actual logic. Stores a reference to the receiver and all needed parameters." },
    { term: "Receiver", definition: "The object that does the actual work (e.g., the Document). Commands delegate to receivers." },
    { term: "Invoker", definition: "Triggers commands (e.g., a button or scheduler). Doesn't know what the command does — just calls execute()." },
    { term: "Command History", definition: "A stack of executed commands enabling undo/redo by calling command.undo() in reverse order." },
  ],
  highlightLines: [1, 2, 3, 4, 12, 13, 14, 15, 35, 36, 37],
  diagramDescription: "Invoker (button/shortcut) → Command.execute() → Receiver does work. CommandHistory stores past commands for undo.",
  codeExample: `// Command interface
interface Command {
  execute(): void;
  undo(): void;
  describe(): string;
}

// Receiver — the object being operated on
class TextDocument {
  private content = "";
  private clipboard = "";

  getContent(): string { return this.content; }
  setContent(text: string): void { this.content = text; }
  getClipboard(): string { return this.clipboard; }
  setClipboard(text: string): void { this.clipboard = text; }
}

// Concrete Commands
class InsertTextCommand implements Command {
  private previousContent = "";

  constructor(private document: TextDocument, private text: string, private position: number) {}

  execute(): void {
    this.previousContent = this.document.getContent();
    const content = this.document.getContent();
    const newContent = content.slice(0, this.position) + this.text + content.slice(this.position);
    this.document.setContent(newContent);
  }

  undo(): void {
    this.document.setContent(this.previousContent);
  }

  describe(): string { return \`Insert "\${this.text}" at position \${this.position}\`; }
}

class DeleteTextCommand implements Command {
  private deletedText = "";

  constructor(private document: TextDocument, private start: number, private end: number) {}

  execute(): void {
    const content = this.document.getContent();
    this.deletedText = content.slice(this.start, this.end);
    this.document.setContent(content.slice(0, this.start) + content.slice(this.end));
  }

  undo(): void {
    const content = this.document.getContent();
    this.document.setContent(content.slice(0, this.start) + this.deletedText + content.slice(this.start));
  }

  describe(): string { return \`Delete characters \${this.start}-\${this.end}\`; }
}

// Invoker with undo/redo history
class Editor {
  private history: Command[] = [];
  private redoStack: Command[] = [];

  executeCommand(command: Command): void {
    command.execute();
    this.history.push(command);
    this.redoStack = []; // clear redo after new action
  }

  undo(): void {
    const command = this.history.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  }

  redo(): void {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.history.push(command);
    }
  }
}

// Usage
const doc = new TextDocument();
const editor = new Editor();

editor.executeCommand(new InsertTextCommand(doc, "Hello", 0));
editor.executeCommand(new InsertTextCommand(doc, " World", 5));
console.log(doc.getContent()); // "Hello World"

editor.undo();
console.log(doc.getContent()); // "Hello"

editor.redo();
console.log(doc.getContent()); // "Hello World"`,
};
