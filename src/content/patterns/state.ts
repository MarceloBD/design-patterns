import { PatternContent } from "@/types/pattern";

export const stateContent: PatternContent = {
  slug: "state",
  name: "State",
  category: "behavioral",
  difficulty: "intermediate",
  order: 7,
  xpReward: 150,
  hook: "Let an object change its behavior when its internal state changes",
  analogy: "A phone's behavior changes based on its state. When locked: pressing buttons shows the lock screen. When unlocked: buttons open apps. When in a call: buttons control volume. Same phone, same buttons — completely different behavior depending on its current state.",
  antiPattern: `// The naive approach: giant if-else chains checking state in every method
class Document {
  state: "draft" | "review" | "published" = "draft";

  publish() {
    if (this.state === "draft") {
      this.state = "review"; // draft -> review only
    } else if (this.state === "review") {
      this.state = "published"; // review -> published
    } else if (this.state === "published") {
      throw new Error("Already published!");
    }
    // Each new state adds more else-if to EVERY method
  }

  edit() {
    if (this.state === "draft") { /* allowed */ }
    else if (this.state === "review") { /* back to draft? */ }
    else if (this.state === "published") { throw new Error("Can't edit!"); }
  }
}

// N states x M methods = N*M conditionals scattered throughout the class
// Adding a new state means updating EVERY method`,
  problem: `A Document class has methods like publish(), edit(), review(). But what each method does depends on the document's state: Draft, Review, Published.

You end up with giant switch statements or nested if-else chains in every method: if (state === 'draft') {...} else if (state === 'review') {...}. Adding a new state means editing every method.

The logic for each state is scattered across all methods instead of being grouped together.`,
  solution: `State extracts each state's behavior into its own class. The original object (context) delegates state-specific work to the current state object.

Each state class implements the same interface (publish(), edit(), etc.) but behaves differently. When the state changes, the context swaps its state object — and behavior changes automatically.

All logic for a specific state lives in one place. Adding a new state means adding one class, not editing every existing method.`,
  glossary: [
    { term: "Context", definition: "The object whose behavior changes (e.g., Document). Holds a reference to the current state and delegates to it." },
    { term: "State Interface", definition: "Declares the methods that each state must implement. The context calls these methods." },
    { term: "Concrete State", definition: "A class implementing state-specific behavior (e.g., DraftState, PublishedState)." },
    { term: "State Transition", definition: "Changing from one state to another. Can be triggered by the context or by the state itself." },
    { term: "Finite State Machine", definition: "A model where an object can be in one of a fixed set of states, with defined transitions between them." },
  ],
  highlightLines: [5, 6, 7, 18, 19, 20, 21, 22, 23],
  diagramDescription: "Context delegates to current State → DraftState, ReviewState, PublishedState each implement different behavior for the same methods → state transitions swap the active state.",
  codeExample: `// State interface
interface OrderState {
  proceed(order: Order): void;
  cancel(order: Order): void;
  getStatus(): string;
}

// Context
class Order {
  private state: OrderState;
  public items: string[];
  public total: number;

  constructor(items: string[], total: number) {
    this.items = items;
    this.total = total;
    this.state = new PendingState();
  }

  setState(state: OrderState): void { this.state = state; }
  proceed(): void { this.state.proceed(this); }
  cancel(): void { this.state.cancel(this); }
  getStatus(): string { return this.state.getStatus(); }
}

// Concrete states
class PendingState implements OrderState {
  proceed(order: Order): void {
    console.log(\`Processing payment of $\${order.total}...\`);
    order.setState(new PaidState());
  }
  cancel(order: Order): void {
    console.log("Order cancelled before payment.");
    order.setState(new CancelledState());
  }
  getStatus(): string { return "⏳ Pending Payment"; }
}

class PaidState implements OrderState {
  proceed(order: Order): void {
    console.log(\`Shipping \${order.items.length} items...\`);
    order.setState(new ShippedState());
  }
  cancel(order: Order): void {
    console.log("Refunding payment...");
    order.setState(new CancelledState());
  }
  getStatus(): string { return "💳 Paid - Awaiting Shipment"; }
}

class ShippedState implements OrderState {
  proceed(order: Order): void {
    console.log("Order delivered!");
    order.setState(new DeliveredState());
  }
  cancel(_order: Order): void {
    console.log("Cannot cancel — already shipped. Please initiate a return.");
  }
  getStatus(): string { return "📦 Shipped"; }
}

class DeliveredState implements OrderState {
  proceed(_order: Order): void {
    console.log("Order already delivered. No further action.");
  }
  cancel(_order: Order): void {
    console.log("Cannot cancel — please initiate a return/refund.");
  }
  getStatus(): string { return "✅ Delivered"; }
}

class CancelledState implements OrderState {
  proceed(_order: Order): void {
    console.log("Cannot proceed — order is cancelled.");
  }
  cancel(_order: Order): void {
    console.log("Already cancelled.");
  }
  getStatus(): string { return "❌ Cancelled"; }
}

// Usage — same methods, different behavior per state
const order = new Order(["Laptop", "Mouse"], 1299);
console.log(order.getStatus()); // ⏳ Pending Payment

order.proceed(); // Processing payment...
console.log(order.getStatus()); // 💳 Paid

order.proceed(); // Shipping 2 items...
console.log(order.getStatus()); // 📦 Shipped

order.cancel(); // Cannot cancel — already shipped
order.proceed(); // Order delivered!
console.log(order.getStatus()); // ✅ Delivered`,
};
