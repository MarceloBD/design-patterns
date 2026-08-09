import { SecretPage } from "@/types/pattern";

export const SECRET_PAGES: Record<string, SecretPage> = {
  "factory-method": {
    title: "The Sealed Scroll of Creation",
    sections: [
      { heading: "Real-World Uses", content: "React.createElement(), document.createElement(), Angular's component factories, database driver adapters (pg, mysql2), logging frameworks (Winston transports), payment gateways (Stripe/PayPal factories)." },
      { heading: "Advanced Technique", content: "Combine with a Registry pattern: register factory methods by key at startup, then resolve creators dynamically at runtime. This is how plugin architectures work (webpack loaders, VSCode extensions)." },
      { heading: "Watch Out", content: "Don't create a factory for every class — only when the creation logic varies or when you need to defer the decision of which class to instantiate. Over-abstracting leads to 'factory of factory' anti-patterns." },
      { heading: "Performance Tip", content: "Factory methods add one level of indirection. In hot paths (game loops, parsers), consider caching created instances or using object pools alongside factories." },
    ],
  },
  "abstract-factory": {
    title: "The Grimoire of Families",
    sections: [
      { heading: "Real-World Uses", content: "UI toolkit families (Material/Fluent/Cupertino), cross-platform rendering (React Native, Flutter), database abstraction layers (TypeORM connection factories), theme systems." },
      { heading: "Advanced Technique", content: "Use Abstract Factory with Dependency Injection containers. The DI container acts as the abstract factory, resolving entire families of related services based on configuration or environment." },
      { heading: "Watch Out", content: "Adding a new product to the family forces changes across ALL concrete factories. Design your product interfaces carefully upfront. Consider the Open/Closed Principle tradeoff." },
    ],
  },
  builder: {
    title: "The Architect's Hidden Blueprint",
    sections: [
      { heading: "Real-World Uses", content: "Query builders (Knex, Prisma), HTTP request builders (Axios config), test data builders (factories in testing), CLI argument parsers, email/notification builders." },
      { heading: "Advanced Technique", content: "Implement a fluent interface with method chaining AND immutability: each method returns a new Builder instance, allowing safe reuse of partially-configured builders as templates." },
      { heading: "Watch Out", content: "Builders shine when objects have 4+ optional parameters. For 2-3 params, a simple constructor or options object is cleaner. Don't over-engineer." },
      { heading: "Performance Tip", content: "Avoid allocating intermediate objects in the builder chain. Use a mutable internal state and only create the final product on build()." },
    ],
  },
  prototype: {
    title: "The Clone Codex",
    sections: [
      { heading: "Real-World Uses", content: "JavaScript's Object.create() and spread operator, game entity spawning (clone a template enemy), undo/redo systems (clone state snapshots), configuration presets." },
      { heading: "Advanced Technique", content: "Implement a Prototype Registry that stores pre-configured prototypes by name. Combine with deep clone (structuredClone) for complex nested objects while keeping reference equality for immutable parts." },
      { heading: "Watch Out", content: "Shallow vs deep cloning is the #1 source of bugs. Shared references in cloned objects cause mutations to affect the original. Always decide clone depth explicitly." },
    ],
  },
  singleton: {
    title: "The One Ring of Instances",
    sections: [
      { heading: "Real-World Uses", content: "Database connection pools, logging services, configuration managers, caches (Redis clients), window/document in browsers, application state stores (Redux store)." },
      { heading: "Advanced Technique", content: "Use module-level instances in ES modules instead of class-based singletons. ES modules are evaluated once and cached — the module itself IS the singleton. Cleaner and tree-shakeable." },
      { heading: "Watch Out", content: "Singletons are global state in disguise. They make unit testing hard (shared state between tests), hide dependencies, and prevent parallel execution. Prefer dependency injection." },
      { heading: "When NOT to Use", content: "If you're using Singleton just for convenience (global access), use DI instead. True singletons should represent genuinely unique resources: one database pool, one event bus, one config." },
    ],
  },
  adapter: {
    title: "The Rosetta Stone of Interfaces",
    sections: [
      { heading: "Real-World Uses", content: "Third-party API wrappers, legacy system integration, payment provider adapters (abstract Stripe/PayPal behind one interface), database driver adapters, file system abstractions." },
      { heading: "Advanced Technique", content: "Create two-way adapters that can translate in both directions. Useful for data transformation layers (API ↔ Domain model ↔ Database schema) keeping each layer independent." },
      { heading: "Watch Out", content: "Don't adapt everything — if two interfaces are truly incompatible in semantics (not just shape), an adapter can mask fundamental mismatches that should be addressed architecturally." },
    ],
  },
  bridge: {
    title: "The Dimensional Rift Codex",
    sections: [
      { heading: "Real-World Uses", content: "Cross-platform UI (abstraction: Button, implementation: WindowsButton/MacButton), notification systems (channels × message types), rendering engines (2D/3D × OpenGL/Vulkan/Metal)." },
      { heading: "Advanced Technique", content: "Bridge is powerful in plugin architectures. The abstraction defines the plugin interface, while implementations are loaded dynamically. This enables hot-swapping implementations at runtime." },
      { heading: "Watch Out", content: "Bridge adds complexity. Use it only when you have TWO independent dimensions that vary. If only one dimension varies, Adapter or Strategy is simpler." },
    ],
  },
  composite: {
    title: "The Fractal Tree Manuscript",
    sections: [
      { heading: "Real-World Uses", content: "File systems (files + directories), UI component trees (React's component hierarchy), organization charts, menu systems, mathematical expression trees, build task graphs." },
      { heading: "Advanced Technique", content: "Add a parent reference to enable traversal in both directions. Implement visitor pattern on top of composite for operations that vary independently from the tree structure." },
      { heading: "Watch Out", content: "Composite makes it hard to restrict child types. A 'File' shouldn't contain children, but the uniform interface suggests it can. Use TypeScript's type system to enforce leaf vs branch constraints." },
    ],
  },
  decorator: {
    title: "The Enchantment Scrolls",
    sections: [
      { heading: "Real-World Uses", content: "Express/Koa middleware, TypeScript/Python decorators (@Injectable), Java I/O streams (BufferedReader wrapping FileReader), logging wrappers, caching layers, authentication guards." },
      { heading: "Advanced Technique", content: "Stack decorators for cross-cutting concerns: AuthDecorator(LoggingDecorator(CachingDecorator(service))). Order matters — place caching before logging to avoid logging cache hits." },
      { heading: "Watch Out", content: "Deep decorator chains become hard to debug (which layer modified the result?). Limit to 2-3 layers. If you need more, consider middleware pipelines or aspect-oriented approaches instead." },
    ],
  },
  facade: {
    title: "The Gatekeeper's Manual",
    sections: [
      { heading: "Real-World Uses", content: "jQuery (facade over DOM API), ORM query interfaces (facade over SQL), AWS SDK high-level clients, React hooks (facade over complex state logic), API gateway pattern in microservices." },
      { heading: "Advanced Technique", content: "Create multiple facades at different abstraction levels. A low-level facade for power users and a high-level facade for common operations. This is the 'progressive disclosure' principle applied to APIs." },
      { heading: "Watch Out", content: "A facade shouldn't become a 'god object' that knows everything. Keep it thin — delegate to subsystems, don't implement business logic inside the facade itself." },
    ],
  },
  flyweight: {
    title: "The Memory Thief's Ledger",
    sections: [
      { heading: "Real-World Uses", content: "String interning (JavaScript engine optimization), game particle systems, character rendering in text editors, icon libraries, CSS class reuse, database connection pooling." },
      { heading: "Advanced Technique", content: "Combine with Factory: the factory checks if a flyweight for the given intrinsic state already exists before creating new ones. Use WeakMap for automatic garbage collection of unused flyweights." },
      { heading: "Watch Out", content: "Only apply when you have thousands+ of similar objects AND memory is a measured problem. Premature flyweight optimization adds complexity for negligible gain in most applications." },
    ],
  },
  proxy: {
    title: "The Shadow Agent Dossier",
    sections: [
      { heading: "Real-World Uses", content: "JavaScript Proxy object, lazy-loading images, API rate limiting, access control (authorization proxies), logging proxies, virtual DOM (React), database connection lazy initialization." },
      { heading: "Advanced Technique", content: "Use ES6 Proxy for meta-programming: intercept property access, validate assignments, auto-track reactive dependencies (Vue 3's reactivity), implement observable objects." },
      { heading: "Watch Out", content: "Proxies can mask the real object's behavior, making debugging difficult. Always ensure the proxy maintains the same interface contract. Avoid proxies in performance-critical paths due to trap overhead." },
    ],
  },
  "chain-of-responsibility": {
    title: "The Chain of Command Cipher",
    sections: [
      { heading: "Real-World Uses", content: "Express/Koa middleware stacks, DOM event bubbling, logging level handlers, form validation chains, approval workflows, exception handling hierarchies." },
      { heading: "Advanced Technique", content: "Make the chain bidirectional: allow handlers to pass control forward AND receive results back (like Koa's 'downstream' and 'upstream' phases). This enables response transformation." },
      { heading: "Watch Out", content: "Ensure the chain always terminates — either a handler processes the request or there's a default handler at the end. Infinite chains or silently dropped requests are common bugs." },
    ],
  },
  command: {
    title: "The Battle Orders Archive",
    sections: [
      { heading: "Real-World Uses", content: "Undo/redo systems, transaction queues, macro recording, keyboard shortcuts, job schedulers (Bull/BullMQ), CQRS pattern, database migrations." },
      { heading: "Advanced Technique", content: "Implement composite commands (macros) that execute multiple commands as one unit. Add serialization to commands for distributed systems — send commands across network boundaries." },
      { heading: "Watch Out", content: "The undo() method must perfectly reverse execute(). For complex state, consider storing snapshots (Memento) rather than computing reverse operations, which can be error-prone." },
    ],
  },
  iterator: {
    title: "The Infinite Path Scroll",
    sections: [
      { heading: "Real-World Uses", content: "JavaScript iterators/generators (Symbol.iterator), database cursors, paginated API responses, file stream readers, tree traversal (DFS/BFS), lazy evaluation pipelines." },
      { heading: "Advanced Technique", content: "Use async generators (async function*) for paginated API consumption. Combine with backpressure handling for streaming large datasets without memory overflow." },
      { heading: "Watch Out", content: "Iterators over mutable collections can break if the collection changes during iteration. Either iterate over a snapshot or use concurrent-safe data structures." },
    ],
  },
  mediator: {
    title: "The Diplomat's Secret Treaty",
    sections: [
      { heading: "Real-World Uses", content: "Chat rooms, air traffic control, Redux store (mediates between components), form field interdependencies, event buses, microservice orchestrators." },
      { heading: "Advanced Technique", content: "Combine with the Event system: the mediator listens to events from colleagues and dispatches actions. This decouples even further — colleagues don't know the mediator exists." },
      { heading: "Watch Out", content: "The mediator can become a god object concentrating all logic. Split into multiple domain-specific mediators if it grows beyond ~200 lines." },
    ],
  },
  memento: {
    title: "The Time Capsule Codex",
    sections: [
      { heading: "Real-World Uses", content: "Text editor undo history, game save states, form draft auto-save, transaction rollback, browser history stack, state management time-travel debugging (Redux DevTools)." },
      { heading: "Advanced Technique", content: "Use structural sharing (like Immer or persistent data structures) to avoid copying entire state on every snapshot. Only store diffs for memory-efficient history in large applications." },
      { heading: "Watch Out", content: "Storing full snapshots for every change can exhaust memory quickly. Implement a maximum history size and consider incremental mementos (storing only what changed)." },
    ],
  },
  observer: {
    title: "The All-Seeing Eye Manuscript",
    sections: [
      { heading: "Real-World Uses", content: "DOM event listeners, RxJS observables, React state subscriptions, WebSocket message handlers, Node.js EventEmitter, pub/sub messaging (Redis, Kafka topics)." },
      { heading: "Advanced Technique", content: "Implement fine-grained subscriptions: let observers subscribe to specific event types or state paths rather than all changes. This is how Zustand's selector pattern achieves performance." },
      { heading: "Watch Out", content: "Memory leaks from forgotten subscriptions are the #1 Observer bug. Always unsubscribe in cleanup (useEffect return, componentWillUnmount, AbortController). Use WeakRef for optional observers." },
    ],
  },
  state: {
    title: "The Shapeshifter's Grimoire",
    sections: [
      { heading: "Real-World Uses", content: "TCP connection states, game character states (idle/running/attacking), UI component states (loading/error/success), workflow engines, vending machines, traffic lights." },
      { heading: "Advanced Technique", content: "Combine State with a state machine library (XState). Define transitions declaratively, enforce valid state changes at compile time, and generate state diagrams from code automatically." },
      { heading: "Watch Out", content: "State pattern creates many small classes. If transitions are simple (2-3 states), a switch statement or enum is cleaner. Reserve State pattern for 4+ states with complex transition logic." },
    ],
  },
  strategy: {
    title: "The Tactician's Playbook",
    sections: [
      { heading: "Real-World Uses", content: "Sorting algorithms (Array.sort comparator), compression strategies (gzip/brotli/zstd), authentication strategies (Passport.js), pricing calculations, validation rules, routing algorithms." },
      { heading: "Advanced Technique", content: "Use strategy with configuration: strategies read parameters from a config object, enabling fine-tuning without new strategy classes. This is how ML model hyperparameters work." },
      { heading: "Watch Out", content: "If you have a strategy that's used in only one place and never changes, you don't need the pattern — a simple function will do. Strategy adds value when algorithms are selected dynamically." },
    ],
  },
  "template-method": {
    title: "The Master's Recipe Book",
    sections: [
      { heading: "Real-World Uses", content: "React class component lifecycle (componentDidMount/render/componentWillUnmount), Express route handlers, testing frameworks (setup/test/teardown), build pipelines, ETL processes." },
      { heading: "Advanced Technique", content: "In TypeScript, prefer composition over inheritance: instead of abstract classes, accept step functions as parameters. This gives you template method flexibility without the inheritance coupling." },
      { heading: "Watch Out", content: "Deep inheritance hierarchies make template methods fragile (Fragile Base Class problem). Prefer max 2 levels of inheritance. For more flexibility, switch to Strategy pattern." },
    ],
  },
  visitor: {
    title: "The Wanderer's Journal",
    sections: [
      { heading: "Real-World Uses", content: "AST transformers (Babel plugins, ESLint rules, TypeScript compiler), document exporters (HTML/PDF/Markdown from same tree), serialization, code generators, tax calculators across product types." },
      { heading: "Advanced Technique", content: "Use double dispatch to achieve type-safe operations across heterogeneous collections without type casting. In TypeScript, leverage discriminated unions with exhaustive switch for a lighter alternative." },
      { heading: "Watch Out", content: "Adding a new element type forces changes to ALL visitors. Visitor works best when element types are stable but operations change frequently. If elements change often, use a different pattern." },
    ],
  },
};
