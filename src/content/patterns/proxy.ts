import { PatternContent } from "@/types/pattern";

export const proxyContent: PatternContent = {
  slug: "proxy",
  name: "Proxy",
  category: "structural",
  difficulty: "intermediate",
  order: 7,
  xpReward: 150,
  hook: "Provide a substitute that controls access to another object",
  analogy: "A credit card is a proxy for your bank account. It provides the same interface (paying for things) but adds access control (PIN verification, spending limits), lazy loading (doesn't transfer money until you swipe), and logging (transaction history). The merchant doesn't interact with your bank account directly.",
  antiPattern: `// The naive approach: mixing access control, caching, logging into the main class
class Database {
  query(sql: string, user: User): Result {
    // Access control crammed in
    if (!user.hasPermission("read")) throw new Error("Forbidden");
    if (sql.includes("DELETE") && !user.isAdmin) throw new Error("Forbidden");

    // Caching crammed in
    const cacheKey = hash(sql);
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    // Logging crammed in
    console.log(\`[\${Date.now()}] \${user.name} executed: \${sql}\`);

    // Actual database logic buried under cross-cutting concerns
    const result = this.connection.execute(sql);
    this.cache.set(cacheKey, result);
    return result;
  }
}

// Single Responsibility violated: one class handles 4 different concerns
// Can't disable caching or logging without modifying the class`,
  problem: `You have a heavy Database object that's expensive to create (it opens connections, loads caches). But some code paths might never actually use it. You're wasting startup time and memory.

Or: you need to add access control (only admins can delete), logging (track who queried what), or caching (don't re-fetch unchanged data) — but you don't want to modify the original class.`,
  solution: `Proxy creates a substitute object with the same interface as the real one. The proxy controls access: it can create the real object lazily, check permissions, cache results, or log operations — then delegate to the real object.

Client code uses the proxy exactly like the real object (same interface). It doesn't know or care whether it's talking to the real thing or a proxy.

Types: Virtual Proxy (lazy init), Protection Proxy (access control), Caching Proxy, Logging Proxy.`,
  glossary: [
    { term: "Subject Interface", definition: "The shared interface that both the Real Subject and Proxy implement. Clients code against this." },
    { term: "Real Subject", definition: "The actual object that does the real work. The Proxy delegates to this after its checks." },
    { term: "Proxy", definition: "The substitute that controls access to the real subject. Same interface, extra behavior." },
    { term: "Lazy Initialization", definition: "Virtual Proxy delays creating the expensive object until it's actually needed." },
    { term: "Access Control", definition: "Protection Proxy checks permissions before allowing operations on the real subject." },
  ],
  highlightLines: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
  diagramDescription: "Client → Proxy (same interface) → checks/logs/caches → delegates to RealSubject.",
  codeExample: `// Subject interface
interface DataService {
  query(sql: string): Record<string, unknown>[];
  execute(sql: string): { affectedRows: number };
}

// Real Subject — expensive to create, no access control
class DatabaseService implements DataService {
  constructor() {
    console.log("[DB] Heavy connection established");
  }

  query(sql: string): Record<string, unknown>[] {
    console.log(\`Executing query: \${sql}\`);
    return [{ id: 1, name: "Result" }];
  }

  execute(sql: string): { affectedRows: number } {
    console.log(\`Executing: \${sql}\`);
    return { affectedRows: 1 };
  }
}

// Proxy — adds lazy init, caching, access control, and logging
class DatabaseProxy implements DataService {
  private realService: DatabaseService | null = null;
  private cache = new Map<string, Record<string, unknown>[]>();
  private queryLog: { sql: string; timestamp: number; user: string }[] = [];

  constructor(private currentUser: { role: string; name: string }) {}

  private getService(): DatabaseService {
    if (!this.realService) {
      this.realService = new DatabaseService(); // Lazy init
    }
    return this.realService;
  }

  query(sql: string): Record<string, unknown>[] {
    // Caching Proxy
    if (this.cache.has(sql)) {
      console.log(\`📦 Cache hit for: \${sql}\`);
      return this.cache.get(sql)!;
    }

    // Logging Proxy
    this.queryLog.push({ sql, timestamp: Date.now(), user: this.currentUser.name });

    const result = this.getService().query(sql);
    this.cache.set(sql, result);
    return result;
  }

  execute(sql: string): { affectedRows: number } {
    // Protection Proxy — only admins can execute writes
    if (this.currentUser.role !== "admin") {
      throw new Error(\`Access denied: \${this.currentUser.role} cannot execute writes\`);
    }

    this.cache.clear(); // Invalidate cache on writes
    this.queryLog.push({ sql, timestamp: Date.now(), user: this.currentUser.name });
    return this.getService().execute(sql);
  }

  getAuditLog() { return [...this.queryLog]; }
}

// Client code — uses same interface, unaware it's a proxy
const adminDb: DataService = new DatabaseProxy({ role: "admin", name: "Alice" });
adminDb.query("SELECT * FROM users"); // Creates DB connection (lazy)
adminDb.query("SELECT * FROM users"); // Cache hit — no DB call

const viewerDb: DataService = new DatabaseProxy({ role: "viewer", name: "Bob" });
viewerDb.query("SELECT * FROM users"); // Works fine
// viewerDb.execute("DELETE FROM users"); // Throws: Access denied!`,
};
