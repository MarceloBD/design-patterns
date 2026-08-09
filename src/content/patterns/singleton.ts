import { PatternContent } from "@/types/pattern";

export const singletonContent: PatternContent = {
  slug: "singleton",
  name: "Singleton",
  category: "creational",
  difficulty: "beginner",
  order: 5,
  xpReward: 150,
  lore: "At the heart of the volcano sits the Eternal Flame — a resource that must exist exactly once. Multiple flames once threatened to melt the realm. A seal was placed: one instance, one access point. But the seal has drawbacks. Learn its power AND its cost.",
  hook: "Ensure a class has only one instance with a global access point",
  analogy: "A country has one government. No matter who asks 'who is in charge?', they always get the same answer — there's only one active instance. You can't create a second government without a revolution (or resetting the app). The Singleton is that single authoritative instance everyone references.",
  antiPattern: `// The naive approach: uncontrolled global state
let globalLogger = null;
let globalConfig = null;

function getLogger() {
  // Oops! Multiple calls in async code can create multiple instances
  if (!globalLogger) {
    globalLogger = new Logger(); // Anyone can overwrite: globalLogger = null
  }
  return globalLogger;
}

// Even worse: raw global variables
export const logger = new Logger(); // Created immediately even if never used
export const config = new Config(); // No control over initialization order

// Problems: no lazy loading, no protection from overwrite, no encapsulation
// Any module can do: logger = new Logger() and create inconsistency`,
  problem: `Two problems Singleton solves:

1. Controlled access to a shared resource. A database connection pool, a logger, or a configuration manager should have exactly one instance. Multiple instances would waste resources or cause conflicts (e.g., multiple loggers writing to the same file simultaneously).

2. Global access point. You need to access the instance from anywhere in the app without passing it through every function parameter. Unlike global variables, Singleton protects the instance from being overwritten.`,
  solution: `Singleton makes the constructor private and provides a static method (getInstance()) that returns the same instance every time.

On first call, getInstance() creates the object and stores it. On subsequent calls, it returns the stored instance. No second instance can ever exist because the constructor is inaccessible from outside.

Important: Singleton is often overused. Prefer dependency injection unless you genuinely need global, single-instance access.`,
  glossary: [
    { term: "Private Constructor", definition: "Making the constructor inaccessible from outside the class, preventing direct instantiation with 'new'." },
    { term: "Static Method", definition: "A method belonging to the class itself (not instances), accessible via ClassName.method() without creating an object." },
    { term: "Lazy Initialization", definition: "Creating the instance only when first requested, not when the class is loaded. Saves resources if never used." },
    { term: "Thread Safety", definition: "Ensuring concurrent access doesn't accidentally create multiple instances. In JS (single-threaded), this is less of a concern." },
    { term: "Global State", definition: "Data accessible from anywhere in the application. Singletons provide controlled global state, unlike raw global variables." },
  ],
  highlightLines: [2, 6, 9, 10, 11, 12, 13],
  diagramDescription: "Singleton class has a private constructor + private static instance + public static getInstance() → getInstance() checks if instance exists, creates if not, and always returns the same one.",
  codeExample: `// Logger Singleton — only one logger should write to the file
class Logger {
  private static instance: Logger | null = null;
  private logs: string[] = [];

  // Private constructor — can't use "new Logger()" from outside
  private constructor(private readonly prefix: string) {}

  // The single access point
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger("[APP]");
    }
    return Logger.instance;
  }

  info(message: string): void {
    const entry = \`\${this.prefix} INFO: \${message}\`;
    this.logs.push(entry);
    console.log(entry);
  }

  error(message: string): void {
    const entry = \`\${this.prefix} ERROR: \${message}\`;
    this.logs.push(entry);
    console.error(entry);
  }

  getHistory(): string[] {
    return [...this.logs];
  }
}

// Configuration Manager — single source of truth
class ConfigManager {
  private static instance: ConfigManager | null = null;
  private config: Map<string, string> = new Map();

  private constructor() {
    // Load defaults
    this.config.set("api_url", "https://api.example.com");
    this.config.set("timeout", "5000");
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  get(key: string): string | undefined {
    return this.config.get(key);
  }

  set(key: string, value: string): void {
    this.config.set(key, value);
  }
}

// Usage — anywhere in the app, same instance
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
console.log(logger1 === logger2); // true — same object

logger1.info("Server started");
logger2.info("Request received");
// Both write to the same log history

const config = ConfigManager.getInstance();
console.log(config.get("api_url")); // "https://api.example.com"`,
};
