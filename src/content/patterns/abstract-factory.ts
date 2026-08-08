import { PatternContent } from "@/types/pattern";

export const abstractFactoryContent: PatternContent = {
  slug: "abstract-factory",
  name: "Abstract Factory",
  category: "creational",
  difficulty: "intermediate",
  order: 2,
  xpReward: 150,
  hook: "Create families of related objects without specifying their concrete classes",
  analogy: "Imagine an IKEA store with different style collections — Modern, Victorian, Minimalist. When you pick a collection, you get a matching chair, table, and sofa that all belong together. You don't mix Victorian chairs with Modern tables. The Abstract Factory is the showroom catalog that gives you a complete, consistent family of furniture.",
  antiPattern: `// The naive approach: creating components without consistency guarantees
function createUI(theme: string) {
  let button, input;
  if (theme === "dark") {
    button = new DarkButton();
    input = new DarkInput();
  } else {
    button = new LightButton();
    input = new LightInput();
  }
  // Nothing prevents mixing: someone can do new DarkButton() + new LightInput()
  // Adding a new theme means modifying every if-else block in the codebase
  return { button, input };
}

// Scattered creation logic means inconsistent families and explosion of if-else chains`,
  problem: `Your app needs to create UI components (buttons, inputs, modals) that must be visually consistent — all following the same theme.

If you use individual factories or direct constructors, nothing prevents accidentally mixing a "Dark theme" button with a "Light theme" input. The app looks broken, and fixing it means hunting down every component creation site.

You also need to support adding new themes (e.g., "High Contrast") without modifying every file that creates components.`,
  solution: `Abstract Factory provides an interface for creating families of related objects. Each concrete factory produces a complete set of products that work together.

You declare a factory interface (UIFactory) with methods like createButton(), createInput(), createModal(). Each theme gets its own factory class (DarkUIFactory, LightUIFactory) that returns theme-consistent components.

Client code receives a factory and creates all components through it — guaranteeing they all belong to the same family. Adding a new theme means adding one new factory class.`,
  glossary: [
    { term: "Abstract Factory", definition: "An interface that declares creation methods for each product in a family (createButton, createInput, etc.)." },
    { term: "Concrete Factory", definition: "A class implementing the abstract factory. Each one produces products from a single family/variant." },
    { term: "Product Family", definition: "A set of related products meant to work together (e.g., DarkButton + DarkInput + DarkModal)." },
    { term: "Abstract Product", definition: "The interface each product type must follow (e.g., Button interface), regardless of variant." },
    { term: "Variant", definition: "A specific style or version of the product family (e.g., Dark, Light, High-Contrast)." },
  ],
  highlightLines: [34, 35, 36, 40, 41, 42, 46, 47, 48],
  diagramDescription: "UIFactory interface → DarkUIFactory and LightUIFactory implement it → each returns matching Button, Input, and Modal that share the same visual style.",
  codeExample: `// Abstract products
interface Button {
  render(): string;
  onClick(handler: () => void): void;
}

interface Input {
  render(): string;
  getValue(): string;
}

// Dark theme products
class DarkButton implements Button {
  render() { return '<button class="bg-gray-800 text-white">'; }
  onClick(handler: () => void) { handler(); }
}

class DarkInput implements Input {
  render() { return '<input class="bg-gray-900 text-white border-gray-700">'; }
  getValue() { return "dark-value"; }
}

// Light theme products
class LightButton implements Button {
  render() { return '<button class="bg-white text-gray-900 border">'; }
  onClick(handler: () => void) { handler(); }
}

class LightInput implements Input {
  render() { return '<input class="bg-gray-50 text-gray-900 border-gray-300">'; }
  getValue() { return "light-value"; }
}

// Abstract Factory
interface UIFactory {
  createButton(): Button;
  createInput(): Input;
}

// Concrete factories — each guarantees consistent products
class DarkUIFactory implements UIFactory {
  createButton(): Button { return new DarkButton(); }
  createInput(): Input { return new DarkInput(); }
}

class LightUIFactory implements UIFactory {
  createButton(): Button { return new LightButton(); }
  createInput(): Input { return new LightInput(); }
}

// Client code — uses factory, never knows concrete types
function renderForm(factory: UIFactory) {
  const button = factory.createButton();
  const input = factory.createInput();
  console.log(input.render());
  console.log(button.render());
}

// Usage — just swap the factory for a different theme
renderForm(new DarkUIFactory());
renderForm(new LightUIFactory());`,
};
