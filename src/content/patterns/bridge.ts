import { PatternContent } from "@/types/pattern";

export const bridgeContent: PatternContent = {
  slug: "bridge",
  name: "Bridge",
  category: "structural",
  difficulty: "advanced",
  order: 2,
  xpReward: 150,
  lore: "The Citadel's Twin Towers grow in two dimensions — shape and renderer, abstraction and implementation. Builders once tried to create one tower per combination: CircleOpenGL, CircleVulkan, SquareOpenGL... The towers multiplied until they blocked the sun. Learn to separate what varies independently.",
  hook: "Split a large class into two separate hierarchies that can evolve independently",
  analogy: "A TV remote control and the TV itself. The remote (abstraction) has buttons like volume up, channel change. The TV (implementation) actually does the work. You can use the same remote concept for Samsung, LG, or Sony TVs. And you can have basic or advanced remotes for any TV brand. Two dimensions that evolve independently.",
  antiPattern: `// The naive approach: class explosion from combining dimensions via inheritance
class RedCircle extends Shape { /* color + shape logic mixed */ }
class BlueCircle extends Shape { /* duplicated shape logic */ }
class RedSquare extends Shape { /* duplicated color logic */ }
class BlueSquare extends Shape { /* everything duplicated */ }
class GreenCircle extends Shape { /* adding a color = N new classes */ }
class GreenSquare extends Shape { /* shapes x colors = exponential growth */ }
class RedTriangle extends Shape { /* adding a shape = N new classes */ }
// ... 3 shapes x 3 colors = 9 classes already!
// 10 shapes x 10 colors = 100 classes!

// Each class duplicates logic and changes in one dimension
// (like updating how "red" renders) must be applied to N classes`,
  problem: `You have a Shape class with subclasses Circle and Square. Now you need to add colors: RedCircle, BlueCircle, RedSquare, BlueSquare. Four classes.

Add a new shape (Triangle)? Three more classes. Add a new color (Green)? Three more classes. This is called a "class explosion" — the number of classes grows as the product of all dimensions (shapes × colors).

The issue: you're trying to extend a class in two independent directions (shape AND color) using inheritance alone.`,
  solution: `Bridge separates the two dimensions into independent class hierarchies connected by composition.

One hierarchy handles the abstraction (Shape with draw/resize methods). The other handles the implementation (Color/Renderer with renderCircle/renderSquare methods).

The Shape holds a reference to a Renderer and delegates the platform-specific work. Now shapes and renderers can vary independently. Adding a new shape: one class. Adding a new renderer: one class. No explosion.`,
  glossary: [
    { term: "Abstraction", definition: "The high-level control layer (e.g., Shape). Delegates work to the implementation. This is what clients interact with." },
    { term: "Implementation", definition: "The low-level platform layer (e.g., Renderer). Contains the actual platform-specific logic." },
    { term: "Refined Abstraction", definition: "A subclass of the abstraction that adds specific behavior (e.g., Circle extends Shape)." },
    { term: "Concrete Implementation", definition: "A specific implementation variant (e.g., SVGRenderer, CanvasRenderer)." },
    { term: "Composition over Inheritance", definition: "Using object references (has-a) instead of class hierarchies (is-a) to combine behaviors." },
    { term: "Bridge vs Adapter", definition: "Both involve wrapping, but Adapter fixes incompatibility between existing interfaces. Bridge is designed up front to prevent future coupling between two independent dimensions." },
  ],
  highlightLines: [15, 16, 17, 18, 19, 20, 30, 31, 32, 33],
  diagramDescription: "Shape (abstraction) holds a reference to Renderer (implementation) → Circle/Square extend Shape → SVGRenderer/CanvasRenderer implement Renderer → mix and match freely.",
  codeExample: `// Implementation interface — the "how"
interface NotificationSender {
  send(recipient: string, title: string, body: string): void;
}

// Concrete implementations
class EmailSender implements NotificationSender {
  send(recipient: string, title: string, body: string) {
    console.log(\`📧 Email to \${recipient}: [\${title}] \${body}\`);
  }
}

class SmsSender implements NotificationSender {
  send(recipient: string, title: string, body: string) {
    console.log(\`📱 SMS to \${recipient}: \${title} - \${body}\`);
  }
}

class PushSender implements NotificationSender {
  send(recipient: string, title: string, body: string) {
    console.log(\`🔔 Push to \${recipient}: \${title}\`);
  }
}

// Abstraction — the "what"
abstract class Notification {
  constructor(protected sender: NotificationSender) {}
  abstract notify(recipient: string): void;
}

// Refined abstractions — different notification types
class AlertNotification extends Notification {
  constructor(sender: NotificationSender, private message: string) {
    super(sender);
  }

  notify(recipient: string) {
    this.sender.send(recipient, "🚨 ALERT", this.message);
  }
}

class ReminderNotification extends Notification {
  constructor(sender: NotificationSender, private task: string, private deadline: string) {
    super(sender);
  }

  notify(recipient: string) {
    this.sender.send(recipient, "⏰ Reminder", \`"\${this.task}" is due \${this.deadline}\`);
  }
}

// Mix and match: any notification type × any delivery channel
const emailAlert = new AlertNotification(new EmailSender(), "Server is down!");
emailAlert.notify("admin@company.com");
// 📧 Email to admin@company.com: [🚨 ALERT] Server is down!

const smsReminder = new ReminderNotification(new SmsSender(), "Deploy v2", "tomorrow");
smsReminder.notify("+1234567890");
// 📱 SMS to +1234567890: ⏰ Reminder - "Deploy v2" is due tomorrow

const pushAlert = new AlertNotification(new PushSender(), "New login detected");
pushAlert.notify("user-device-token");
// 🔔 Push to user-device-token: 🚨 ALERT`,
};
