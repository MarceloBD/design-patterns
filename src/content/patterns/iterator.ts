import { PatternContent } from "@/types/pattern";

export const iteratorContent: PatternContent = {
  slug: "iterator",
  name: "Iterator",
  category: "behavioral",
  difficulty: "beginner",
  order: 3,
  xpReward: 150,
  lore: "The Great Archive stores knowledge in trees, graphs, linked chains, and crystalline arrays. Each requires different traversal magic. The old Iterator enchantment let scholars walk any collection with the same stride. That enchantment faded. Recast it.",
  hook: "Traverse a collection without exposing its internal structure",
  analogy: "A TV remote's channel buttons. You press 'next' to go to the next channel without knowing how the TV stores channels internally (array? linked list? satellite feed?). The remote gives you sequential access regardless of the underlying data structure.",
  antiPattern: `// The naive approach: exposing internal structure to clients
class BinaryTree {
  root: TreeNode;
  // Client must know it's a tree and traverse manually
}

// Client code must understand the data structure's internals
function findUser(tree: BinaryTree, id: string) {
  let current = tree.root;
  // Client manually implements DFS, BFS, in-order...
  const stack = [current];
  while (stack.length) {
    const node = stack.pop()!;
    if (node.data.id === id) return node.data;
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
}

// If the data structure changes (tree → graph), ALL client code breaks
// Traversal logic duplicated everywhere, no way to swap traversal strategy`,
  problem: `You have different data structures (array, tree, graph, hash map) that all need to be traversed. Each one has different internal structure and traversal logic.

Client code that loops through these collections gets tightly coupled to their internal structure. If you change from an array to a tree, all traversal code breaks.

You also need multiple traversal strategies for the same collection: depth-first, breadth-first, filtered, reversed.`,
  solution: `Iterator extracts the traversal logic into a separate object called an iterator.

The iterator implements a standard interface (next(), hasNext()) that clients use regardless of the underlying collection. The collection provides a method to create its iterator.

Multiple iterators can traverse the same collection simultaneously and independently. Different iterator implementations provide different traversal strategies.`,
  glossary: [
    { term: "Iterator", definition: "An object that provides sequential access to elements of a collection via next() and hasNext() methods." },
    { term: "Iterable", definition: "A collection that can create an iterator. In TypeScript, objects implementing Symbol.iterator are iterable." },
    { term: "Cursor", definition: "The current position within the iteration. Managed internally by the iterator." },
    { term: "Lazy Evaluation", definition: "Computing the next element only when requested, not all at once. Memory-efficient for large or infinite sequences." },
    { term: "Generator", definition: "TypeScript's built-in iterator pattern using function* and yield. A convenient way to implement iterators." },
  ],
  highlightLines: [5, 6, 7, 8, 9, 10, 11, 12],
  diagramDescription: "Collection creates Iterator → Iterator has next() and hasNext() → Client uses Iterator without knowing collection internals.",
  codeExample: `// Iterator interface
interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
  reset(): void;
}

// A collection with complex internal structure
class BinaryTree<T> {
  constructor(
    public value: T,
    public left: BinaryTree<T> | null = null,
    public right: BinaryTree<T> | null = null
  ) {}

  // Factory methods for different traversal strategies
  inOrderIterator(): Iterator<T> {
    return new InOrderIterator(this);
  }

  breadthFirstIterator(): Iterator<T> {
    return new BreadthFirstIterator(this);
  }
}

// In-order traversal (left → root → right)
class InOrderIterator<T> implements Iterator<T> {
  private stack: BinaryTree<T>[] = [];
  private current: BinaryTree<T> | null;

  constructor(private root: BinaryTree<T>) {
    this.current = root;
    this.pushLeftBranch(this.current);
  }

  private pushLeftBranch(node: BinaryTree<T> | null): void {
    while (node) {
      this.stack.push(node);
      node = node.left;
    }
  }

  hasNext(): boolean {
    return this.stack.length > 0;
  }

  next(): T {
    const node = this.stack.pop()!;
    if (node.right) {
      this.pushLeftBranch(node.right);
    }
    return node.value;
  }

  reset(): void {
    this.stack = [];
    this.current = this.root;
    this.pushLeftBranch(this.current);
  }
}

// Breadth-first traversal (level by level)
class BreadthFirstIterator<T> implements Iterator<T> {
  private queue: BinaryTree<T>[];

  constructor(private root: BinaryTree<T>) {
    this.queue = [root];
  }

  hasNext(): boolean {
    return this.queue.length > 0;
  }

  next(): T {
    const node = this.queue.shift()!;
    if (node.left) this.queue.push(node.left);
    if (node.right) this.queue.push(node.right);
    return node.value;
  }

  reset(): void {
    this.queue = [this.root];
  }
}

// Build a tree:      4
//                   / \\
//                  2   6
//                 / \\ / \\
//                1  3 5  7
const tree = new BinaryTree(4,
  new BinaryTree(2, new BinaryTree(1), new BinaryTree(3)),
  new BinaryTree(6, new BinaryTree(5), new BinaryTree(7))
);

// Same tree, different traversal strategies
const inOrder = tree.inOrderIterator();
const results: number[] = [];
while (inOrder.hasNext()) results.push(inOrder.next());
console.log(results); // [1, 2, 3, 4, 5, 6, 7] — sorted!

const bfs = tree.breadthFirstIterator();
const bfsResults: number[] = [];
while (bfs.hasNext()) bfsResults.push(bfs.next());
console.log(bfsResults); // [4, 2, 6, 1, 3, 5, 7] — level by level`,
};
