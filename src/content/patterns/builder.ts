import { PatternContent } from "@/types/pattern";

export const builderContent: PatternContent = {
  slug: "builder",
  name: "Builder",
  category: "creational",
  difficulty: "beginner",
  order: 3,
  xpReward: 150,
  lore: "The Master Mason's Workshop stands in the deepest caldera. Here, complex objects were assembled piece by piece — no telescoping incantations, no 12-parameter summonings. The mason is gone, but his blueprints remain on the walls. Learn his step-by-step discipline.",
  hook: "Construct complex objects step by step",
  analogy: "Think of ordering a custom burger. You don't get a pre-made one — you pick the bun, patty, toppings, and sauce step by step. The cashier (director) might suggest a combo, but you can also build your own. The Builder is the kitchen that assembles each piece in sequence and hands you the finished product.",
  antiPattern: `// The naive approach: telescoping constructor with 10+ parameters
const request = new HttpRequest(
  "https://api.example.com/users",  // what is this?
  "POST",                            // and this?
  { "Authorization": "Bearer tok" }, // hard to remember the order
  JSON.stringify({ name: "John" }),  // easy to mix up parameters
  10000,                             // timeout? retries? who knows
  3,                                 // impossible to read without docs
  true,                              // what boolean is this??
  null                               // what is null here??
);

// Unreadable, error-prone, impossible to make parameters optional
// Adding a new parameter means updating EVERY constructor call site`,
  problem: `You need to create objects with many optional parameters. A House class might need: walls, doors, windows, roof, garage, swimming pool, garden, security system...

Using a constructor with 15 parameters is unreadable: new House(4, 2, 8, "tile", true, false, true, ...). You can't tell what each value means.

Creating subclasses for each combination (HouseWithGarage, HouseWithPool, HouseWithGarageAndPool) leads to an explosion of classes.`,
  solution: `Builder extracts object construction into a separate class with clear, named methods for each step.

Instead of one giant constructor, you call builder.setWalls(4), builder.setRoof("tile"), builder.addGarage(). Each step is optional and self-explanatory.

A Director class can define preset configurations (e.g., "luxury house" = all options). But you can also use the builder directly for custom builds.

The builder's build() method validates and returns the finished product.`,
  glossary: [
    { term: "Builder", definition: "An interface/class with step-by-step methods for constructing parts of a complex object." },
    { term: "Concrete Builder", definition: "Implements the building steps for a specific representation (e.g., WoodHouseBuilder, StoneHouseBuilder)." },
    { term: "Director", definition: "An optional class that defines the order of building steps — knows how to build common configurations." },
    { term: "Product", definition: "The complex object being built. It doesn't need to share an interface with other products." },
    { term: "Fluent Interface", definition: "When each builder method returns 'this', allowing method chaining: builder.setA().setB().build()." },
  ],
  highlightLines: [21, 22, 23, 24, 51, 52, 53, 54, 82, 83],
  diagramDescription: "Director calls builder steps in order → Builder accumulates parts internally → build() returns the finished Product.",
  codeExample: `// The complex product
interface HttpRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  timeout: number;
  retries: number;
}

// Builder with fluent interface
class RequestBuilder {
  private url = "";
  private method = "GET";
  private headers: Record<string, string> = {};
  private body: string | null = null;
  private timeout = 5000;
  private retries = 0;

  setUrl(url: string): RequestBuilder {
    this.url = url;
    return this;
  }

  setMethod(method: string): RequestBuilder {
    this.method = method;
    return this;
  }

  addHeader(key: string, value: string): RequestBuilder {
    this.headers[key] = value;
    return this;
  }

  setBody(body: object): RequestBuilder {
    this.body = JSON.stringify(body);
    this.headers["Content-Type"] = "application/json";
    return this;
  }

  setTimeout(ms: number): RequestBuilder {
    this.timeout = ms;
    return this;
  }

  setRetries(count: number): RequestBuilder {
    this.retries = count;
    return this;
  }

  build(): HttpRequest {
    if (!this.url) throw new Error("URL is required");
    return {
      url: this.url,
      method: this.method,
      headers: this.headers,
      body: this.body,
      timeout: this.timeout,
      retries: this.retries,
    };
  }
}

// Director — presets for common configurations
class RequestDirector {
  createAuthenticatedPost(url: string, token: string, body: object) {
    return new RequestBuilder()
      .setUrl(url)
      .setMethod("POST")
      .addHeader("Authorization", \`Bearer \${token}\`)
      .setBody(body)
      .setTimeout(10000)
      .setRetries(3)
      .build();
  }
}

// Usage — clear, readable, flexible
const request = new RequestBuilder()
  .setUrl("https://api.example.com/users")
  .setMethod("GET")
  .addHeader("Accept", "application/json")
  .setTimeout(3000)
  .build();

const director = new RequestDirector();
const authRequest = director.createAuthenticatedPost(
  "https://api.example.com/orders",
  "my-token",
  { item: "book", quantity: 2 }
);`,
};
