import { PatternContent } from "@/types/pattern";

export const adapterContent: PatternContent = {
  slug: "adapter",
  name: "Adapter",
  category: "structural",
  difficulty: "beginner",
  order: 1,
  xpReward: 150,
  lore: "The first bridge into the Crystal Citadel has collapsed. On one side: your realm's interface. On the other: the Citadel's ancient protocols, completely incompatible. You must craft a translator — an adapter that speaks both languages without changing either side.",
  hook: "Make incompatible interfaces work together",
  analogy: "A power plug adapter when traveling. Your laptop has a US plug, but the outlet in Europe is different. The adapter sits between them — it doesn't change your laptop or the wall socket, it just translates one shape into another so they can work together.",
  antiPattern: `// The naive approach: modifying client code everywhere to handle multiple formats
function processAnalytics(data: unknown) {
  if (isXmlFormat(data)) {
    const parsed = parseXml(data);
    renderChart(parsed.metrics);
  } else if (isJsonFormat(data)) {
    const parsed = JSON.parse(data);
    renderChart(convertJsonToOurFormat(parsed));  // manual conversion each time
  } else if (isCsvFormat(data)) {
    const parsed = parseCsv(data);
    renderChart(convertCsvToOurFormat(parsed));   // yet another conversion
  }
  // Every new data source = another else-if + another conversion function
  // Every place that uses analytics must repeat this pattern
}

// Duplicated conversion logic scattered across the codebase`,
  problem: `You're integrating a third-party analytics library into your app. Your code expects data in XML format, but the library only outputs JSON.

You can't modify the library (it's external). You can't rewrite your entire codebase to accept JSON. You're stuck with two incompatible interfaces that need to collaborate.

This happens constantly: legacy systems, third-party APIs, libraries with different conventions.`,
  solution: `The Adapter wraps one interface and translates its calls into the format the other side expects.

You create an adapter class that implements the interface your code expects (XMLAnalytics), but internally delegates to the incompatible class (JSONAnalyticsLib). The adapter converts data between the two formats.

Your existing code stays unchanged. The third-party library stays unchanged. Only the thin adapter layer knows about both.`,
  glossary: [
    { term: "Target Interface", definition: "The interface your existing code already works with. The adapter must implement this." },
    { term: "Adaptee", definition: "The incompatible class (often third-party) that needs to be adapted to the target interface." },
    { term: "Adapter", definition: "The wrapper class that implements the target interface and translates calls to the adaptee." },
    { term: "Object Adapter", definition: "Wraps the adaptee via composition (holds a reference to it). Most common approach." },
    { term: "Class Adapter", definition: "Inherits from both the target and adaptee (uses multiple inheritance). Not common in TypeScript." },
  ],
  highlightLines: [24, 25, 26, 27, 28, 29, 30, 31],
  diagramDescription: "Client uses Target interface → Adapter implements Target → Adapter holds reference to Adaptee → translates calls between the two.",
  codeExample: `// What your app expects (Target interface)
interface PaymentProcessor {
  charge(amount: number, currency: string): Promise<{ success: boolean; transactionId: string }>;
  refund(transactionId: string): Promise<boolean>;
}

// Third-party library with incompatible interface (Adaptee)
class StripeAPI {
  createCharge(amountInCents: number, cur: string, idempotencyKey: string) {
    return { id: \`ch_\${Date.now()}\`, status: "succeeded", amount: amountInCents };
  }
  createRefund(chargeId: string) {
    return { id: \`re_\${Date.now()}\`, status: "succeeded" };
  }
}

// Adapter — bridges your interface with Stripe's interface
class StripeAdapter implements PaymentProcessor {
  constructor(private readonly stripe: StripeAPI) {}

  async charge(amount: number, currency: string) {
    const amountInCents = Math.round(amount * 100);
    const key = \`key_\${Date.now()}\`;
    const result = this.stripe.createCharge(amountInCents, currency, key);

    return {
      success: result.status === "succeeded",
      transactionId: result.id,
    };
  }

  async refund(transactionId: string) {
    const result = this.stripe.createRefund(transactionId);
    return result.status === "succeeded";
  }
}

// Your app code — works with ANY PaymentProcessor
async function processOrder(processor: PaymentProcessor, total: number) {
  const result = await processor.charge(total, "USD");
  if (result.success) {
    console.log(\`Payment \${result.transactionId} successful\`);
  }
  return result;
}

// Inject the adapter — app code never knows about Stripe specifics
const stripe = new StripeAPI();
const processor = new StripeAdapter(stripe);
processOrder(processor, 49.99);`,
};
