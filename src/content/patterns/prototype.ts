import { PatternContent } from "@/types/pattern";

export const prototypeContent: PatternContent = {
  slug: "prototype",
  name: "Prototype",
  category: "creational",
  difficulty: "intermediate",
  order: 4,
  xpReward: 150,
  hook: "Clone existing objects without coupling to their classes",
  analogy: "Cell division in biology. When a cell needs a copy of itself, it doesn't go back to the DNA blueprint and rebuild from scratch — it clones itself directly. The clone is independent: changes to the clone don't affect the original. The Prototype pattern works the same way for objects.",
  antiPattern: `// The naive approach: manual field-by-field copying
function copyDocument(doc: DocumentTemplate) {
  // Problem 1: you can't access private fields from outside
  const copy = new DocumentTemplate(
    doc.title,
    doc.sections,         // SHALLOW copy! Both point to same array
    doc.metadata,         // SHALLOW copy! Same object reference
    doc.getInternalId()   // This shouldn't be copied — but you don't know that
  );
  // Problem 2: if DocumentTemplate adds a field, this function breaks silently
  // Problem 3: you must know the exact class (what if you only have an interface?)
  return copy;
}

// Brittle, incomplete, couples copying logic to the object's internal structure`,
  problem: `You need to create an exact copy of an object. The obvious approach: create a new object of the same class and copy all fields one by one.

Problems:
1. Some fields might be private — you can't access them from outside.
2. You must know the object's exact class to instantiate it, creating a dependency on that class.
3. Sometimes you only have an interface reference and don't know the concrete type at all.

Copying becomes impossible or requires ugly type-checking code.`,
  solution: `Prototype delegates the cloning process to the object itself. Every object that supports cloning implements a clone() method.

The clone() method creates a new instance of the same class and copies all fields — including private ones (because it's inside the class). The caller doesn't need to know the concrete class or access private fields.

You can maintain a registry of pre-built prototypes, cloning them when needed instead of constructing from scratch.`,
  glossary: [
    { term: "Prototype", definition: "An interface declaring the clone() method that all cloneable objects must implement." },
    { term: "Shallow Copy", definition: "Copies field values directly. Reference-type fields still point to the same objects as the original." },
    { term: "Deep Copy", definition: "Recursively clones all nested objects, so the copy is fully independent from the original." },
    { term: "Prototype Registry", definition: "A store of pre-built objects that can be cloned on demand, avoiding costly initialization repeatedly." },
    { term: "Clone", definition: "The new independent copy of the original object, created via the clone() method." },
  ],
  highlightLines: [17, 18, 19, 20, 21, 22, 23, 24, 25],
  diagramDescription: "Prototype interface declares clone() → Concrete prototypes implement clone() to return a copy of themselves → Client calls clone() without knowing the concrete type.",
  codeExample: `// Prototype interface
interface Cloneable<T> {
  clone(): T;
}

// Complex object with nested data
class DocumentTemplate implements Cloneable<DocumentTemplate> {
  constructor(
    public title: string,
    public sections: string[],
    public metadata: { author: string; version: number },
    private internalId: string
  ) {}

  clone(): DocumentTemplate {
    // Deep copy: new arrays and objects so changes don't affect original
    return new DocumentTemplate(
      this.title,
      [...this.sections],
      { ...this.metadata },
      crypto.randomUUID() // new unique ID for the clone
    );
  }

  addSection(section: string): void {
    this.sections.push(section);
  }

  getInfo(): string {
    return \`[\${this.internalId}] \${this.title} v\${this.metadata.version} (\${this.sections.length} sections)\`;
  }
}

// Prototype Registry — store reusable templates
class TemplateRegistry {
  private templates = new Map<string, DocumentTemplate>();

  register(key: string, template: DocumentTemplate): void {
    this.templates.set(key, template);
  }

  create(key: string): DocumentTemplate {
    const prototype = this.templates.get(key);
    if (!prototype) throw new Error(\`Template "\${key}" not found\`);
    return prototype.clone();
  }
}

// Usage
const registry = new TemplateRegistry();

registry.register("report", new DocumentTemplate(
  "Monthly Report",
  ["Summary", "Metrics", "Action Items"],
  { author: "Team", version: 1 },
  "template-001"
));

// Clone instead of building from scratch
const januaryReport = registry.create("report");
januaryReport.title = "January Report";
januaryReport.addSection("January Highlights");

const februaryReport = registry.create("report");
februaryReport.title = "February Report";

// Original template is unchanged
console.log(januaryReport.getInfo());
// [new-uuid] January Report v1 (4 sections)
console.log(februaryReport.getInfo());
// [new-uuid] February Report v1 (3 sections)`,
};
