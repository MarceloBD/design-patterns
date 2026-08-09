import { PatternContent } from "@/types/pattern";

export const flyweightContent: PatternContent = {
  slug: "flyweight",
  name: "Flyweight",
  category: "structural",
  difficulty: "advanced",
  order: 6,
  xpReward: 150,
  lore: "The Crystal Plains hold ten thousand identical soldiers — but each one unique in position and mission. Memory once nearly consumed the Citadel trying to store them all separately. An ancient optimization shares what is common, keeps only what is unique. Find it.",
  hook: "Share common state between multiple objects to save memory",
  analogy: "Characters in a text editor. The letter 'e' appears thousands of times in a document. Instead of storing font, size, and glyph data separately for each 'e', the editor stores that shared data once and reuses it. Each character instance only stores what's unique to it (position in the document).",
  antiPattern: `// The naive approach: each particle stores ALL its data independently
class Particle {
  sprite: ImageBitmap;    // 50KB per sprite (shared across same type!)
  color: string;          // same for all particles of same type
  animation: Frame[];     // 20KB of animation data (identical for same type!)
  x: number;
  y: number;
  speed: number;
  direction: number;
}

// 100,000 particles x (50KB + 20KB + overhead) = 7GB+ of RAM!
const particles: Particle[] = [];
for (let i = 0; i < 100000; i++) {
  particles.push(new Particle(loadSprite("bullet"), "red", loadAnim("bullet")));
  // Loading the SAME sprite and animation 100,000 times!
}

// Massive memory waste: identical data duplicated across thousands of objects`,
  problem: `You're building a game with thousands of particles (bullets, sparks, shrapnel). Each particle has: sprite image, color, position, speed, direction.

With 100,000 particles at 100+ bytes each = 10MB+ of RAM just for particles. The game stutters and crashes on mobile devices.

But most particles share the same sprite and color (there are only 5 types). You're duplicating the same heavy data thousands of times.`,
  solution: `Flyweight separates object state into two parts:

1. Intrinsic state (shared): data that's the same across many objects (sprite, color, size). Stored once in a "flyweight" object.
2. Extrinsic state (unique): data that's different for each instance (position, speed). Passed in from outside when needed.

A Flyweight Factory ensures each unique combination of intrinsic state is created only once and shared among all objects that need it. Memory drops dramatically.`,
  glossary: [
    { term: "Intrinsic State", definition: "Shared, immutable data that many objects have in common. Stored inside the flyweight and reused." },
    { term: "Extrinsic State", definition: "Unique data per instance (e.g., position, context). Not stored in the flyweight — passed from outside." },
    { term: "Flyweight", definition: "An object that stores only intrinsic state. Shared among many contexts to save memory." },
    { term: "Flyweight Factory", definition: "Creates and manages flyweight objects. Returns existing ones if the intrinsic state already exists." },
    { term: "Object Pool", definition: "A related concept: a cache of reusable objects. Flyweight focuses specifically on sharing immutable state." },
  ],
  highlightLines: [20, 21, 22, 23, 24, 25, 26, 27, 28],
  diagramDescription: "FlyweightFactory maintains a cache → returns shared Flyweight objects (intrinsic state) → Client stores extrinsic state separately and passes it to flyweight methods.",
  codeExample: `// Flyweight — stores shared (intrinsic) state only
class TreeType {
  constructor(
    public readonly name: string,
    public readonly color: string,
    public readonly texture: string // imagine this is a heavy image
  ) {}

  draw(x: number, y: number, canvas: string): string {
    return \`Drawing \${this.color} \${this.name} at (\${x},\${y}) on \${canvas}\`;
  }
}

// Flyweight Factory — ensures sharing
class TreeTypeFactory {
  private static cache = new Map<string, TreeType>();

  static getTreeType(name: string, color: string, texture: string): TreeType {
    const key = \`\${name}_\${color}_\${texture}\`;

    if (!TreeTypeFactory.cache.has(key)) {
      TreeTypeFactory.cache.set(key, new TreeType(name, color, texture));
      console.log(\`Created new TreeType: \${key}\`);
    }

    return TreeTypeFactory.cache.get(key)!;
  }

  static getCacheSize(): number {
    return TreeTypeFactory.cache.size;
  }
}

// Context — stores extrinsic state (unique per tree)
class Tree {
  constructor(
    private x: number,
    private y: number,
    private type: TreeType // reference to shared flyweight
  ) {}

  draw(canvas: string): string {
    return this.type.draw(this.x, this.y, canvas);
  }
}

// Forest uses thousands of trees but only a few TreeTypes
class Forest {
  private trees: Tree[] = [];

  plantTree(x: number, y: number, name: string, color: string, texture: string): void {
    const type = TreeTypeFactory.getTreeType(name, color, texture);
    this.trees.push(new Tree(x, y, type));
  }

  draw(canvas: string): string[] {
    return this.trees.map((tree) => tree.draw(canvas));
  }

  getStats() {
    return {
      totalTrees: this.trees.length,
      uniqueTypes: TreeTypeFactory.getCacheSize(),
      memorySaved: \`~\${this.trees.length - TreeTypeFactory.getCacheSize()} duplicate objects avoided\`,
    };
  }
}

// Plant 10,000 trees but only 3 types exist in memory
const forest = new Forest();
for (let i = 0; i < 5000; i++) {
  forest.plantTree(Math.random() * 800, Math.random() * 600, "Oak", "green", "oak.png");
}
for (let i = 0; i < 3000; i++) {
  forest.plantTree(Math.random() * 800, Math.random() * 600, "Pine", "darkgreen", "pine.png");
}
for (let i = 0; i < 2000; i++) {
  forest.plantTree(Math.random() * 800, Math.random() * 600, "Birch", "white", "birch.png");
}

console.log(forest.getStats());
// { totalTrees: 10000, uniqueTypes: 3, memorySaved: "~9997 duplicate objects avoided" }`,
};
