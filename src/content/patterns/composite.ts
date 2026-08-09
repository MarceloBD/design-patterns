import { PatternContent } from "@/types/pattern";

export const compositeContent: PatternContent = {
  slug: "composite",
  name: "Composite",
  category: "structural",
  difficulty: "intermediate",
  order: 3,
  xpReward: 150,
  hook: "Compose objects into tree structures and treat them uniformly",
  analogy: "A file system. A folder can contain files and other folders. When you ask 'what's the total size?', a file returns its own size. A folder returns the sum of all its children's sizes (including nested folders). You treat both files and folders through the same interface — they're all 'file system items'.",
  antiPattern: `// The naive approach: type-checking at every level
function calculatePrice(item: unknown): number {
  if (item instanceof Product) {
    return item.price;
  } else if (item instanceof Bundle) {
    let total = 0;
    for (const child of item.items) {
      if (child instanceof Product) {
        total += child.price;
      } else if (child instanceof Bundle) {
        // Recursive type-checking! What about nested bundles?
        for (const grandChild of child.items) {
          total += calculatePrice(grandChild); // duplicated logic
        }
      }
    }
    return total * item.discount;
  }
  throw new Error("Unknown type"); // fragile!
}

// Type-checking scattered everywhere, breaks when you add new types`,
  problem: `You're building a pricing system for product bundles. A product has a price. A bundle contains products AND other bundles (nested).

To calculate total price, you'd need to check: is this a single product or a bundle? If bundle, iterate its contents — but contents might also be bundles. You end up with recursive type-checking scattered everywhere.

Every operation (getPrice, getWeight, applyDiscount) needs this same ugly recursive logic.`,
  solution: `Composite lets you treat individual objects and compositions uniformly through a shared interface.

Both "leaf" (Product) and "composite" (Bundle) implement the same interface (PriceableItem). A Bundle's getPrice() simply sums its children's getPrice() — each child handles itself (whether it's a product or another bundle).

Client code just calls getPrice() on anything and gets the right answer. No type-checking needed.`,
  glossary: [
    { term: "Component", definition: "The common interface for both leaf and composite objects. Declares operations like getPrice()." },
    { term: "Leaf", definition: "A simple element with no children (e.g., a single Product). Implements the component interface directly." },
    { term: "Composite", definition: "An element that has children. Delegates operations to its children and combines results." },
    { term: "Tree Structure", definition: "A hierarchy where composites contain leaves and other composites, forming branches and sub-branches." },
    { term: "Uniform Treatment", definition: "Clients interact with leaves and composites through the same interface, without caring which one they have." },
    { term: "Type Safety Trade-off", definition: "The shared interface makes it harder to restrict which components can be children. You lose compile-time guarantees about valid tree structures." },
  ],
  highlightLines: [1, 2, 3, 10, 11, 12, 19, 20, 21, 22, 23],
  diagramDescription: "Component interface (getPrice) → Leaf (Product) returns its price → Composite (Bundle) iterates children and sums their getPrice() results.",
  codeExample: `// Component interface
interface FileSystemItem {
  getName(): string;
  getSize(): number;
  display(indent?: string): string;
}

// Leaf — a single file
class File implements FileSystemItem {
  constructor(private name: string, private size: number) {}

  getName(): string { return this.name; }
  getSize(): number { return this.size; }
  display(indent = ""): string {
    return \`\${indent}📄 \${this.name} (\${this.size} KB)\`;
  }
}

// Composite — a folder containing items (files or other folders)
class Folder implements FileSystemItem {
  private children: FileSystemItem[] = [];

  constructor(private name: string) {}

  add(item: FileSystemItem): void { this.children.push(item); }
  remove(item: FileSystemItem): void {
    this.children = this.children.filter((child) => child !== item);
  }

  getName(): string { return this.name; }

  // Delegates to children — works recursively
  getSize(): number {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  display(indent = ""): string {
    const header = \`\${indent}📁 \${this.name} (\${this.getSize()} KB)\`;
    const contents = this.children
      .map((child) => child.display(indent + "  "))
      .join("\\n");
    return \`\${header}\\n\${contents}\`;
  }
}

// Build a tree structure
const src = new Folder("src");
src.add(new File("index.ts", 4));
src.add(new File("app.ts", 8));

const components = new Folder("components");
components.add(new File("Button.tsx", 3));
components.add(new File("Modal.tsx", 5));
src.add(components);

const root = new Folder("project");
root.add(src);
root.add(new File("package.json", 1));
root.add(new File("README.md", 2));

// Treat everything uniformly
console.log(root.display());
// 📁 project (23 KB)
//   📁 src (20 KB)
//     📄 index.ts (4 KB)
//     📄 app.ts (8 KB)
//     📁 components (8 KB)
//       📄 Button.tsx (3 KB)
//       📄 Modal.tsx (5 KB)
//   📄 package.json (1 KB)
//   📄 README.md (2 KB)

console.log(root.getSize()); // 23 — works at any level`,
};
