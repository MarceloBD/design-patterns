import { PatternContent } from "@/types/pattern";

export const facadeContent: PatternContent = {
  slug: "facade",
  name: "Facade",
  category: "structural",
  difficulty: "beginner",
  order: 5,
  xpReward: 150,
  hook: "Provide a simplified interface to a complex subsystem",
  analogy: "A hotel concierge. Behind the scenes, there's housekeeping, room service, transportation, booking systems, and restaurant reservations. You don't call each department separately — you tell the concierge what you need, and they coordinate everything. The concierge is the Facade to the hotel's complex internal systems.",
  antiPattern: `// The naive approach: client code directly orchestrates every subsystem
async function uploadVideo(file: File) {
  // Client must know ALL subsystem APIs and their correct order
  const validator = new VideoValidator();
  if (!validator.checkFormat(file)) throw new Error("Invalid");
  if (!validator.checkSize(file, 500_000_000)) throw new Error("Too large");

  const compressor = new FFmpegCompressor();
  const compressed = await compressor.init({ codec: "h264", bitrate: "2M" });
  const result = await compressor.compress(file, compressed);

  const thumbGen = new ThumbnailGenerator();
  const thumb = await thumbGen.extract(result, { time: "00:00:05", size: "320x240" });

  const storage = new CloudStorage("us-east-1", "my-bucket");
  await storage.authenticate(process.env.AWS_KEY!);
  const url = await storage.upload(result, "videos/");
  const thumbUrl = await storage.upload(thumb, "thumbs/");

  const db = new DatabaseClient();
  await db.insert("videos", { url, thumbUrl, size: result.size });

  // 20+ lines of orchestration that every upload handler must repeat!
}`,
  problem: `Your app needs to process a video upload: validate the file, compress it, generate a thumbnail, upload to cloud storage, save metadata to the database, and send a notification.

Each step involves a different library with its own complex API. Client code that orchestrates all of this becomes a massive, tightly-coupled mess that's hard to understand and maintain.

If any library changes its API, you must update every place that uses it.`,
  solution: `Facade provides a simple, high-level interface that wraps the complex subsystem. It doesn't replace the subsystem — it just provides a convenient shortcut for common operations.

You create a VideoUploadFacade with one method: upload(file). Internally, it calls the validator, compressor, thumbnail generator, storage service, database, and notifier in the right order.

Client code goes from 50 lines of orchestration to one line: facade.upload(file). The subsystems still exist and can be used directly for advanced cases.`,
  glossary: [
    { term: "Facade", definition: "A class providing a simplified interface to a complex subsystem. Knows which subsystem classes to delegate to." },
    { term: "Subsystem", definition: "The collection of complex classes that the Facade wraps. They don't know about the Facade." },
    { term: "Simplified Interface", definition: "A small set of methods covering the most common use cases, hiding the full complexity." },
    { term: "Orchestration", definition: "Coordinating multiple operations across different services in the correct order." },
    { term: "Decoupling", definition: "Reducing dependencies between client code and subsystem internals by going through the Facade." },
  ],
  highlightLines: [30, 31, 32, 33, 34, 35, 36, 37, 38],
  diagramDescription: "Client → Facade (simple methods) → internally coordinates SubsystemA, SubsystemB, SubsystemC.",
  codeExample: `// Complex subsystem classes
class EmailValidator {
  validate(email: string): boolean {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  }
}

class PasswordHasher {
  hash(password: string): string {
    return \`hashed_\${password}_\${Date.now()}\`;
  }
}

class UserDatabase {
  private users: Map<string, { email: string; passwordHash: string }> = new Map();

  save(email: string, passwordHash: string): string {
    const id = \`user_\${Date.now()}\`;
    this.users.set(id, { email, passwordHash });
    return id;
  }

  findByEmail(email: string) {
    return [...this.users.entries()].find(([, u]) => u.email === email);
  }
}

class WelcomeEmailService {
  send(email: string, userId: string): void {
    console.log(\`📧 Welcome email sent to \${email} (user: \${userId})\`);
  }
}

class AnalyticsTracker {
  track(event: string, data: Record<string, string>): void {
    console.log(\`📊 Tracked: \${event}\`, data);
  }
}

// FACADE — one simple method hides all complexity
class UserRegistrationFacade {
  constructor(
    private validator: EmailValidator,
    private hasher: PasswordHasher,
    private database: UserDatabase,
    private emailService: WelcomeEmailService,
    private analytics: AnalyticsTracker
  ) {}

  register(email: string, password: string): { success: boolean; userId?: string; error?: string } {
    // Step 1: Validate
    if (!this.validator.validate(email)) {
      return { success: false, error: "Invalid email format" };
    }

    // Step 2: Check duplicates
    if (this.database.findByEmail(email)) {
      return { success: false, error: "Email already registered" };
    }

    // Step 3: Hash password
    const passwordHash = this.hasher.hash(password);

    // Step 4: Save user
    const userId = this.database.save(email, passwordHash);

    // Step 5: Send welcome email
    this.emailService.send(email, userId);

    // Step 6: Track event
    this.analytics.track("user_registered", { userId, email });

    return { success: true, userId };
  }
}

// Client code — simple one-liner instead of 30 lines
const facade = new UserRegistrationFacade(
  new EmailValidator(),
  new PasswordHasher(),
  new UserDatabase(),
  new WelcomeEmailService(),
  new AnalyticsTracker()
);

const result = facade.register("alice@example.com", "securePass123");
console.log(result); // { success: true, userId: "user_..." }`,
};
