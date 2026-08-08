export type TokenType = "keyword" | "string" | "comment" | "number" | "type" | "function" | "plain";

export interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "import", "export", "from", "const", "let", "var", "function", "return",
  "async", "await", "new", "interface", "type", "class", "extends",
  "implements", "if", "else", "for", "while", "of", "in", "typeof",
  "instanceof", "default", "void", "as", "public", "private", "readonly",
  "static", "enum", "namespace", "declare", "throw", "try", "catch",
  "finally", "switch", "case", "break", "continue", "abstract", "override",
]);

const TYPES = new Set([
  "string", "number", "boolean", "void", "null", "undefined", "never",
  "unknown", "any", "object", "symbol", "bigint",
]);

const LITERALS = new Set(["true", "false", "null", "undefined", "this", "super"]);

function isIdentStart(char: string): boolean {
  return /[a-zA-Z_$]/.test(char);
}

function isIdentChar(char: string): boolean {
  return /[a-zA-Z0-9_$]/.test(char);
}

function isDigit(char: string): boolean {
  return /[0-9]/.test(char);
}

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  const length = code.length;

  while (index < length) {
    const char = code[index];
    const next = code[index + 1];

    if (char === "/" && next === "/") {
      let end = index + 2;
      while (end < length && code[end] !== "\n") end++;
      tokens.push({ type: "comment", value: code.slice(index, end) });
      index = end;
      continue;
    }

    if (char === "/" && next === "*") {
      let end = index + 2;
      while (end < length && !(code[end] === "*" && code[end + 1] === "/")) end++;
      end = Math.min(length, end + 2);
      tokens.push({ type: "comment", value: code.slice(index, end) });
      index = end;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      let end = index + 1;
      while (end < length) {
        if (code[end] === "\\") {
          end += 2;
          continue;
        }
        if (code[end] === char) {
          end++;
          break;
        }
        end++;
      }
      tokens.push({ type: "string", value: code.slice(index, end) });
      index = end;
      continue;
    }

    if (isDigit(char) || (char === "." && next && isDigit(next))) {
      let end = index;
      while (end < length && /[0-9._eExXa-fA-F]/.test(code[end])) end++;
      tokens.push({ type: "number", value: code.slice(index, end) });
      index = end;
      continue;
    }

    if (isIdentStart(char)) {
      let end = index + 1;
      while (end < length && isIdentChar(code[end])) end++;
      const word = code.slice(index, end);

      if (KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", value: word });
      } else if (TYPES.has(word) || /^[A-Z]/.test(word)) {
        tokens.push({ type: "type", value: word });
      } else if (LITERALS.has(word)) {
        tokens.push({ type: "keyword", value: word });
      } else if (end < length && code[end] === "(") {
        tokens.push({ type: "function", value: word });
      } else {
        tokens.push({ type: "plain", value: word });
      }
      index = end;
      continue;
    }

    tokens.push({ type: "plain", value: char });
    index++;
  }

  return tokens;
}

export const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: "var(--accent-teal)",
  string: "var(--accent-green)",
  comment: "var(--text-faint)",
  number: "var(--realm-creational)",
  type: "var(--accent-blue)",
  function: "var(--accent-blue-light)",
  plain: "var(--text-primary)",
};
