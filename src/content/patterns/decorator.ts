import { PatternContent } from "@/types/pattern";

export const decoratorContent: PatternContent = {
  slug: "decorator",
  name: "Decorator",
  category: "structural",
  difficulty: "intermediate",
  order: 4,
  xpReward: 150,
  hook: "Attach new behaviors to objects by wrapping them",
  analogy: "Wearing layers of clothing. You start with a t-shirt (base object). Add a hoodie (decorator 1) for warmth. Add a rain jacket (decorator 2) for waterproofing. Each layer adds functionality without modifying the layers beneath. You can mix and match layers in any combination.",
  antiPattern: `// The naive approach: subclass explosion for every feature combination
class Notifier { send(msg: string) { /* email */ } }
class NotifierSMS extends Notifier { /* email + sms */ }
class NotifierSlack extends Notifier { /* email + slack */ }
class NotifierSMSSlack extends Notifier { /* email + sms + slack */ }
class NotifierSMSSlackTelegram extends Notifier { /* ... */ }
// 4 channels = 15 possible combinations = 15 subclasses!

// Or the if-else approach:
class NotifierConfigurable {
  send(msg: string, channels: string[]) {
    if (channels.includes("email")) { /* send email */ }
    if (channels.includes("sms")) { /* send sms */ }
    if (channels.includes("slack")) { /* send slack */ }
    // Growing if-else chain, all behavior in one massive class
  }
}

// Either way: rigid, hard to extend, violates Single Responsibility`,
  problem: `You have a Notifier class that sends messages. Now you need variations: email + SMS, email + Slack, SMS + Slack + email, just Slack...

Using inheritance: NotifierEmailSMS, NotifierEmailSlack, NotifierSMSSlackEmail — class explosion! With 4 channels, you'd need 15 subclass combinations.

Worse, inheritance is static. You can't add or remove behaviors at runtime based on user preferences.`,
  solution: `Decorator wraps an object with additional behavior, using the same interface as the original.

Each decorator holds a reference to the wrapped object and delegates to it, adding its own behavior before or after. Since decorators implement the same interface, you can stack them infinitely.

EmailDecorator wraps a Notifier, adds email sending, then passes to the next. SlackDecorator wraps that result, adds Slack. Stack in any order, at runtime.`,
  glossary: [
    { term: "Component Interface", definition: "The shared interface that both the original object and all decorators implement." },
    { term: "Concrete Component", definition: "The base object being wrapped. Has the core behavior without any extras." },
    { term: "Base Decorator", definition: "An abstract class that holds a reference to the wrapped component and delegates to it." },
    { term: "Concrete Decorator", definition: "Adds specific behavior (e.g., compression, encryption, logging) before/after delegating." },
    { term: "Wrapping", definition: "Enclosing an object inside another that adds behavior. The key mechanism of the Decorator pattern." },
    { term: "Middleware as Decorator", definition: "Express.js middleware is a real-world Decorator: each layer wraps the handler, adding logging, auth, compression, then delegates to the next. Classic stacking." },
  ],
  highlightLines: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  diagramDescription: "DataSource interface → FileDataSource (base) → Decorator wraps DataSource → EncryptionDecorator, CompressionDecorator stack on top.",
  codeExample: `// Component interface
interface HttpClient {
  request(url: string, options: RequestInit): Promise<Response>;
}

// Base component
class BasicHttpClient implements HttpClient {
  async request(url: string, options: RequestInit): Promise<Response> {
    return fetch(url, options);
  }
}

// Base decorator
abstract class HttpClientDecorator implements HttpClient {
  constructor(protected wrapped: HttpClient) {}
  async request(url: string, options: RequestInit): Promise<Response> {
    return this.wrapped.request(url, options);
  }
}

// Adds authentication header
class AuthDecorator extends HttpClientDecorator {
  constructor(wrapped: HttpClient, private token: string) { super(wrapped); }

  async request(url: string, options: RequestInit): Promise<Response> {
    const headers = new Headers(options.headers);
    headers.set("Authorization", \`Bearer \${this.token}\`);
    return super.request(url, { ...options, headers });
  }
}

// Adds request logging
class LoggingDecorator extends HttpClientDecorator {
  async request(url: string, options: RequestInit): Promise<Response> {
    console.log(\`→ \${options.method ?? "GET"} \${url}\`);
    const start = Date.now();
    const response = await super.request(url, options);
    console.log(\`← \${response.status} (\${Date.now() - start}ms)\`);
    return response;
  }
}

// Adds automatic retry
class RetryDecorator extends HttpClientDecorator {
  constructor(wrapped: HttpClient, private maxRetries: number) { super(wrapped); }

  async request(url: string, options: RequestInit): Promise<Response> {
    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await super.request(url, options);
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.maxRetries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }
    throw lastError;
  }
}

// Stack decorators in any combination at runtime
let client: HttpClient = new BasicHttpClient();
client = new AuthDecorator(client, "my-token");
client = new LoggingDecorator(client);
client = new RetryDecorator(client, 3);

// Uses all decorators transparently
client.request("https://api.example.com/data", { method: "GET" });
// → GET https://api.example.com/data  (logging)
// ← 200 (45ms)                         (logging)
// Auth header added automatically       (auth)
// Retries on failure up to 3 times      (retry)`,
};
