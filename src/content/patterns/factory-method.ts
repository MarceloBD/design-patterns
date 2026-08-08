import { PatternContent } from "@/types/pattern";

export const factoryMethodContent: PatternContent = {
  slug: "factory-method",
  name: "Factory Method",
  category: "creational",
  difficulty: "beginner",
  order: 1,
  xpReward: 150,
  hook: "Let subclasses decide which object to create",
  analogy: "Think of a restaurant franchise. The headquarters defines the process for making a meal (take order, cook, serve), but each location decides what specific dishes to offer. A Tokyo branch creates sushi, a Rome branch creates pasta — same process, different products.",
  antiPattern: `// The naive approach: hardcoded object creation everywhere
function planDelivery(type: string, cargo: string) {
  if (type === "road") {
    const truck = new Truck();
    truck.deliver(cargo);
  } else if (type === "sea") {
    const ship = new Ship();
    ship.deliver(cargo);
  } else if (type === "air") {
    const plane = new Plane(); // Keep adding else-if for every new type!
    plane.deliver(cargo);
  }
  // Every new transport = modify this function + every other place that creates transports
}

// This code violates Open/Closed Principle: you must MODIFY existing code to ADD new types.
// If 20 files do this, adding one transport type means changing 20 files.`,
  problem: `You're building a logistics app that initially only handles truck deliveries. Your code is tightly coupled to the Truck class everywhere.

Now the client wants to add ship deliveries, then air freight. Every time you add a transport type, you must change dozens of files that reference Truck directly.

The core issue: your code creates objects using "new ConcreteClass()" directly, making it impossible to switch implementations without editing every creation point.`,
  solution: `The Factory Method pattern replaces direct "new" calls with a call to a special method that subclasses can override.

You define an interface (Transport) that all products follow. Then you create a base class (Logistics) with an abstract "createTransport()" method. Each subclass (RoadLogistics, SeaLogistics) implements this method to return its specific product.

The rest of your code works with the Transport interface only — it never knows (or cares) which concrete class it's using. Adding a new transport type means creating one new subclass, without touching any existing code.`,
  glossary: [
    { term: "Creator", definition: "The base class that declares the factory method. It contains the business logic that uses the product." },
    { term: "Concrete Creator", definition: "A subclass that overrides the factory method to return a specific product type." },
    { term: "Product Interface", definition: "The common interface all created objects must implement, so the creator can use any product without knowing its concrete type." },
    { term: "Concrete Product", definition: "A specific implementation of the product interface (e.g., Truck, Ship)." },
    { term: "Coupling", definition: "When one class depends directly on another's concrete type, making changes expensive. Factory Method reduces coupling." },
  ],
  highlightLines: [27, 28, 40, 41, 44, 45],
  diagramDescription: "Creator declares createTransport() → ConcreteCreators (RoadLogistics, SeaLogistics) override it → each returns a different Product (Truck, Ship) that implements the Transport interface.",
  codeExample: `// Product interface — what all transports must do
interface Transport {
  deliver(cargo: string): string;
  getEstimate(distance: number): number;
}

// Concrete products
class Truck implements Transport {
  deliver(cargo: string): string {
    return \`🚛 Delivering "\${cargo}" by road\`;
  }
  getEstimate(distance: number): number {
    return distance * 1.5; // $1.5 per km
  }
}

class Ship implements Transport {
  deliver(cargo: string): string {
    return \`🚢 Delivering "\${cargo}" by sea\`;
  }
  getEstimate(distance: number): number {
    return distance * 0.8; // $0.8 per km (bulk)
  }
}

// Creator — defines the skeleton, delegates creation
abstract class Logistics {
  // THE factory method — subclasses decide what to create
  abstract createTransport(): Transport;

  // Business logic uses the product via interface
  planDelivery(cargo: string, distance: number): string {
    const transport = this.createTransport();
    const cost = transport.getEstimate(distance);
    const result = transport.deliver(cargo);
    return \`\${result} | Cost: $\${cost}\`;
  }
}

// Concrete creators
class RoadLogistics extends Logistics {
  createTransport(): Transport {
    return new Truck();
  }
}

class SeaLogistics extends Logistics {
  createTransport(): Transport {
    return new Ship();
  }
}

// Client code — works with any logistics type
function processOrder(logistics: Logistics) {
  console.log(logistics.planDelivery("Electronics", 500));
}

processOrder(new RoadLogistics());
// 🚛 Delivering "Electronics" by road | Cost: $750

processOrder(new SeaLogistics());
// 🚢 Delivering "Electronics" by sea | Cost: $400`,
};
