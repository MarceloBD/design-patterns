import { PatternContent } from "@/types/pattern";

export const chainOfResponsibilityContent: PatternContent = {
  slug: "chain-of-responsibility",
  name: "Chain of Responsibility",
  category: "behavioral",
  difficulty: "intermediate",
  order: 1,
  xpReward: 150,
  lore: "The Storm Nexus messenger towers once passed requests from handler to handler. Auth checked first. Then rate-limiting. Then formatting. Each tower could stop the message or pass it on. Now messages pile up at the first broken tower. Rebuild the chain.",
  hook: "Pass requests along a chain of handlers until one handles it",
  analogy: "Customer support escalation. You call with a problem. First, the automated system tries. If it can't help, a junior rep takes over. If they can't solve it, a senior agent gets involved. If even they're stuck, it escalates to a manager. Each level decides: handle it or pass it up the chain.",
  antiPattern: `// The naive approach: one massive function with nested if-else for all checks
function handleRequest(request: Request): Response {
  // Authentication check
  if (!request.headers.auth) return new Response(401, "No token");
  if (!verifyToken(request.headers.auth)) return new Response(401, "Invalid");

  // Authorization check
  if (!hasPermission(request.user, request.resource)) return new Response(403, "Forbidden");

  // Rate limiting
  if (getRateCount(request.ip) > 100) return new Response(429, "Too many");

  // Validation
  if (!request.body) return new Response(400, "No body");
  if (!isValidSchema(request.body)) return new Response(400, "Bad format");

  // Logging (crammed in somewhere)
  logRequest(request);

  // Actual logic buried at the bottom
  return processRequest(request);
}

// Monolithic, untestable, can't reorder/skip checks, can't reuse in other endpoints`,
  problem: `You're building a request validation system. Each request needs multiple checks: authentication, authorization, rate limiting, input validation, logging.

Using nested if-else creates deeply coupled, rigid code. Adding or removing a check means editing the entire chain. Reordering checks? Rewrite everything.

Different endpoints need different combinations of checks. You can't easily reuse individual checks across routes.`,
  solution: `Chain of Responsibility links handlers into a chain. Each handler decides whether to process the request or pass it to the next handler.

Each handler has a reference to the next one. When it receives a request, it either handles it (and stops) or delegates to the next handler. Handlers are independent and reusable.

You can assemble different chains for different needs: one route gets auth + validation + logging, another gets just rate-limiting + logging.`,
  glossary: [
    { term: "Handler", definition: "An interface declaring a method for handling requests and a way to set the next handler in the chain." },
    { term: "Concrete Handler", definition: "Implements the handling logic. Decides to process the request or pass it along." },
    { term: "Chain", definition: "The linked sequence of handlers. Request enters at the start and travels until handled or reaching the end." },
    { term: "Middleware", definition: "A common real-world implementation of this pattern (Express.js, Koa). Each middleware is a handler in the chain." },
    { term: "Decoupling", definition: "Senders don't know which handler will process their request. Handlers don't know about each other." },
  ],
  highlightLines: [8, 9, 10, 11, 12, 13, 14, 20, 21, 22],
  diagramDescription: "Client sends Request → Handler1.handle() → Handler2.handle() → Handler3.handle() → each decides to process or pass along.",
  codeExample: `// Handler interface
interface Middleware {
  setNext(handler: Middleware): Middleware;
  handle(request: HttpRequest): HttpResponse | null;
}

interface HttpRequest {
  path: string;
  method: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  user?: { id: string; role: string };
}

interface HttpResponse {
  status: number;
  body: string;
}

// Base handler — manages the chain linking
abstract class BaseMiddleware implements Middleware {
  private next: Middleware | null = null;

  setNext(handler: Middleware): Middleware {
    this.next = handler;
    return handler; // enables chaining: a.setNext(b).setNext(c)
  }

  handle(request: HttpRequest): HttpResponse | null {
    if (this.next) {
      return this.next.handle(request);
    }
    return null;
  }
}

// Concrete handlers
class AuthMiddleware extends BaseMiddleware {
  handle(request: HttpRequest): HttpResponse | null {
    const token = request.headers["authorization"];
    if (!token) {
      return { status: 401, body: "Authentication required" };
    }
    request.user = { id: "user_1", role: "admin" };
    return super.handle(request); // pass to next
  }
}

class RateLimitMiddleware extends BaseMiddleware {
  private requests = new Map<string, number>();

  handle(request: HttpRequest): HttpResponse | null {
    const ip = request.headers["x-forwarded-for"] || "unknown";
    const count = (this.requests.get(ip) || 0) + 1;
    this.requests.set(ip, count);

    if (count > 100) {
      return { status: 429, body: "Too many requests" };
    }
    return super.handle(request);
  }
}

class ValidationMiddleware extends BaseMiddleware {
  handle(request: HttpRequest): HttpResponse | null {
    if (request.method === "POST" && Object.keys(request.body).length === 0) {
      return { status: 400, body: "Request body cannot be empty" };
    }
    return super.handle(request);
  }
}

// Assemble chain
const auth = new AuthMiddleware();
const rateLimit = new RateLimitMiddleware();
const validation = new ValidationMiddleware();

auth.setNext(rateLimit).setNext(validation);

// Process request through chain
const request: HttpRequest = {
  path: "/api/users",
  method: "POST",
  headers: { authorization: "Bearer token123", "x-forwarded-for": "192.168.1.1" },
  body: { name: "Alice" },
};

const response = auth.handle(request);
console.log(response); // null = all checks passed, proceed to route handler`,
};
