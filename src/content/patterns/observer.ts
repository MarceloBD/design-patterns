import { PatternContent } from "@/types/pattern";

export const observerContent: PatternContent = {
  slug: "observer",
  name: "Observer",
  category: "behavioral",
  difficulty: "beginner",
  order: 6,
  xpReward: 150,
  hook: "Notify multiple objects about changes in another object",
  analogy: "A YouTube subscription. When a channel (subject) publishes a new video, all subscribers (observers) get notified automatically. You don't check the channel manually every hour — the notification system handles it. Subscribers can join or leave anytime without affecting the channel or other subscribers.",
  antiPattern: `// The naive approach: the subject directly calls every dependent
class Store {
  restock(product: string) {
    this.inventory[product]++;

    // Directly coupled to every "subscriber"
    emailService.sendRestockEmail(product);   // what if email is down?
    smsService.sendRestockSMS(product);       // what if we remove SMS?
    analyticsService.trackRestock(product);   // tight coupling
    uiDashboard.updateStock(product);         // frontend coupled to backend!
    pushNotification.send(product);           // growing list...

    // Adding a new "subscriber" means MODIFYING this class
    // Removing one means MODIFYING this class
    // Store knows about ALL dependents - violates Open/Closed Principle
  }
}

// Polling alternative is equally bad:
// setInterval(() => checkStore(), 1000); // wasteful, laggy, scales terribly`,
  problem: `A Customer wants to know when a specific product is back in stock. They could check the store every day (polling) — wasteful. Or the store could email ALL customers about every restock — spammy.

In code: you have an object whose state changes (data source, event emitter), and multiple other objects need to react to those changes. Direct coupling between them creates rigid, hard-to-extend code.`,
  solution: `Observer defines a subscription mechanism: objects can subscribe to events from another object and get notified automatically when something interesting happens.

The Subject (publisher) maintains a list of subscribers and notifies them when its state changes. Observers implement an update() method that gets called with the new data.

Observers can be added or removed at runtime. The subject doesn't need to know what observers do with the data — only that they implement the observer interface.`,
  glossary: [
    { term: "Subject/Publisher", definition: "The object that has interesting state changes. Maintains a list of observers and notifies them." },
    { term: "Observer/Subscriber", definition: "Objects that want to be notified of changes. Implement an update() or notify() method." },
    { term: "Subscription", definition: "The act of registering an observer with a subject. Usually via subscribe()/unsubscribe() methods." },
    { term: "Event", definition: "The trigger for notification. Can be a state change, action, or any defined occurrence." },
    { term: "Push vs Pull", definition: "Push: subject sends data with notification. Pull: observer queries the subject after being notified." },
  ],
  highlightLines: [5, 6, 7, 8, 9, 15, 16, 17, 18],
  diagramDescription: "Subject maintains observer list → on state change, calls notify() → each Observer's update() is called with new data.",
  codeExample: `// Observer interface
interface EventListener<T> {
  update(event: string, data: T): void;
}

// Subject — manages subscriptions and notifications
class EventEmitter<T> {
  private listeners = new Map<string, Set<EventListener<T>>>();

  subscribe(event: string, listener: EventListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => { this.listeners.get(event)?.delete(listener); };
  }

  protected emit(event: string, data: T): void {
    this.listeners.get(event)?.forEach((listener) => listener.update(event, data));
  }
}

// Concrete subject — a store that notifies on changes
interface Product { id: string; name: string; price: number; inStock: boolean; }

class ProductStore extends EventEmitter<Product> {
  private products = new Map<string, Product>();

  addProduct(product: Product): void {
    this.products.set(product.id, product);
    this.emit("product_added", product);
  }

  restock(productId: string): void {
    const product = this.products.get(productId);
    if (product && !product.inStock) {
      product.inStock = true;
      this.emit("product_restocked", product);
    }
  }

  updatePrice(productId: string, newPrice: number): void {
    const product = this.products.get(productId);
    if (product) {
      product.price = newPrice;
      this.emit("price_changed", product);
    }
  }
}

// Concrete observers
class EmailNotifier implements EventListener<Product> {
  update(event: string, product: Product): void {
    if (event === "product_restocked") {
      console.log(\`📧 Email: "\${product.name}" is back in stock!\`);
    }
  }
}

class PriceTracker implements EventListener<Product> {
  private priceHistory: { name: string; price: number; date: Date }[] = [];

  update(event: string, product: Product): void {
    if (event === "price_changed") {
      this.priceHistory.push({ name: product.name, price: product.price, date: new Date() });
      console.log(\`📊 Price tracked: \${product.name} → $\${product.price}\`);
    }
  }

  getHistory() { return this.priceHistory; }
}

class InventoryLogger implements EventListener<Product> {
  update(event: string, product: Product): void {
    console.log(\`📝 [\${event}] \${product.name} (id: \${product.id})\`);
  }
}

// Usage — subscribe/unsubscribe dynamically
const store = new ProductStore();
const emailer = new EmailNotifier();
const tracker = new PriceTracker();
const logger = new InventoryLogger();

store.subscribe("product_restocked", emailer);
store.subscribe("price_changed", tracker);
const unsubLog = store.subscribe("product_added", logger);

store.addProduct({ id: "1", name: "Keyboard", price: 79, inStock: false });
// 📝 [product_added] Keyboard (id: 1)

store.restock("1");
// 📧 Email: "Keyboard" is back in stock!

store.updatePrice("1", 59);
// 📊 Price tracked: Keyboard → $59

unsubLog(); // Logger stops receiving events`,
};
