import { PatternContent } from "@/types/pattern";

export const templateMethodContent: PatternContent = {
  slug: "template-method",
  name: "Template Method",
  category: "behavioral",
  difficulty: "beginner",
  order: 9,
  xpReward: 150,
  hook: "Define the skeleton of an algorithm, letting subclasses fill in steps",
  analogy: "A recipe template. 'Making a hot beverage' always follows: boil water → brew → pour into cup → add condiments. But the specifics differ: tea steeps leaves, coffee uses grounds; tea adds lemon, coffee adds sugar. The algorithm structure is fixed, but individual steps vary.",
  antiPattern: `// The naive approach: duplicating the algorithm structure in every class
class CSVMiner {
  mine(file: string) {
    const raw = fs.readFileSync(file);        // step 1: open
    const data = parseCSV(raw);               // step 2: extract (CSV-specific)
    const cleaned = data.filter(valid);       // step 3: clean (DUPLICATED)
    const analysis = this.analyze(cleaned);   // step 4: analyze (DUPLICATED)
    return formatReport(analysis);             // step 5: report (DUPLICATED)
  }
}

class JSONMiner {
  mine(file: string) {
    const raw = fs.readFileSync(file);        // DUPLICATED step 1
    const data = JSON.parse(raw);             // step 2: extract (JSON-specific)
    const cleaned = data.filter(valid);       // DUPLICATED step 3
    const analysis = this.analyze(cleaned);   // DUPLICATED step 4
    return formatReport(analysis);             // DUPLICATED step 5
  }
}

// 80% of the code is identical! Changes to shared steps must be applied N times
// No guarantee that miners follow the same algorithm structure`,
  problem: `You're building data miners for different file formats: CSV, JSON, XML. They all follow the same process: open file → extract data → parse → analyze → generate report.

But each format has different implementation for extraction and parsing. If you build them independently, you duplicate the common logic (opening, analyzing, reporting) in every class.

The high-level algorithm is identical — only certain steps differ.`,
  solution: `Template Method defines the algorithm's skeleton in a base class method, deferring specific steps to subclasses.

The base class has a 'template method' (a final/non-overridable method) that calls abstract steps in order. Subclasses override only the steps that differ — the overall structure is enforced by the base class.

Common logic lives in one place. Subclasses can't accidentally break the algorithm's structure — they only customize predefined extension points.`,
  glossary: [
    { term: "Template Method", definition: "The method in the base class that defines the algorithm skeleton by calling steps in order. Should not be overridden." },
    { term: "Abstract Steps", definition: "Methods that subclasses MUST implement. They are the varying parts of the algorithm." },
    { term: "Hook Methods", definition: "Optional steps with default (often empty) implementation. Subclasses CAN override them but don't have to." },
    { term: "Inversion of Control", definition: "The base class calls subclass methods (not the other way around). The framework/base controls the flow." },
    { term: "Hollywood Principle", definition: "'Don't call us, we'll call you.' The base class decides when to call subclass steps." },
  ],
  highlightLines: [6, 7, 8, 9, 10, 11, 12, 13],
  diagramDescription: "AbstractClass defines templateMethod() calling step1(), step2(), step3() → ConcreteClasses override specific steps → the order/skeleton is fixed by the base.",
  codeExample: `// Abstract class with template method
abstract class DataExporter {
  // THE template method — defines the algorithm skeleton
  // Subclasses cannot change this order
  export(data: Record<string, unknown>[]): string {
    const validated = this.validate(data);
    const formatted = this.format(validated);
    const header = this.generateHeader();
    const footer = this.generateFooter();
    const output = this.assemble(header, formatted, footer);

    // Hook — optional step, subclasses can override
    this.onExportComplete(output);

    return output;
  }

  // Common step — same for all formats
  private validate(data: Record<string, unknown>[]): Record<string, unknown>[] {
    return data.filter((row) => Object.keys(row).length > 0);
  }

  // Abstract steps — MUST be implemented by subclasses
  protected abstract format(data: Record<string, unknown>[]): string;
  protected abstract generateHeader(): string;
  protected abstract generateFooter(): string;

  // Hook — default implementation (can be overridden)
  protected onExportComplete(_output: string): void {}

  private assemble(header: string, body: string, footer: string): string {
    return [header, body, footer].filter(Boolean).join("\\n");
  }
}

// Concrete: CSV exporter
class CsvExporter extends DataExporter {
  protected format(data: Record<string, unknown>[]): string {
    if (data.length === 0) return "";
    const keys = Object.keys(data[0]);
    const rows = data.map((row) => keys.map((k) => String(row[k] ?? "")).join(","));
    return [keys.join(","), ...rows].join("\\n");
  }

  protected generateHeader(): string { return "# CSV Export"; }
  protected generateFooter(): string { return \`# Total rows: counted at runtime\`; }
}

// Concrete: JSON exporter
class JsonExporter extends DataExporter {
  protected format(data: Record<string, unknown>[]): string {
    return JSON.stringify(data, null, 2);
  }

  protected generateHeader(): string { return '{ "export": {'; }
  protected generateFooter(): string { return "}}"; }

  // Override the hook
  protected onExportComplete(output: string): void {
    console.log(\`JSON export complete: \${output.length} chars\`);
  }
}

// Concrete: XML exporter
class XmlExporter extends DataExporter {
  protected format(data: Record<string, unknown>[]): string {
    return data.map((row) => {
      const fields = Object.entries(row)
        .map(([key, value]) => \`    <\${key}>\${value}</\${key}>\`)
        .join("\\n");
      return \`  <row>\\n\${fields}\\n  </row>\`;
    }).join("\\n");
  }

  protected generateHeader(): string { return '<?xml version="1.0"?>\\n<data>'; }
  protected generateFooter(): string { return "</data>"; }
}

// Usage — same interface, different output formats
const data = [
  { name: "Alice", age: 30, role: "Engineer" },
  { name: "Bob", age: 25, role: "Designer" },
];

const csv = new CsvExporter().export(data);
const json = new JsonExporter().export(data);
const xml = new XmlExporter().export(data);
// Each follows the same algorithm but produces different output`,
};
