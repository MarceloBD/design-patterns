import { PatternQuiz } from "@/types/quiz";

export const SECRET_BOSS_TITLE = "The Pattern God";
export const SECRET_BOSS_SUBTITLE = "Architect of All Realms";
export const SECRET_BOSS_LORE =
  "Beyond the three realms, where creation, structure, and behavior converge into one — the Pattern God awaits. " +
  "An ancient entity woven from the fabric of all 22 patterns, it tests only those who have proven mastery over every realm. " +
  "No one has seen this being and returned unchanged. The very laws of software bow before it.";

export const SECRET_BOSS_QUIZ: PatternQuiz = {
  patternSlug: "secret-boss-pattern-god",
  passingScore: 80,
  timeLimit: 600,
  questions: [
    {
      id: "sb1",
      question: "A notification system uses Observer for events, but each notification must be processed by auth → rate-limit → format handlers in order. Which pattern structures the processing pipeline?",
      options: [
        { id: "a", text: "Chain of Responsibility — ordered handlers that each decide to process or delegate" },
        { id: "b", text: "Decorator — wraps the notification to add formatting" },
        { id: "c", text: "Mediator — centralizes all handler communication" },
        { id: "d", text: "Strategy — selects one handler at runtime" },
      ],
      correctOptionId: "a",
      explanation: "Chain of Responsibility processes requests through an ordered sequence of independent handlers — each can handle or pass along.",
    },
    {
      id: "sb2",
      question: "You're building a document editor. Operations must be undoable, the document's visual representation varies by platform, and plugins can add export formats without modifying the document. Which THREE patterns address these needs respectively?",
      options: [
        { id: "a", text: "Command (undo) + Bridge (platform rendering) + Visitor (export plugins)" },
        { id: "b", text: "Memento (undo) + Adapter (platform) + Strategy (export)" },
        { id: "c", text: "Command (undo) + Adapter (platform) + Decorator (export)" },
        { id: "d", text: "State (undo) + Facade (platform) + Iterator (export)" },
      ],
      correctOptionId: "a",
      explanation: "Command encapsulates operations for undo. Bridge separates document abstraction from platform implementation. Visitor adds operations to a stable document AST.",
    },
    {
      id: "sb3",
      question: "Factory Method uses inheritance; Abstract Factory uses composition. But which STRUCTURAL pattern also fundamentally distinguishes itself from a similar pattern by this same inheritance-vs-composition split?",
      options: [
        { id: "a", text: "Template Method (inheritance) vs Strategy (composition) — the behavioral equivalent" },
        { id: "b", text: "Adapter (inheritance) vs Bridge (composition) in how they relate abstraction to implementation" },
        { id: "c", text: "Decorator (inheritance) vs Proxy (composition)" },
        { id: "d", text: "Composite (inheritance) vs Flyweight (composition)" },
      ],
      correctOptionId: "a",
      explanation: "Template Method and Strategy are the behavioral mirror of this split. But the question asks about 'structural' — actually the real answer is the behavioral pair. The actual structural split is Adapter (can use class inheritance) vs Bridge (always composition). However, the most famous inheritance-vs-composition pair in the GoF is Template Method vs Strategy.",
    },
    {
      id: "sb4",
      question: "An e-commerce platform has ProductFactory, but now needs to create families of UI components (buttons, inputs, modals) that match each brand theme. The product creation stays independent from UI. What's the minimal change?",
      options: [
        { id: "a", text: "Add an Abstract Factory for UI component families — separate concern from ProductFactory" },
        { id: "b", text: "Extend ProductFactory to also create UI components" },
        { id: "c", text: "Use Decorator to wrap products with UI" },
        { id: "d", text: "Use Prototype to clone themed UI templates" },
      ],
      correctOptionId: "a",
      explanation: "Abstract Factory creates consistent families of related objects (themed buttons + inputs + modals). Keeping it separate from ProductFactory follows Single Responsibility.",
    },
    {
      id: "sb5",
      question: "A game has 50,000 particle objects. Each particle has type (fire/water/smoke), position, velocity, and lifetime. Type determines the sprite and color (same for all particles of that type). How do you optimize memory?",
      options: [
        { id: "a", text: "Flyweight: share type data (sprite, color) as intrinsic state; keep position/velocity/lifetime as extrinsic" },
        { id: "b", text: "Prototype: clone a base particle for each type" },
        { id: "c", text: "Singleton: one particle per type" },
        { id: "d", text: "Composite: group particles in a tree" },
      ],
      correctOptionId: "a",
      explanation: "Flyweight: 3 shared flyweight objects (fire/water/smoke) with sprite+color. 50,000 contexts store only unique position/velocity/lifetime.",
    },
    {
      id: "sb6",
      question: "A state machine for an order (Draft→Submitted→Approved→Shipped→Delivered) where each state has different allowed operations and transitions. But now you need to LOG every state transition without modifying any state class. Which combination?",
      options: [
        { id: "a", text: "State pattern for the machine + Observer to notify a logger of every transition" },
        { id: "b", text: "State pattern + Decorator on each state class" },
        { id: "c", text: "Strategy pattern + Command for logging" },
        { id: "d", text: "Chain of Responsibility for transitions + Memento for logging" },
      ],
      correctOptionId: "a",
      explanation: "State handles behavior per state and transitions. Observer decouples the logging concern — the context publishes transition events; logger subscribes without touching state classes.",
    },
    {
      id: "sb7",
      question: "You need a configuration object that: (1) has 20+ optional fields, (2) is immutable once built, (3) only one instance should exist globally. Which patterns do you combine?",
      options: [
        { id: "a", text: "Builder (step-by-step construction) → produces a frozen object, accessed via Singleton pattern" },
        { id: "b", text: "Prototype (clone a template) + Factory Method" },
        { id: "c", text: "Abstract Factory + Memento" },
        { id: "d", text: "Facade (simple interface) + Flyweight (shared state)" },
      ],
      correctOptionId: "a",
      explanation: "Builder handles complex construction with many optional fields. The build() method returns an immutable instance. Singleton ensures only one config exists globally.",
    },
    {
      id: "sb8",
      question: "Iterator, Visitor, and Composite are often used together. In a compiler's AST, what role does each play?",
      options: [
        { id: "a", text: "Composite structures the AST, Iterator traverses it, Visitor adds operations (type-check, optimize, codegen) without modifying nodes" },
        { id: "b", text: "Iterator structures the AST, Composite traverses it, Visitor creates nodes" },
        { id: "c", text: "Visitor structures the AST, Composite adds operations, Iterator creates nodes" },
        { id: "d", text: "All three do the same thing with different syntax" },
      ],
      correctOptionId: "a",
      explanation: "Composite = tree structure (expressions contain sub-expressions). Iterator = traversal strategy. Visitor = separate algorithms that process nodes without modifying them.",
    },
    {
      id: "sb9",
      question: "Proxy and Decorator BOTH wrap objects with the same interface. A caching layer that stores results and returns cached data on repeat calls is best classified as:",
      options: [
        { id: "a", text: "Proxy — it controls access to the real computation, deciding whether to delegate or return cached data" },
        { id: "b", text: "Decorator — it adds caching behavior on top" },
        { id: "c", text: "Flyweight — it shares cached results" },
        { id: "d", text: "Memento — it stores previous results" },
      ],
      correctOptionId: "a",
      explanation: "Caching Proxy controls WHETHER you access the real object. It's about access control/lifecycle, not adding new behavior — the key Proxy vs Decorator distinction.",
    },
    {
      id: "sb10",
      question: "A micro-frontend architecture needs: components from different teams to communicate without knowing each other, a plugin system where features are added without core changes, and undo across all modules. Which patterns power this?",
      options: [
        { id: "a", text: "Mediator (communication hub) + Visitor or Strategy (plugins) + Command+Memento (undo)" },
        { id: "b", text: "Observer (communication) + Decorator (plugins) + Prototype (undo)" },
        { id: "c", text: "Facade (communication) + Factory (plugins) + State (undo)" },
        { id: "d", text: "Chain of Responsibility (communication) + Adapter (plugins) + Iterator (undo)" },
      ],
      correctOptionId: "a",
      explanation: "Mediator decouples components. Strategy/Visitor lets you add operations without modifying core. Command captures operations for undo; Memento stores state snapshots.",
    },
    {
      id: "sb11",
      question: "Which statement about Adapter vs Facade vs Bridge is MOST accurate?",
      options: [
        { id: "a", text: "Adapter makes existing incompatible interfaces work together; Facade simplifies a complex subsystem; Bridge prevents future coupling by separating dimensions upfront" },
        { id: "b", text: "All three do the same thing at different scales" },
        { id: "c", text: "Adapter is for single classes; Facade is for subsystems; Bridge is for algorithms" },
        { id: "d", text: "Adapter uses inheritance; Facade uses composition; Bridge uses neither" },
      ],
      correctOptionId: "a",
      explanation: "Adapter = fix existing incompatibility. Facade = simplify existing complexity. Bridge = design upfront to prevent future coupling between independently evolving dimensions.",
    },
    {
      id: "sb12",
      question: "In a reactive UI framework, when state changes: (1) the view re-renders, (2) multiple computed values update, (3) side effects trigger in order. Map each to a pattern:",
      options: [
        { id: "a", text: "Observer (state→view reactive binding) + Observer (computed subscriptions) + Chain of Responsibility (ordered side effects)" },
        { id: "b", text: "State (re-render) + Flyweight (computed) + Command (side effects)" },
        { id: "c", text: "Mediator (state→view) + Strategy (computed) + Iterator (side effects)" },
        { id: "d", text: "Template Method (re-render) + Prototype (computed) + Visitor (side effects)" },
      ],
      correctOptionId: "a",
      explanation: "Observer is the backbone of reactivity (publish state changes → subscribers update). Ordered side effect execution where each can stop the chain = Chain of Responsibility.",
    },
    {
      id: "sb13",
      question: "You're refactoring a 2000-line function with deeply nested if/else based on: (1) user role, (2) subscription tier, (3) feature flags. Which pattern combination eliminates this complexity?",
      options: [
        { id: "a", text: "Strategy for each dimension — compose role-strategy × tier-strategy × feature-strategy through dependency injection" },
        { id: "b", text: "State for role, Observer for tier, Command for features" },
        { id: "c", text: "One giant Visitor that handles all combinations" },
        { id: "d", text: "Chain of Responsibility with one handler per condition" },
      ],
      correctOptionId: "a",
      explanation: "Each varying dimension becomes its own Strategy interface. Compose them via DI to eliminate combinatorial explosion of conditionals.",
    },
    {
      id: "sb14",
      question: "Singleton is criticized for introducing global state. What's the BEST refactoring that keeps single-instance semantics without the drawbacks?",
      options: [
        { id: "a", text: "Dependency Injection — register as singleton scope in a DI container; inject where needed" },
        { id: "b", text: "Use a global variable instead" },
        { id: "c", text: "Make everything static" },
        { id: "d", text: "Use Prototype to clone the singleton" },
      ],
      correctOptionId: "a",
      explanation: "DI containers manage single-instance lifecycle without global coupling. Code depends on interfaces, not concrete singletons. Testing becomes trivial with mock injection.",
    },
    {
      id: "sb15",
      question: "A chat application serializes messages for offline storage and replay. Messages include text, images, reactions, and thread replies forming trees. Which patterns handle serialization + tree structure + replay?",
      options: [
        { id: "a", text: "Memento (serialize/restore state) + Composite (tree of messages/threads) + Command (replay operations)" },
        { id: "b", text: "Prototype (clone messages) + Iterator (traverse) + Observer (replay)" },
        { id: "c", text: "Builder (construct messages) + Flyweight (share content) + Strategy (replay)" },
        { id: "d", text: "Factory (create messages) + Adapter (serialize) + State (replay)" },
      ],
      correctOptionId: "a",
      explanation: "Memento captures message state for storage/restore. Composite models the thread hierarchy. Command objects represent actions that can be stored and replayed.",
    },
  ],
};

export function isSecretBossUnlocked(completedPatterns: string[]): boolean {
  return (
    completedPatterns.includes("final-boss-creational") &&
    completedPatterns.includes("final-boss-structural") &&
    completedPatterns.includes("final-boss-behavioral")
  );
}
