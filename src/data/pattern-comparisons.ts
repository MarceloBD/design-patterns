export interface PatternComparison {
  patternA: string;
  patternB: string;
  title: string;
  confusion: string;
  differences: Array<{
    aspect: string;
    patternAAnswer: string;
    patternBAnswer: string;
  }>;
  whenToUse: {
    patternA: string;
    patternB: string;
  };
}

export const PATTERN_COMPARISONS: PatternComparison[] = [
  {
    patternA: "factory-method",
    patternB: "abstract-factory",
    title: "Factory Method vs Abstract Factory",
    confusion: "Both create objects without specifying concrete classes. The key difference is scope: Factory Method creates ONE product; Abstract Factory creates FAMILIES of related products.",
    differences: [
      {
        aspect: "What it creates",
        patternAAnswer: "A single product type via a method that subclasses override",
        patternBAnswer: "Multiple related products (a family) via a factory object",
      },
      {
        aspect: "Mechanism",
        patternAAnswer: "Inheritance — subclasses override a creation method",
        patternBAnswer: "Composition — client uses a factory object to create products",
      },
      {
        aspect: "Adding new products",
        patternAAnswer: "Create a new creator subclass with its own factory method",
        patternBAnswer: "Create a new concrete factory that produces the entire family",
      },
      {
        aspect: "Client coupling",
        patternAAnswer: "Client calls a method on the creator; doesn't pick which creator",
        patternBAnswer: "Client receives a factory and calls multiple creation methods on it",
      },
      {
        aspect: "Complexity",
        patternAAnswer: "Simpler — one method, one product",
        patternBAnswer: "More complex — an interface with multiple creation methods",
      },
    ],
    whenToUse: {
      patternA: "When a class needs to delegate instantiation of ONE type of object to its subclasses.",
      patternB: "When you need to create several related objects that must be used together as a consistent set (e.g., UI themes: DarkButton + DarkInput + DarkCard).",
    },
  },
  {
    patternA: "strategy",
    patternB: "state",
    title: "Strategy vs State",
    confusion: "Both replace conditionals with polymorphism and use composition with interchangeable objects. The difference is intent: Strategy swaps algorithms externally; State transitions are driven internally by the states themselves.",
    differences: [
      {
        aspect: "Who triggers the swap",
        patternAAnswer: "The client or context explicitly sets the strategy",
        patternBAnswer: "States transition themselves — each state knows the next state",
      },
      {
        aspect: "Awareness of siblings",
        patternAAnswer: "Strategies don't know about each other",
        patternBAnswer: "States are aware of other states and trigger transitions",
      },
      {
        aspect: "Purpose",
        patternAAnswer: "Choose an algorithm variant for a task",
        patternBAnswer: "Model an object whose behavior changes based on internal state",
      },
      {
        aspect: "Lifetime",
        patternAAnswer: "Usually set once or rarely changed",
        patternBAnswer: "Changes frequently as the object moves through states",
      },
      {
        aspect: "Example",
        patternAAnswer: "Sorting: pick QuickSort vs MergeSort based on data size",
        patternBAnswer: "Order status: Pending → Processing → Shipped → Delivered",
      },
    ],
    whenToUse: {
      patternA: "When you have multiple interchangeable algorithms and the client decides which to use.",
      patternB: "When an object's behavior changes significantly based on its internal state, like a finite state machine.",
    },
  },
  {
    patternA: "adapter",
    patternB: "facade",
    title: "Adapter vs Facade",
    confusion: "Both wrap other code to present a different interface. Adapter makes two incompatible interfaces work together; Facade simplifies a complex subsystem into fewer methods.",
    differences: [
      {
        aspect: "Intent",
        patternAAnswer: "Make an existing interface compatible with what the client expects",
        patternBAnswer: "Provide a simpler interface to a complex subsystem",
      },
      {
        aspect: "Scope",
        patternAAnswer: "Wraps ONE class/interface to translate it",
        patternBAnswer: "Wraps an ENTIRE subsystem (many classes) behind a few methods",
      },
      {
        aspect: "When applied",
        patternAAnswer: "Retroactively — to integrate something that already exists",
        patternBAnswer: "Proactively — to simplify access for common use cases",
      },
      {
        aspect: "Interface change",
        patternAAnswer: "Transforms interface A into interface B",
        patternBAnswer: "Creates a brand-new simplified interface",
      },
      {
        aspect: "Client access",
        patternAAnswer: "Client can only use the adapted interface",
        patternBAnswer: "Client CAN bypass the facade and use subsystem directly",
      },
    ],
    whenToUse: {
      patternA: "When integrating a third-party library or legacy code that has an incompatible API.",
      patternB: "When a subsystem has many classes and you want a simple entry point for 80% of use cases.",
    },
  },
  {
    patternA: "decorator",
    patternB: "proxy",
    title: "Decorator vs Proxy",
    confusion: "Both wrap an object with the same interface. The difference is intent: Decorator adds NEW behavior; Proxy controls ACCESS to existing behavior.",
    differences: [
      {
        aspect: "Intent",
        patternAAnswer: "Add responsibilities/features dynamically",
        patternBAnswer: "Control access, add lazy loading, caching, or security",
      },
      {
        aspect: "Who creates the wrapped object",
        patternAAnswer: "The client creates both the object and decorators, composing them",
        patternBAnswer: "The proxy typically manages the real object's lifecycle itself",
      },
      {
        aspect: "Stacking",
        patternAAnswer: "Multiple decorators stack (logging + caching + retry)",
        patternBAnswer: "Usually one proxy per real subject",
      },
      {
        aspect: "Knowledge of subject",
        patternAAnswer: "Works with any component implementing the interface",
        patternBAnswer: "Knows the exact real subject class it controls",
      },
      {
        aspect: "Example",
        patternAAnswer: "Add compression → encryption → logging to a data stream",
        patternBAnswer: "Lazy-load a heavy image only when scrolled into view",
      },
    ],
    whenToUse: {
      patternA: "When you need to add or combine behaviors dynamically without changing the original class.",
      patternB: "When you need to control access: lazy initialization, access control, logging, or caching.",
    },
  },
  {
    patternA: "composite",
    patternB: "decorator",
    title: "Composite vs Decorator",
    confusion: "Both use recursive composition (wrapping objects in objects of the same interface). Composite builds tree hierarchies; Decorator adds behavior layers.",
    differences: [
      {
        aspect: "Structure",
        patternAAnswer: "Tree structure with leaves and containers holding children",
        patternBAnswer: "Linear chain of wrappers, each adding one behavior",
      },
      {
        aspect: "Purpose",
        patternAAnswer: "Treat individual objects and groups uniformly",
        patternBAnswer: "Add responsibilities without modifying the original",
      },
      {
        aspect: "Children",
        patternAAnswer: "A composite has MANY children",
        patternBAnswer: "A decorator wraps exactly ONE component",
      },
      {
        aspect: "Operations",
        patternAAnswer: "Delegates to ALL children and aggregates results (e.g., sum prices)",
        patternBAnswer: "Enhances the ONE wrapped object's behavior (e.g., add logging)",
      },
      {
        aspect: "Example",
        patternAAnswer: "File system: folders contain files and other folders",
        patternBAnswer: "HTTP client: add retry → cache → auth layers",
      },
    ],
    whenToUse: {
      patternA: "When you have part-whole hierarchies (trees) and want to treat nodes and leaves identically.",
      patternB: "When you want to add optional behavior layers to individual objects dynamically.",
    },
  },
  {
    patternA: "template-method",
    patternB: "strategy",
    title: "Template Method vs Strategy",
    confusion: "Both let you vary parts of an algorithm. Template Method uses inheritance (subclass overrides steps); Strategy uses composition (inject a different algorithm object).",
    differences: [
      {
        aspect: "Mechanism",
        patternAAnswer: "Inheritance — subclass overrides abstract/hook methods",
        patternBAnswer: "Composition — context holds a strategy reference",
      },
      {
        aspect: "Algorithm structure",
        patternAAnswer: "Fixed skeleton defined in base class; only steps vary",
        patternBAnswer: "The ENTIRE algorithm is swappable as a unit",
      },
      {
        aspect: "Runtime flexibility",
        patternAAnswer: "Fixed at compile time (class hierarchy)",
        patternBAnswer: "Swappable at runtime by changing the strategy reference",
      },
      {
        aspect: "Granularity",
        patternAAnswer: "Varies individual STEPS within a fixed algorithm",
        patternBAnswer: "Varies the WHOLE algorithm as a pluggable unit",
      },
      {
        aspect: "Example",
        patternAAnswer: "Data export: open → process → validate → save (override process/validate)",
        patternBAnswer: "Pricing: set strategy to PercentageDiscount or FlatDiscount",
      },
    ],
    whenToUse: {
      patternA: "When you have a fixed algorithm structure but need to customize individual steps in subclasses.",
      patternB: "When you need to swap entire algorithms at runtime based on context or user choice.",
    },
  },
  {
    patternA: "command",
    patternB: "memento",
    title: "Command vs Memento",
    confusion: "Both are used to implement undo/redo, but differently. Command records the OPERATION performed; Memento records the STATE before the operation.",
    differences: [
      {
        aspect: "What it stores",
        patternAAnswer: "The operation itself (action + parameters + receiver)",
        patternBAnswer: "A snapshot of the object's entire state at a point in time",
      },
      {
        aspect: "Undo mechanism",
        patternAAnswer: "Each command has an undo() method that reverses its action",
        patternBAnswer: "Restore the saved state snapshot directly",
      },
      {
        aspect: "When it works best",
        patternAAnswer: "When operations are easily reversible (insert → delete)",
        patternBAnswer: "When state changes are complex and hard to reverse step by step",
      },
      {
        aspect: "Storage cost",
        patternAAnswer: "Small — stores just the operation details",
        patternBAnswer: "Can be large — stores full state snapshots",
      },
      {
        aspect: "Combined usage",
        patternAAnswer: "Command triggers the operation",
        patternBAnswer: "Memento saves state before each command for safe rollback",
      },
    ],
    whenToUse: {
      patternA: "When operations can be encapsulated, queued, logged, or reversed individually.",
      patternB: "When you need exact state snapshots (checkpoints) regardless of how many operations happened.",
    },
  },
  {
    patternA: "observer",
    patternB: "mediator",
    title: "Observer vs Mediator",
    confusion: "Both manage communication between objects. Observer is one-to-many (broadcast); Mediator is many-to-many (centralized routing).",
    differences: [
      {
        aspect: "Communication style",
        patternAAnswer: "Broadcast — subject notifies ALL subscribers of changes",
        patternBAnswer: "Routed — mediator decides which components to notify",
      },
      {
        aspect: "Component awareness",
        patternAAnswer: "Subject knows observers exist but not what they do",
        patternBAnswer: "Components don't know about each other at all",
      },
      {
        aspect: "Coupling direction",
        patternAAnswer: "One-directional: subject → observers",
        patternBAnswer: "Bidirectional: components ↔ mediator ↔ components",
      },
      {
        aspect: "Complexity location",
        patternAAnswer: "Distributed — each observer handles its own reaction",
        patternBAnswer: "Centralized — mediator contains all coordination logic",
      },
      {
        aspect: "Example",
        patternAAnswer: "Event emitter: DOM click → all registered handlers fire",
        patternBAnswer: "Chat room: users send messages through the room, not directly",
      },
    ],
    whenToUse: {
      patternA: "When one object's state changes should automatically notify multiple dependents.",
      patternB: "When multiple objects need complex interaction rules managed in one place.",
    },
  },
];

export function getComparisonsForPattern(slug: string): PatternComparison[] {
  return PATTERN_COMPARISONS.filter(
    (comparison) => comparison.patternA === slug || comparison.patternB === slug
  );
}
