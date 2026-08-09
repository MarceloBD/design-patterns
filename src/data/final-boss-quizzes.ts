import { PatternQuiz } from "@/types/quiz";
import { PatternCategory } from "@/types/pattern";

interface FinalBossData {
  title: string;
  lore: string;
  summary: string[];
  quiz: PatternQuiz;
}

const FINAL_BOSS_QUIZZES: Record<PatternCategory, FinalBossData> = {
  creational: {
    title: "The Architect of Genesis",
    lore: "Once the Pattern God's most devoted servant, the Architect was tasked with teaching creation to mortals. When the God vanished, he went mad with abandonment — hoarding creation knowledge, spawning malformed objects to fill the void. His betrayal was not malice but grief. He believed if he kept creating alone, perhaps the God would return. Now you must prove that creation belongs to all, not one.",
    summary: [
      "Factory Method delegates instantiation to subclasses via an overridable method, producing one product at a time.",
      "Abstract Factory creates entire families of related products through a single factory interface, ensuring consistency.",
      "Builder constructs complex objects step by step, separating the construction process from the representation.",
      "Prototype clones existing objects without coupling to their concrete classes, using each object's own clone method.",
      "Singleton ensures a single instance with a global access point, controlling shared resource access.",
    ],
    quiz: {
      patternSlug: "final-boss-creational",
      passingScore: 70,
      timeLimit: 300,
      questions: [
        { id: "fbc1", question: "You need objects of the same 'theme' (dark buttons, dark inputs, dark menus) to always appear together. Which pattern ensures this consistency?", options: [{ id: "a", text: "Abstract Factory — it produces families of related products" }, { id: "b", text: "Factory Method — it delegates creation to subclasses" }, { id: "c", text: "Builder — it constructs step by step" }, { id: "d", text: "Prototype — it clones existing objects" }], correctOptionId: "a", explanation: "Abstract Factory ensures all products in a family are compatible since one concrete factory only produces matching items." },
        { id: "fbc2", question: "A class has a constructor with 12 parameters, most optional. Which creational pattern best solves this?", options: [{ id: "a", text: "Builder — it enables step-by-step construction with only needed params" }, { id: "b", text: "Factory Method — it hides the constructor" }, { id: "c", text: "Singleton — it avoids repeated construction" }, { id: "d", text: "Prototype — it copies from a template" }], correctOptionId: "a", explanation: "Builder eliminates telescoping constructors by letting you set only what you need via method chaining." },
        { id: "fbc3", question: "You need to add a new product type to a system without modifying existing client code. The system creates ONE product at a time. Which pattern?", options: [{ id: "a", text: "Factory Method — add a new creator subclass" }, { id: "b", text: "Abstract Factory — add a new product family" }, { id: "c", text: "Prototype — register a new prototype" }, { id: "d", text: "Builder — add a new build step" }], correctOptionId: "a", explanation: "Factory Method: new product = new subclass. Client uses the creator interface, unchanged." },
        { id: "fbc4", question: "An object has private fields that cannot be accessed externally. You need exact duplicates. Which pattern handles this?", options: [{ id: "a", text: "Prototype — the object clones itself, accessing its own private state" }, { id: "b", text: "Builder — it reconstructs the object" }, { id: "c", text: "Factory Method — it creates a fresh instance" }, { id: "d", text: "Singleton — it returns the same instance" }], correctOptionId: "a", explanation: "Only the object itself can access its private fields, so it must clone itself (Prototype)." },
        { id: "fbc5", question: "Which statement is TRUE about combining creational patterns?", options: [{ id: "a", text: "Abstract Factory can use Factory Methods internally to create each product" }, { id: "b", text: "Builder and Prototype can never coexist" }, { id: "c", text: "Singleton replaces all other creational patterns" }, { id: "d", text: "Factory Method and Abstract Factory are identical in scope" }], correctOptionId: "a", explanation: "Abstract Factory often uses Factory Methods for each product. They complement each other." },
        { id: "fbc6", question: "What is the key difference between Factory Method and Abstract Factory?", options: [{ id: "a", text: "Factory Method creates one product via inheritance; Abstract Factory creates families via composition" }, { id: "b", text: "Factory Method uses composition; Abstract Factory uses inheritance" }, { id: "c", text: "Factory Method is for families; Abstract Factory is for single products" }, { id: "d", text: "They are the same pattern at different scales" }], correctOptionId: "a", explanation: "FM: one product, subclass overrides a method. AF: multiple related products, composed factory object." },
        { id: "fbc7", question: "A Director in the Builder pattern:", options: [{ id: "a", text: "Encapsulates common build sequences so clients don't repeat steps" }, { id: "b", text: "Replaces the Builder entirely" }, { id: "c", text: "Validates the product after creation" }, { id: "d", text: "Is a mandatory component of Builder" }], correctOptionId: "a", explanation: "Director knows HOW to build common configurations — it's optional but eliminates code duplication." },
        { id: "fbc8", question: "Why is Singleton often criticized despite solving a real problem?", options: [{ id: "a", text: "It introduces global state, couples code tightly, and makes testing difficult" }, { id: "b", text: "It uses too much memory" }, { id: "c", text: "It is too slow to instantiate" }, { id: "d", text: "It violates DRY principle" }], correctOptionId: "a", explanation: "Global state = hidden dependencies, difficult mocking, and tests that affect each other." },
        { id: "fbc9", question: "You want to pre-configure several 'template' objects in a registry and stamp out copies on demand. Which pattern?", options: [{ id: "a", text: "Prototype with a registry" }, { id: "b", text: "Abstract Factory" }, { id: "c", text: "Singleton" }, { id: "d", text: "Builder with Director" }], correctOptionId: "a", explanation: "A Prototype Registry stores pre-built objects that can be cloned instantly when needed." },
        { id: "fbc10", question: "Which creational pattern relies on INHERITANCE as its primary mechanism?", options: [{ id: "a", text: "Factory Method — subclasses override the creation method" }, { id: "b", text: "Abstract Factory — uses composition to inject factories" }, { id: "c", text: "Builder — uses method chaining" }, { id: "d", text: "Prototype — uses cloning" }], correctOptionId: "a", explanation: "Factory Method is the only creational pattern primarily based on inheritance (subclass overrides)." },
      ],
    },
  },
  structural: {
    title: "The Weaver of Bonds",
    lore: "A perfectionist driven to insanity by the crumbling of her perfect structures. The Weaver was the Pattern God's architect of relationships — she understood how objects should relate without becoming dependent. When the world started breaking, she tried to hold it together alone, weaving more and more connections until she became the problem she fought. Sever her tangled threads to free her.",
    summary: [
      "Adapter wraps an incompatible interface to match what clients expect, acting as a translator between two existing systems.",
      "Bridge separates abstraction from implementation into two independent hierarchies connected by composition.",
      "Composite organizes objects into tree structures where leaves and containers share the same interface.",
      "Decorator wraps objects to dynamically add behavior without modifying original classes.",
      "Facade provides a simplified unified interface to a complex subsystem of many classes.",
      "Flyweight shares common immutable state across thousands of objects to minimize memory usage.",
      "Proxy controls access to another object by standing in its place with the same interface.",
    ],
    quiz: {
      patternSlug: "final-boss-structural",
      passingScore: 70,
      timeLimit: 300,
      questions: [
        { id: "fbs1", question: "You integrate a third-party analytics library whose API doesn't match your app's logging interface. Which pattern do you use?", options: [{ id: "a", text: "Adapter — it translates the incompatible interface to match yours" }, { id: "b", text: "Facade — it simplifies a complex subsystem" }, { id: "c", text: "Proxy — it controls access" }, { id: "d", text: "Bridge — it separates hierarchies" }], correctOptionId: "a", explanation: "Adapter makes two existing, incompatible interfaces work together without modifying either." },
        { id: "fbs2", question: "A rendering system supports multiple platforms (OpenGL, Vulkan) and multiple shapes (circle, square). Without a pattern, you'd need Platform×Shape classes. Which pattern prevents this explosion?", options: [{ id: "a", text: "Bridge — it separates the two dimensions into independent hierarchies" }, { id: "b", text: "Adapter — it wraps one interface" }, { id: "c", text: "Composite — it builds trees" }, { id: "d", text: "Decorator — it adds behavior" }], correctOptionId: "a", explanation: "Bridge prevents multiplicative class growth by separating independent dimensions via composition." },
        { id: "fbs3", question: "A file system where folders contain files and other folders, and 'getSize()' works uniformly on both, uses:", options: [{ id: "a", text: "Composite — leaves and containers share one component interface" }, { id: "b", text: "Decorator — it wraps and delegates" }, { id: "c", text: "Flyweight — it shares state" }, { id: "d", text: "Proxy — it controls access" }], correctOptionId: "a", explanation: "Composite: uniform interface for both individual items (files) and containers (folders)." },
        { id: "fbs4", question: "You need logging, auth, and compression on HTTP requests. Each can be added or removed independently at runtime. Which pattern?", options: [{ id: "a", text: "Decorator — stack wrappers to compose behavior dynamically" }, { id: "b", text: "Chain of Responsibility — pass along handlers" }, { id: "c", text: "Adapter — translate interfaces" }, { id: "d", text: "Facade — simplify the subsystem" }], correctOptionId: "a", explanation: "Decorator lets you stack LoggingDecorator → AuthDecorator → CompressionDecorator at runtime." },
        { id: "fbs5", question: "You want to add lazy-loading to a database query object without changing its class. Which pattern?", options: [{ id: "a", text: "Proxy — specifically a Virtual Proxy that defers initialization" }, { id: "b", text: "Decorator — it adds behavior" }, { id: "c", text: "Adapter — it translates interfaces" }, { id: "d", text: "Flyweight — it shares state" }], correctOptionId: "a", explanation: "Virtual Proxy delays expensive creation until the object is first used." },
        { id: "fbs6", question: "How does Proxy differ from Decorator if both wrap objects?", options: [{ id: "a", text: "Proxy controls access/lifecycle; Decorator adds new behavior/features" }, { id: "b", text: "They are identical in purpose" }, { id: "c", text: "Proxy adds behavior; Decorator controls access" }, { id: "d", text: "Proxy uses inheritance; Decorator uses composition" }], correctOptionId: "a", explanation: "Proxy manages when/if you access the real subject. Decorator enriches what it does." },
        { id: "fbs7", question: "A game renders 10,000 trees. Each tree has the same mesh/texture but different position/rotation. Which pattern saves memory?", options: [{ id: "a", text: "Flyweight — shared intrinsic state (mesh) + unique extrinsic state (position)" }, { id: "b", text: "Prototype — clone each tree" }, { id: "c", text: "Composite — organize in tree structure" }, { id: "d", text: "Singleton — one tree instance" }], correctOptionId: "a", explanation: "Flyweight: one mesh shared by all trees; each tree only stores its unique coordinates." },
        { id: "fbs8", question: "A video conversion framework has dozens of classes (codec, bitrate, format, container). You want a simple 'convert(file, format)' API. Which pattern?", options: [{ id: "a", text: "Facade — unified simple interface to the complex subsystem" }, { id: "b", text: "Adapter — interface translation" }, { id: "c", text: "Bridge — separate hierarchies" }, { id: "d", text: "Decorator — add behavior" }], correctOptionId: "a", explanation: "Facade wraps the complexity behind one convenient method without restricting power users." },
        { id: "fbs9", question: "Which structural pattern uses COMPOSITION over INHERITANCE as its defining mechanism?", options: [{ id: "a", text: "All of them — Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy all prefer composition" }, { id: "b", text: "Only Bridge" }, { id: "c", text: "Only Decorator" }, { id: "d", text: "None — they all use inheritance" }], correctOptionId: "a", explanation: "Structural patterns are fundamentally about composing objects to form larger structures." },
        { id: "fbs10", question: "You need to restrict which users can call certain methods on a service, without modifying the service. Which pattern?", options: [{ id: "a", text: "Proxy — specifically a Protection Proxy that checks permissions" }, { id: "b", text: "Decorator — it adds features" }, { id: "c", text: "Facade — it simplifies" }, { id: "d", text: "Adapter — it translates" }], correctOptionId: "a", explanation: "Protection Proxy intercepts calls and checks authorization before delegating to the real subject." },
      ],
    },
  },
  behavioral: {
    title: "The Conductor of Storms",
    lore: "Once the maestro who orchestrated all communication in Architectura, the Conductor channeled the Pattern God's will — every observer, every mediator, every chain flowed through his tower. When the God fell silent, the Conductor's tower amplified that silence into a roar. He now drowns the world in noise to avoid confronting the quiet. Silence his storm to restore clarity.",
    summary: [
      "Chain of Responsibility passes requests along a chain of handlers until one processes it.",
      "Command encapsulates operations as objects, enabling undo, queuing, and logging.",
      "Iterator provides a uniform way to traverse any collection without exposing internal structure.",
      "Mediator centralizes communication between components to reduce direct dependencies.",
      "Memento captures and restores object state without breaking encapsulation.",
      "Observer notifies multiple subscribers when a publisher's state changes.",
      "State lets objects change behavior when their internal state changes, eliminating conditionals.",
      "Strategy defines interchangeable algorithms injectable at runtime.",
      "Template Method defines an algorithm skeleton with customizable steps via inheritance.",
      "Visitor adds operations to stable hierarchies without modifying their classes.",
    ],
    quiz: {
      patternSlug: "final-boss-behavioral",
      passingScore: 70,
      timeLimit: 300,
      questions: [
        { id: "fbb1", question: "Express.js middleware where each function either handles the request or calls next() is an example of:", options: [{ id: "a", text: "Chain of Responsibility — handler processes or passes to the next" }, { id: "b", text: "Decorator — wraps and adds behavior" }, { id: "c", text: "Strategy — swappable algorithms" }, { id: "d", text: "Command — encapsulated operations" }], correctOptionId: "a", explanation: "Each middleware independently decides to handle or delegate — classic Chain of Responsibility." },
        { id: "fbb2", question: "You implement undo/redo in a text editor. Commands store previous state. What TWO patterns are combined here?", options: [{ id: "a", text: "Command (encapsulates the operation) + Memento (stores state for undo)" }, { id: "b", text: "Strategy + Observer" }, { id: "c", text: "State + Mediator" }, { id: "d", text: "Visitor + Iterator" }], correctOptionId: "a", explanation: "Command captures actions; Memento saves state snapshots before each action for reversal." },
        { id: "fbb3", question: "State pattern and Strategy pattern both swap behavior objects. The KEY difference is:", options: [{ id: "a", text: "In State, states know about each other and trigger transitions; Strategy objects are independent" }, { id: "b", text: "State uses composition; Strategy uses inheritance" }, { id: "c", text: "Strategy changes at runtime; State is fixed" }, { id: "d", text: "There is no meaningful difference" }], correctOptionId: "a", explanation: "State objects are aware of siblings and control transitions. Strategies are stateless and independent." },
        { id: "fbb4", question: "A chat room where users don't message each other directly but through a central hub uses:", options: [{ id: "a", text: "Mediator — centralizes communication, components only know the mediator" }, { id: "b", text: "Observer — subscribers get notified" }, { id: "c", text: "Chain of Responsibility — message passes through handlers" }, { id: "d", text: "Command — messages are command objects" }], correctOptionId: "a", explanation: "Mediator: components communicate exclusively through a central coordinator, reducing coupling." },
        { id: "fbb5", question: "addEventListener in the DOM is an implementation of:", options: [{ id: "a", text: "Observer — element is the subject, callbacks are observers" }, { id: "b", text: "Strategy — the callback is a strategy" }, { id: "c", text: "Command — events are commands" }, { id: "d", text: "Mediator — the DOM mediates" }], correctOptionId: "a", explanation: "Subscribe (addEventListener), notify (event dispatch), unsubscribe (removeEventListener) = Observer." },
        { id: "fbb6", question: "Template Method and Strategy both let you customize algorithms. The fundamental mechanism difference is:", options: [{ id: "a", text: "Template Method uses inheritance (override steps); Strategy uses composition (inject objects)" }, { id: "b", text: "Strategy uses inheritance; Template Method uses composition" }, { id: "c", text: "Template Method is runtime; Strategy is compile-time" }, { id: "d", text: "No difference, they're aliases" }], correctOptionId: "a", explanation: "TM: subclasses override hooks. Strategy: context holds a strategy object that can be swapped." },
        { id: "fbb7", question: "You need to add export-to-PDF, export-to-XML, export-to-JSON to a stable AST without modifying its node classes. Which pattern?", options: [{ id: "a", text: "Visitor — add new operations without modifying the element hierarchy" }, { id: "b", text: "Strategy — inject the export algorithm" }, { id: "c", text: "Decorator — wrap nodes" }, { id: "d", text: "Iterator — traverse the tree" }], correctOptionId: "a", explanation: "Visitor: each export format = new Visitor. AST nodes unchanged. Perfect when hierarchy is stable." },
        { id: "fbb8", question: "Iterator pattern uses Symbol.iterator in TypeScript/JavaScript. What does implementing this symbol enable?", options: [{ id: "a", text: "Using for...of loops and spread syntax on custom collections" }, { id: "b", text: "Making objects serializable" }, { id: "c", text: "Enabling garbage collection" }, { id: "d", text: "Adding the object to arrays" }], correctOptionId: "a", explanation: "Symbol.iterator makes objects iterable — for...of, destructuring, and spread all use it." },
        { id: "fbb9", question: "A traffic light changes behavior entirely depending on its current color (red/yellow/green). Each color has different rules for what transitions are valid. Which pattern?", options: [{ id: "a", text: "State — each color is a state object that defines behavior and valid transitions" }, { id: "b", text: "Strategy — each color is a strategy" }, { id: "c", text: "Observer — lights observe the timer" }, { id: "d", text: "Command — color changes are commands" }], correctOptionId: "a", explanation: "State: the object's entire behavior changes based on its current state, and states control transitions." },
        { id: "fbb10", question: "Visitor's main trade-off is:", options: [{ id: "a", text: "Easy to add new operations, but adding new element types requires updating ALL visitors" }, { id: "b", text: "Easy to add elements, hard to add operations" }, { id: "c", text: "High memory usage" }, { id: "d", text: "Cannot work with tree structures" }], correctOptionId: "a", explanation: "Each new element type means adding a new visit method to every visitor implementation." },
      ],
    },
  },
};

export function getFinalBossData(category: PatternCategory): FinalBossData {
  return FINAL_BOSS_QUIZZES[category];
}

export function getFinalBossQuiz(category: PatternCategory): PatternQuiz {
  return FINAL_BOSS_QUIZZES[category].quiz;
}
