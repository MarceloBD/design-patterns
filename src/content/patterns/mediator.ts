import { PatternContent } from "@/types/pattern";

export const mediatorContent: PatternContent = {
  slug: "mediator",
  name: "Mediator",
  category: "behavioral",
  difficulty: "intermediate",
  order: 4,
  xpReward: 150,
  lore: "The Nexus Control Tower once coordinated a hundred components — none speaking to each other directly, all communicating through the tower. When the tower fell silent, chaos erupted. Components screamed into the void, unheard. Rebuild the central coordinator.",
  hook: "Reduce chaotic dependencies by centralizing communication",
  analogy: "An air traffic control tower. Planes don't communicate directly with each other (that would be chaos with 50 planes). Instead, every plane talks only to the tower, and the tower coordinates all of them. The tower is the mediator — it knows about all planes and manages their interactions.",
  antiPattern: `// The naive approach: every component references every other component directly
class CountryDropdown {
  cityDropdown: CityDropdown;    // tight coupling
  shippingCalc: ShippingCalc;   // knows about unrelated component
  taxField: TaxField;           // even more coupling

  onChange(country: string) {
    this.cityDropdown.updateCities(country);
    this.shippingCalc.recalculate(country);
    this.taxField.updateRate(country);
    // If you add a new dependent component, modify THIS class
  }
}

// N components each knowing about N-1 others = N*(N-1) connections
// Adding/removing a component means modifying all connected components
// Untestable: can't test CountryDropdown without mocking 3 other classes`,
  problem: `You have a complex form with many elements that interact: selecting a country should update the city dropdown, changing a payment method should show/hide credit card fields, a checkbox should enable/disable multiple inputs.

If each component communicates directly with every other component it depends on, you get a web of tight coupling. Each component knows about 5+ others. Changing one element requires updating all its connections.`,
  solution: `Mediator introduces a central coordinator that all components communicate through. Instead of components talking to each other, they notify the mediator, and the mediator decides who else needs to know.

Components only know about the mediator — not about each other. The mediator encapsulates the complex interaction logic in one place.

Adding or changing interactions means editing only the mediator, not every component.`,
  glossary: [
    { term: "Mediator", definition: "The central interface declaring the communication method that components use to notify of events." },
    { term: "Concrete Mediator", definition: "Implements the coordination logic. Knows all components and defines how they interact." },
    { term: "Colleague/Component", definition: "Objects that interact through the mediator instead of directly. They hold a reference to the mediator." },
    { term: "Event-Driven", definition: "Components emit events to the mediator, which routes them to interested parties. A common implementation approach." },
    { term: "Single Responsibility", definition: "Without a mediator, interaction logic is scattered across components. The mediator centralizes it." },
    { term: "Mediator vs Facade", definition: "Mediator enables two-way communication between peers. Facade is one-directional: it simplifies access to a subsystem but subsystem components don't talk back through it." },
  ],
  highlightLines: [12, 13, 14, 15, 16, 17, 18, 19],
  diagramDescription: "Components → notify Mediator → Mediator coordinates response → updates other Components. No direct component-to-component links.",
  codeExample: `// Mediator interface
interface FormMediator {
  notify(sender: FormComponent, event: string, data?: unknown): void;
}

// Base component — knows only the mediator
abstract class FormComponent {
  constructor(protected mediator: FormMediator) {}
  abstract render(): string;
}

// Concrete components
class CountrySelect extends FormComponent {
  private value = "";

  setValue(country: string): void {
    this.value = country;
    this.mediator.notify(this, "country_changed", country);
  }

  getValue(): string { return this.value; }
  render(): string { return \`[Country: \${this.value || "none"}]\`; }
}

class CitySelect extends FormComponent {
  private cities: string[] = [];
  private value = "";

  setCities(cities: string[]): void { this.cities = cities; this.value = ""; }
  setValue(city: string): void { this.value = city; }
  getCities(): string[] { return this.cities; }
  getValue(): string { return this.value; }
  render(): string { return \`[City: \${this.value || "none"} | Options: \${this.cities.join(", ")}]\`; }
}

class ShippingLabel extends FormComponent {
  private text = "";

  updateLabel(text: string): void { this.text = text; }
  render(): string { return \`[Shipping: \${this.text || "N/A"}]\`; }
}

class SubmitButton extends FormComponent {
  private enabled = false;

  setEnabled(enabled: boolean): void { this.enabled = enabled; }
  isEnabled(): boolean { return this.enabled; }
  render(): string { return \`[Submit: \${this.enabled ? "ENABLED" : "DISABLED"}]\`; }
}

// Concrete mediator — all interaction logic in ONE place
class CheckoutFormMediator implements FormMediator {
  private cityMap: Record<string, string[]> = {
    US: ["New York", "Los Angeles", "Chicago"],
    UK: ["London", "Manchester", "Edinburgh"],
    BR: ["São Paulo", "Rio", "Brasília"],
  };

  constructor(
    private country: CountrySelect,
    private city: CitySelect,
    private shipping: ShippingLabel,
    private submit: SubmitButton
  ) {}

  notify(sender: FormComponent, event: string, data?: unknown): void {
    if (event === "country_changed") {
      const cities = this.cityMap[data as string] || [];
      this.city.setCities(cities);
      this.shipping.updateLabel("");
      this.submit.setEnabled(false);
    }

    if (event === "city_changed") {
      const country = this.country.getValue();
      const city = data as string;
      this.shipping.updateLabel(\`\${city}, \${country}\`);
      this.submit.setEnabled(!!country && !!city);
    }
  }
}

// Assembly — components don't know about each other
const mediator = {} as FormMediator; // placeholder for setup
const country = new CountrySelect(mediator);
const city = new CitySelect(mediator);
const shipping = new ShippingLabel(mediator);
const submit = new SubmitButton(mediator);

const form = new CheckoutFormMediator(country, city, shipping, submit);
// Reassign mediator reference (in real code, pass via constructor)
Object.assign(country, { mediator: form });
Object.assign(city, { mediator: form });

country.setValue("BR");
// city automatically gets: ["São Paulo", "Rio", "Brasília"]
// submit stays disabled until city is selected`,
};
