import { PatternContent } from "@/types/pattern";

export const strategyContent: PatternContent = {
  slug: "strategy",
  name: "Strategy",
  category: "behavioral",
  difficulty: "beginner",
  order: 8,
  xpReward: 150,
  hook: "Define a family of interchangeable algorithms",
  analogy: "Navigation apps (Google Maps, Waze). You pick a route strategy: fastest, shortest, avoid tolls, scenic route. The app uses the same input (origin + destination) but applies a different algorithm to find the path. You can switch strategies at any time without changing the app.",
  antiPattern: `// The naive approach: switch/if-else selecting algorithm inline
function calculateShipping(method: string, weight: number, distance: number) {
  if (method === "standard") {
    return weight * 0.5 + distance * 0.1;  // complex logic inline
  } else if (method === "express") {
    return weight * 1.0 + distance * 0.3 + 5.99;  // duplicated structure
  } else if (method === "overnight") {
    return weight * 2.0 + distance * 0.8 + 15.99; // hard to test individually
  } else if (method === "international") {
    const customs = weight > 10 ? 25 : 10;
    return weight * 3.0 + distance * 1.5 + customs; // growing complexity
  }
  // Every new shipping method = modify this function
  // Can't swap algorithms at runtime
  // Can't unit test ONE algorithm in isolation
  throw new Error("Unknown method");
}

// Violates Open/Closed: adding strategies means modifying existing code`,
  problem: `Your e-commerce app calculates shipping costs differently based on method: standard, express, overnight, international. Each has complex logic (weight-based, distance-based, flat rate).

If you put all this in one class with if-else chains, the class becomes massive. Adding a new shipping method means editing the existing code — risky and hard to test.

You also want to swap algorithms at runtime based on user selection.`,
  solution: `Strategy defines a family of algorithms, puts each in its own class, and makes them interchangeable.

You create a ShippingStrategy interface with a calculate() method. Each algorithm (StandardShipping, ExpressShipping) is a separate class implementing it.

The context class holds a strategy reference and delegates calculations to it. Swapping strategies at runtime is just changing this reference. Each strategy is independently testable.`,
  glossary: [
    { term: "Strategy Interface", definition: "Declares the algorithm method(s) that all concrete strategies must implement." },
    { term: "Concrete Strategy", definition: "A specific algorithm implementation (e.g., QuickSort, MergeSort, BubbleSort)." },
    { term: "Context", definition: "Uses a strategy via the interface. Doesn't know which concrete strategy it's using." },
    { term: "Runtime Swapping", definition: "Changing the active strategy while the program runs, based on conditions or user choice." },
    { term: "Open/Closed Principle", definition: "Code is open for extension (add new strategies) but closed for modification (existing code unchanged)." },
    { term: "Strategy in Functional Programming", definition: "In FP, passing a callback function as a parameter achieves the same effect as Strategy. The function IS the strategy — same concept, less ceremony." },
  ],
  highlightLines: [1, 2, 3, 10, 11, 12, 13, 14],
  diagramDescription: "Context holds a Strategy reference → calls strategy.execute() → ConcreteStrategyA/B/C each implement different algorithms → swap at runtime.",
  codeExample: `// Strategy interface
interface PricingStrategy {
  calculatePrice(basePrice: number, quantity: number): number;
  getName(): string;
}

// Concrete strategies
class RegularPricing implements PricingStrategy {
  calculatePrice(basePrice: number, quantity: number): number {
    return basePrice * quantity;
  }
  getName(): string { return "Regular"; }
}

class PremiumMemberPricing implements PricingStrategy {
  constructor(private discountPercent: number = 20) {}

  calculatePrice(basePrice: number, quantity: number): number {
    const discount = 1 - this.discountPercent / 100;
    return basePrice * quantity * discount;
  }
  getName(): string { return \`Premium (-\${this.discountPercent}%)\`; }
}

class BulkPricing implements PricingStrategy {
  calculatePrice(basePrice: number, quantity: number): number {
    if (quantity >= 100) return basePrice * quantity * 0.6;
    if (quantity >= 50) return basePrice * quantity * 0.7;
    if (quantity >= 10) return basePrice * quantity * 0.85;
    return basePrice * quantity;
  }
  getName(): string { return "Bulk Discount"; }
}

class SeasonalPricing implements PricingStrategy {
  constructor(private multiplier: number = 1.5) {}

  calculatePrice(basePrice: number, quantity: number): number {
    return basePrice * quantity * this.multiplier;
  }
  getName(): string { return \`Seasonal (x\${this.multiplier})\`; }
}

// Context — uses strategy without knowing which one
class ShoppingCart {
  private items: { name: string; price: number; quantity: number }[] = [];
  private strategy: PricingStrategy;

  constructor(strategy: PricingStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy;
  }

  addItem(name: string, price: number, quantity: number): void {
    this.items.push({ name, price, quantity });
  }

  calculateTotal(): number {
    return this.items.reduce(
      (total, item) => total + this.strategy.calculatePrice(item.price, item.quantity),
      0
    );
  }

  getReceipt(): string {
    const lines = this.items.map((item) => {
      const itemTotal = this.strategy.calculatePrice(item.price, item.quantity);
      return \`  \${item.name} x\${item.quantity} = $\${itemTotal.toFixed(2)}\`;
    });
    return [
      \`Strategy: \${this.strategy.getName()}\`,
      ...lines,
      \`  TOTAL: $\${this.calculateTotal().toFixed(2)}\`,
    ].join("\\n");
  }
}

// Usage — swap strategies at runtime
const cart = new ShoppingCart(new RegularPricing());
cart.addItem("Widget", 10, 5);
cart.addItem("Gadget", 25, 2);

console.log(cart.getReceipt());
// Strategy: Regular | TOTAL: $100.00

cart.setStrategy(new PremiumMemberPricing(20));
console.log(cart.getReceipt());
// Strategy: Premium (-20%) | TOTAL: $80.00

cart.setStrategy(new BulkPricing());
cart.addItem("Bolt", 1, 100);
console.log(cart.calculateTotal()); // Bolt gets 40% off for 100+ qty`,
};
