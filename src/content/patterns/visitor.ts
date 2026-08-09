import { PatternContent } from "@/types/pattern";

export const visitorContent: PatternContent = {
  slug: "visitor",
  name: "Visitor",
  category: "behavioral",
  difficulty: "advanced",
  order: 10,
  xpReward: 150,
  lore: "The Census Takers visit every citizen in the realm — counting, taxing, healing — without the citizens ever changing their nature. A new operation simply means a new visitor. The citizens say 'accept' and the visitor does the rest. Ancient double-dispatch magic.",
  hook: "Separate algorithms from the objects they operate on",
  analogy: "A tax auditor visiting different businesses. Each business type (restaurant, tech company, retail store) has different tax rules. The auditor (visitor) knows how to calculate taxes for each type. Businesses don't need to know tax law — they just 'accept' the auditor and let them do their job.",
  antiPattern: `// The naive approach: adding methods to every class for every new operation
class Circle {
  calculateArea() { /* shape logic */ }
  exportToSVG() { /* rendering logic mixed in */ }
  serializeToJSON() { /* serialization mixed in */ }
  calculatePerimeter() { /* yet another concern */ }
  // Every new operation = modify ALL shape classes
}

class Rectangle {
  calculateArea() { /* duplicated structure */ }
  exportToSVG() { /* different implementation */ }
  serializeToJSON() { /* different implementation */ }
  calculatePerimeter() { /* different implementation */ }
  // N shapes x M operations = N*M methods across N files
}

// Adding exportToPDF() means modifying Circle, Rectangle, Triangle, Polygon...
// Shape classes become bloated with unrelated concerns
// Can't add operations without modifying the class hierarchy`,
  problem: `You have a hierarchy of shape classes (Circle, Rectangle, Triangle). Now you need to add operations: calculateArea, exportToSVG, serialize to JSON.

Adding each operation means modifying every shape class. The classes grow huge with unrelated methods (drawing logic + export logic + serialization). The Single Responsibility Principle is violated.

If the hierarchy is in a library you don't own, you can't modify the classes at all.`,
  solution: `Visitor lets you add new operations without modifying the element classes. You create a Visitor interface with a method for each element type (visitCircle, visitRectangle).

Each element has an accept(visitor) method that calls the appropriate visitor method. The visitor contains all the operation logic externally.

Adding a new operation? Create a new visitor class. Existing element classes stay unchanged. The operation logic lives in one place, grouped by algorithm rather than scattered across elements.`,
  glossary: [
    { term: "Visitor", definition: "An interface with a visit method for each element type (visitCircle, visitRectangle). Contains operation logic." },
    { term: "Concrete Visitor", definition: "Implements a specific operation across all element types (e.g., AreaCalculator, SVGExporter)." },
    { term: "Element", definition: "An object in the structure that accepts visitors via accept(visitor) method." },
    { term: "Double Dispatch", definition: "Element calls visitor.visitX(this) — selecting the right method based on both the element AND visitor type." },
    { term: "accept() Method", definition: "The element's method that calls the correct visitor method. Enables the visitor to 'enter' the element." },
  ],
  highlightLines: [10, 11, 12, 13, 14, 20, 21, 22, 23],
  diagramDescription: "Elements have accept(visitor) → visitor.visitSpecificType(this) → each Concrete Visitor implements different logic for all element types.",
  codeExample: `// Element interfaces
interface FileNode {
  accept(visitor: FileVisitor): string;
  getName(): string;
}

// Concrete elements
class TextFile implements FileNode {
  constructor(private name: string, private content: string) {}
  getName(): string { return this.name; }
  getContent(): string { return this.content; }
  getWordCount(): number { return this.content.split(/\\s+/).length; }

  accept(visitor: FileVisitor): string {
    return visitor.visitTextFile(this);
  }
}

class ImageFile implements FileNode {
  constructor(private name: string, private width: number, private height: number) {}
  getName(): string { return this.name; }
  getWidth(): number { return this.width; }
  getHeight(): number { return this.height; }
  getResolution(): number { return this.width * this.height; }

  accept(visitor: FileVisitor): string {
    return visitor.visitImageFile(this);
  }
}

class VideoFile implements FileNode {
  constructor(private name: string, private duration: number, private codec: string) {}
  getName(): string { return this.name; }
  getDuration(): number { return this.duration; }
  getCodec(): string { return this.codec; }

  accept(visitor: FileVisitor): string {
    return visitor.visitVideoFile(this);
  }
}

// Visitor interface
interface FileVisitor {
  visitTextFile(file: TextFile): string;
  visitImageFile(file: ImageFile): string;
  visitVideoFile(file: VideoFile): string;
}

// Concrete visitors — each is a different operation
class FileSummaryVisitor implements FileVisitor {
  visitTextFile(file: TextFile): string {
    return \`[TEXT] \${file.getName()} - \${file.getWordCount()} words\`;
  }
  visitImageFile(file: ImageFile): string {
    return \`[IMG] \${file.getName()} - \${file.getWidth()}x\${file.getHeight()}px\`;
  }
  visitVideoFile(file: VideoFile): string {
    return \`[VID] \${file.getName()} - \${file.getDuration()}s (\${file.getCodec()})\`;
  }
}

class StorageEstimateVisitor implements FileVisitor {
  visitTextFile(file: TextFile): string {
    const kb = Math.ceil(file.getContent().length / 1024);
    return \`\${file.getName()}: ~\${kb} KB\`;
  }
  visitImageFile(file: ImageFile): string {
    const mb = (file.getResolution() * 4 / 1024 / 1024).toFixed(1);
    return \`\${file.getName()}: ~\${mb} MB (uncompressed)\`;
  }
  visitVideoFile(file: VideoFile): string {
    const mb = (file.getDuration() * 2.5).toFixed(0);
    return \`\${file.getName()}: ~\${mb} MB (at 20Mbps)\`;
  }
}

// Usage — add operations WITHOUT modifying file classes
const files: FileNode[] = [
  new TextFile("readme.txt", "Hello world this is a test file with some content"),
  new ImageFile("photo.png", 1920, 1080),
  new VideoFile("demo.mp4", 120, "H.264"),
];

const summary = new FileSummaryVisitor();
const storage = new StorageEstimateVisitor();

console.log("=== File Summary ===");
files.forEach((file) => console.log(file.accept(summary)));
// [TEXT] readme.txt - 10 words
// [IMG] photo.png - 1920x1080px
// [VID] demo.mp4 - 120s (H.264)

console.log("\\n=== Storage Estimate ===");
files.forEach((file) => console.log(file.accept(storage)));
// readme.txt: ~1 KB
// photo.png: ~7.9 MB (uncompressed)
// demo.mp4: ~300 MB (at 20Mbps)`,
};
