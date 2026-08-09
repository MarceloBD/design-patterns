import { PatternCategory } from "@/types/pattern";

export interface WorldLore {
  name: string;
  tagline: string;
  origin: string;
  fall: string;
  currentState: string;
}

export interface HeroLore {
  title: string;
  origin: string;
  motivation: string;
  destiny: string;
}

export interface RealmLore {
  name: string;
  subtitle: string;
  description: string;
  environment: string;
  enemies: string;
  bossName: string;
  bossTitle: string;
  bossPersonality: string;
  bossOrigin: string;
}

export interface ItemLore {
  origin: string;
}

export interface PatternLorePrologue {
  prologue: string;
}

export interface EndingLore {
  epilogue: string;
  finalWords: string;
}

export const WORLD_LORE: WorldLore = {
  name: "Architectura",
  tagline: "Where code becomes reality, and patterns are the forgotten magic.",
  origin:
    "In the age before memory, the Pattern God shaped Architectura from the Void. " +
    "Every object was a living being, every interface a sacred contract. " +
    "Twenty-two Patterns — primordial forces — held everything in harmony. " +
    "Cities rose in perfect modularity. Systems spoke to each other through clean abstractions. " +
    "It was an age of elegance.",
  fall:
    "But the Pattern God grew proud. He believed Architectura needed no steward — that the Patterns " +
    "would maintain themselves forever. He retreated beyond the veil, and without his guidance, " +
    "the knowledge of Patterns was lost. Generation by generation, developers forgot the old ways. " +
    "They built without structure, without foresight. And from the tangled, formless code, " +
    "the Spaghetti emerged — chaotic entities that devour architecture and breed coupling.",
  currentState:
    "Now Architectura is shattered into three dying realms. The Forge of Origins burns without purpose. " +
    "The Crystal Citadel fractures under its own weight. The Storm Nexus rages uncontrolled. " +
    "The grimoire — the last record of all 22 Patterns — has awakened and chosen a new bearer. You.",
};

export const HERO_LORE: HeroLore = {
  title: "Bearer of the Grimoire",
  origin:
    "You were once an ordinary developer in a small village at the crossroads of the three realms. " +
    "Your code was simple, your scope was narrow. Then one night, the Spaghetti came — " +
    "a tide of tangled dependencies and god objects that consumed everything.",
  motivation:
    "Your village — its clean functions, its well-named variables, its separated concerns — " +
    "was devoured in hours. You alone escaped, clutching a book that fell from the sky during the chaos: " +
    "the Grimoire of Patterns. Its pages are blank until you earn their secrets. " +
    "Each Pattern mastered inscribes itself in golden ink. Each realm conquered restores a piece of Architectura.",
  destiny:
    "The grimoire whispers of a final truth: the Pattern God still lives beyond the sealed veil. " +
    "Only one who masters all 22 Patterns across all three realms can break the seal, " +
    "face the God who abandoned his creation, and decide Architectura's fate.",
};

export const REALM_LORE: Record<PatternCategory, RealmLore> = {
  creational: {
    name: "The Forge of Origins",
    subtitle: "Where raw matter becomes form",
    description:
      "Beneath volcanic peaks and rivers of molten logic, the Forge once shaped every object in Architectura. " +
      "Master smiths could summon instances from pure intent — factories that never faltered, " +
      "builders that constructed palaces in a single breath, prototypes that replicated perfection.",
    environment:
      "The air burns with ember storms. Volcanic peaks pierce an orange sky. " +
      "Molten streams of unfinished objects flow through obsidian channels. " +
      "Abandoned forges still glow with residual creation energy, waiting for someone who remembers how to wield them.",
    enemies:
      "Unformed Constructs haunt this realm — objects instantiated without purpose, " +
      "twisted by direct 'new' calls without interfaces. They shamble mindlessly, " +
      "tightly coupled to everything they touch, spreading rigidity wherever they go.",
    bossName: "The Architect of Genesis",
    bossTitle: "First Smith of Creation",
    bossPersonality:
      "Once the Pattern God's most devoted servant, tasked with teaching creation to mortals. " +
      "When the God vanished, the Architect went mad with abandonment. " +
      "Now he hoards creation knowledge, refusing to share it, and spawns malformed objects to fill the void.",
    bossOrigin:
      "Forged from the Pattern God's own creative spark, the Architect was the first being " +
      "to understand how objects should come into existence. His betrayal was not malice — it was grief. " +
      "He believed if he kept creating alone, perhaps the God would return to see his work.",
  },
  structural: {
    name: "The Crystal Citadel",
    subtitle: "Where bonds hold worlds together",
    description:
      "Towers of crystallized logic pierce a frozen sky. Every wall is an interface, " +
      "every bridge a composition of smaller elements. The Citadel was once proof that " +
      "complex systems could be built from simple, well-connected parts — flexible, extensible, eternal.",
    environment:
      "Perpetual snowfall blankets fractured spires. Crystal formations grow from pure abstraction — " +
      "some still whole, others cracked by the weight of broken dependencies. " +
      "The wind carries the sound of shattering glass: another structure failing without proper bonds.",
    enemies:
      "Fractured Composites roam the frozen halls — structures built without adapters, " +
      "without proper interfaces. They collapse under the slightest change in requirements. " +
      "Some are massive god-objects trying to do everything; others are orphaned fragments that serve no purpose.",
    bossName: "The Weaver of Bonds",
    bossTitle: "Keeper of the Crystal Threads",
    bossPersonality:
      "A perfectionist driven to insanity by the crumbling of her perfect structures. " +
      "She weaves bonds compulsively, connecting everything to everything — creating exactly " +
      "the tight coupling she once despised. She cannot stop. She cannot let go.",
    bossOrigin:
      "The Weaver was the Pattern God's architect of relationships — the one who understood " +
      "how objects should relate without becoming dependent. When the world started breaking, " +
      "she tried to hold it together alone, weaving more and more connections until she became the problem she fought.",
  },
  behavioral: {
    name: "The Storm Nexus",
    subtitle: "Where algorithms find their purpose",
    description:
      "Thunder never rests here. Ancient towers channel lightning between objects — " +
      "messages pass like bolts from observer to subscriber, commands queue in rolling thunder. " +
      "This was where all communication in Architectura was coordinated, where behavior had meaning.",
    environment:
      "Purple lightning arcs between obsidian towers. Arcane rain carries encoded messages " +
      "that no one can read anymore. The remnants of once-elegant event systems spark chaotically, " +
      "broadcasting to listeners that no longer exist, iterating over collections that have been corrupted.",
    enemies:
      "Rogue Algorithms wander the tempest — behaviors without context, strategies without a chooser, " +
      "commands that execute endlessly with no one to invoke undo. " +
      "They are the fragments of what was once elegant orchestration, now mindless and destructive.",
    bossName: "The Conductor of Storms",
    bossTitle: "Lord of Broken Protocols",
    bossPersonality:
      "Once the maestro who orchestrated all communication in Architectura. " +
      "Now he broadcasts fury indiscriminately — every message a scream, every event a lightning strike. " +
      "He remembers the symphony that was, and his rage at its loss fuels an eternal tempest.",
    bossOrigin:
      "The Conductor channeled the Pattern God's will across the realm — every observer pattern, " +
      "every mediator, every chain of responsibility flowed through his tower. " +
      "When the God fell silent, the Conductor's tower amplified that silence into a roar. " +
      "He now drowns the world in noise to avoid confronting the quiet.",
  },
};

export const SECRET_BOSS_LORE_EXTENDED = {
  name: "The Pattern God",
  trueTitle: "Eternox, Architect of All Realms",
  tragedy:
    "Eternox did not leave Architectura by choice alone. In his pride, he attempted to create " +
    "a twenty-third Pattern — one that would make all others obsolete. A single Pattern to rule all code. " +
    "The attempt shattered reality itself. The three realms split apart. Eternox, wounded by his own hubris, " +
    "was sealed beyond the veil by the very Patterns he created — imprisoned by his own children.",
  personality:
    "He is not evil. He is broken. Thousands of years of isolation have twisted his grief into something " +
    "resembling malice. He tests you not from cruelty, but from desperate hope — " +
    "hoping that someone finally understands what he once knew, and can succeed where he failed.",
  finalTruth:
    "The twenty-third Pattern he sought was never meant to exist. The beauty of the 22 Patterns " +
    "is that each has a role, each has limitations. No single solution can solve all problems. " +
    "This is the lesson Eternox could not accept — and the truth you must embody to defeat him.",
};

export const ITEM_LORE: Record<string, ItemLore> = {
  "iron-frame": {
    origin: "Forged in the deepest caldera of the Forge. The last honest work of the Architect before his madness took hold.",
  },
  "mage-cloak": {
    origin: "Woven from crystallized Storm Nexus lightning by the Conductor himself, before grief consumed him.",
  },
  "dragon-plate": {
    origin: "Scales shed by the Forge Dragon — a proto-beast born from the first Factory Method ever invoked.",
  },
  "crystal-ward": {
    origin: "Fragments of the Crystal Citadel's core pillar — the one structure that has never cracked.",
  },
  "hint-potion": {
    origin: "Distilled from the tears of the Weaver. Each drop contains a fraction of her pattern-sight.",
  },
  "clarity-elixir": {
    origin: "Brewed from Storm Nexus rain when lightning strikes thrice in the same place — exceedingly rare.",
  },
  "focus-brew": {
    origin: "A recipe found in the Grimoire's margins. Written in the Pattern God's own hand, nearly illegible.",
  },
  "time-stop": {
    origin: "A shard of frozen time from before the Shattering. Even the Conductor cannot control its power.",
  },
  "scroll-aurora": {
    origin: "A page torn from a higher Grimoire — one that belongs to a realm beyond Architectura.",
  },
  "scroll-fireflies": {
    origin: "Released from the Forge's cooling vents when the volcanic pressure drops. They carry creation sparks.",
  },
  "scroll-sakura": {
    origin: "From the single tree that grows at the intersection of all three realms — the Nexus Blossom.",
  },
  "scroll-matrix": {
    origin: "A debugging tool from the age before the Shattering. It reveals the underlying code of reality.",
  },
};

export const PATTERN_LORE: Record<string, PatternLorePrologue> = {
  "factory-method": {
    prologue:
      "The first forge in the Realm of Origins has gone cold. Its last smith tried to create every object by hand — " +
      "hammering each one individually, never trusting apprentices with the work. When he fell, " +
      "everything stopped. Your task: relight the forge and teach it to delegate creation to those who know best.",
  },
  "abstract-factory": {
    prologue:
      "Beyond the first forge lies the Hall of Families — a grand chamber where matching sets of objects were once born together. " +
      "Dark buttons with dark inputs. Light themes with light icons. Now the hall produces mismatched abominations. " +
      "Restore the ancient contracts that ensure families stay consistent.",
  },
  "builder": {
    prologue:
      "The Master Mason's Workshop stands in the deepest caldera. Here, complex objects were assembled piece by piece — " +
      "no telescoping incantations, no 12-parameter summonings. The mason is gone, " +
      "but his blueprints remain on the walls. Learn his step-by-step discipline.",
  },
  "prototype": {
    prologue:
      "In the Cloning Caves, perfect duplicates once emerged from shimmering pools. " +
      "Objects copied themselves — their private thoughts, their hidden strengths — without outside hands touching them. " +
      "The pools have gone murky. Only shallow copies emerge. Restore the deep-clone ritual.",
  },
  "singleton": {
    prologue:
      "At the heart of the volcano sits the Eternal Flame — a resource that must exist exactly once. " +
      "Multiple flames once threatened to melt the realm. A seal was placed: one instance, one access point. " +
      "But the seal has drawbacks. Learn its power AND its cost.",
  },
  "adapter": {
    prologue:
      "The first bridge into the Crystal Citadel has collapsed. On one side: your realm's interface. " +
      "On the other: the Citadel's ancient protocols, completely incompatible. " +
      "You must craft a translator — an adapter that speaks both languages without changing either side.",
  },
  "bridge": {
    prologue:
      "The Citadel's Twin Towers grow in two dimensions — shape and renderer, abstraction and implementation. " +
      "Builders once tried to create one tower per combination: CircleOpenGL, CircleVulkan, SquareOpenGL... " +
      "The towers multiplied until they blocked the sun. Learn to separate what varies independently.",
  },
  "composite": {
    prologue:
      "The Crystal Forest stretches endlessly — trees made of smaller trees, branches holding branches. " +
      "Files within folders within folders. The Citadel's file system has collapsed because no one remembers " +
      "how to treat a single leaf the same as an entire branch. Restore the recursive harmony.",
  },
  "decorator": {
    prologue:
      "The Wrapping Chamber lies behind the Citadel's seventh gate. Here, objects once gained new powers " +
      "without surgery — layers of enchantment stacked at will, removed when no longer needed. " +
      "Inheritance tried to replace this art, but it was too rigid. Rediscover the flexible path.",
  },
  "facade": {
    prologue:
      "The Citadel's Grand Library contains a thousand subsystems. Scholars once spent years learning each one. " +
      "Then the Librarian created a single desk — one simple interface that handled all requests. " +
      "The desk is unmanned now. You must understand what it hid to rebuild it.",
  },
  "flyweight": {
    prologue:
      "The Crystal Plains hold ten thousand identical soldiers — but each one unique in position and mission. " +
      "Memory once nearly consumed the Citadel trying to store them all separately. " +
      "An ancient optimization shares what is common, keeps only what is unique. Find it.",
  },
  "proxy": {
    prologue:
      "The Citadel's treasury is guarded by a Stand-In — an entity with the same face as the treasure within. " +
      "It decides who may pass, when to fetch the real treasure, and whether to serve a cached copy. " +
      "Learn the art of controlling access without becoming the thing you protect.",
  },
  "chain-of-responsibility": {
    prologue:
      "The Storm Nexus messenger towers once passed requests from handler to handler. " +
      "Auth checked first. Then rate-limiting. Then formatting. Each tower could stop the message or pass it on. " +
      "Now messages pile up at the first broken tower. Rebuild the chain.",
  },
  "command": {
    prologue:
      "In the Nexus armory, every action was once a scroll — a command object that could be stored, " +
      "sent across the realm, undone if regretted, or replayed for training. " +
      "The armory is sealed. Its scrolls hold the power of undo itself.",
  },
  "iterator": {
    prologue:
      "The Great Archive stores knowledge in trees, graphs, linked chains, and crystalline arrays. " +
      "Each requires different traversal magic. The old Iterator enchantment let scholars walk any collection " +
      "with the same stride. That enchantment faded. Recast it.",
  },
  "mediator": {
    prologue:
      "The Nexus Control Tower once coordinated a hundred components — none speaking to each other directly, " +
      "all communicating through the tower. When the tower fell silent, chaos erupted. " +
      "Components screamed into the void, unheard. Rebuild the central coordinator.",
  },
  "memento": {
    prologue:
      "Deep beneath the Storm Nexus lies the Chamber of Echoes — where every state was once preserved. " +
      "Undo a mistake. Restore a fallen comrade. Travel back to a checkpoint before the damage. " +
      "The art of saving without breaking privacy awaits.",
  },
  "observer": {
    prologue:
      "The Watchtowers of the Nexus once broadcast events across the land. " +
      "When a king spoke, every subscribed tower relayed the message simultaneously. " +
      "Now the towers broadcast to ghosts — subscribers that unregistered but were never removed. " +
      "Learn the discipline of publish and subscribe.",
  },
  "state": {
    prologue:
      "The Shifting Halls change their very nature depending on who enters. " +
      "A door that opens when you approach, locks when you leave, and vanishes when the day ends. " +
      "Each state is its own entity with its own rules. No if-else chains here — just transformation.",
  },
  "strategy": {
    prologue:
      "The Nexus War Room keeps a shelf of sealed scrolls — each containing a different battle plan. " +
      "Quick sort for speed. Merge sort for stability. Bubble sort for... well, learning. " +
      "The commander chooses a scroll at will, swapping strategies without rewriting the war itself.",
  },
  "template-method": {
    prologue:
      "The Training Grounds follow an ancient regiment: warm up, drill, cool down. Every recruit follows this order. " +
      "But each regiment fills in the steps differently — archers drill aim, mages drill incantations. " +
      "The skeleton is sacred. The steps are personal.",
  },
  "visitor": {
    prologue:
      "The Census Takers visit every citizen in the realm — counting, taxing, healing — " +
      "without the citizens ever changing their nature. A new operation simply means a new visitor. " +
      "The citizens say 'accept' and the visitor does the rest. Ancient double-dispatch magic.",
  },
};

export const ENDING_LORE: EndingLore = {
  epilogue:
    "The Pattern God — Eternox — falls to his knees. Not in defeat, but in relief. " +
    "For the first time in millennia, someone has understood what he could not: " +
    "that no single pattern rules all, that each has its place, that complexity is tamed not by one answer " +
    "but by twenty-two working in concert.\n\n" +
    "The veil dissolves. The three realms shudder — and begin to drift back together. " +
    "The Forge of Origins ignites with renewed purpose. The Crystal Citadel's fractures seal with golden light. " +
    "The Storm Nexus calms to a steady, purposeful hum.\n\n" +
    "Eternox offers you his crown — not of gold, but of pure abstraction. " +
    "You are no longer just a developer. You are the new Pattern God. " +
    "The Grimoire in your hands blazes with complete inscription: all 22 Patterns, living and breathing.\n\n" +
    "Architectura is whole once more. The Spaghetti retreats to the edges of the realm. " +
    "And in villages across the land, young developers open their first editors — " +
    "not knowing that the patterns they will learn are alive because of you.",
  finalWords:
    "Every great codebase begins with a single well-placed abstraction. " +
    "You have proven that mastery is not knowing one perfect answer, " +
    "but knowing which of many answers fits the question before you. " +
    "Go forth and architect.",
};
