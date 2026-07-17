// Shared types and utilities for AI code analysis routes

export type Action =
  | "explain"
  | "debug"
  | "optimize"
  | "comments"
  | "bugs"
  | "readability"
  | "best-practices"
  | "tests"
  | "convert"
  | "line-by-line"
  | "time-complexity"
  | "space-complexity"
  | "suggest-algorithm";

export const VALID_ACTIONS: Action[] = [
  "explain", "debug", "optimize", "comments", "bugs",
  "readability", "best-practices", "tests", "convert",
  "line-by-line", "time-complexity", "space-complexity", "suggest-algorithm",
];

export function buildPrompt(
  action: Action,
  code: string,
  language: string,
  targetLanguage?: string
): string {
  const ctx = `Language: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;

  switch (action) {
    case "explain":
      return `${ctx}Explain this code clearly. Describe what it does, how it works step by step, its purpose, and any notable patterns or algorithms used. Use markdown with code examples where helpful.`;

    case "debug":
      return `${ctx}Debug this code. Identify all bugs, logic errors, potential runtime exceptions, and edge cases. For each issue, explain the problem and show the fix with corrected code. Use markdown with syntax-highlighted code blocks.`;

    case "optimize":
      return `${ctx}Optimize this code for performance and efficiency. Identify bottlenecks, suggest algorithmic improvements, and provide an optimized version with explanations for each change. Use markdown with before/after code comparisons.`;

    case "comments":
      return `${ctx}Add comprehensive, professional inline comments to this code. Explain the purpose of each function, important logic blocks, and non-obvious operations. Return ONLY the commented code in a single code block.`;

    case "bugs":
      return `${ctx}Perform a thorough bug analysis. List every potential bug, security vulnerability, null pointer risk, off-by-one error, and edge case. For each bug, provide severity (Critical/High/Medium/Low), description, and the corrected code. Use markdown formatting.`;

    case "readability":
      return `${ctx}Improve the readability of this code. Suggest better variable names, restructure complex expressions, add appropriate whitespace, and show a refactored version that is cleaner and more maintainable. Use markdown with the refactored code.`;

    case "best-practices":
      return `${ctx}Review this code against industry best practices for ${language}. Identify violations of SOLID principles, common anti-patterns, error handling issues, and style guide violations. Provide actionable recommendations with code examples. Use markdown.`;

    case "tests":
      return `${ctx}Generate comprehensive unit tests for this code using the most popular testing framework for ${language} (e.g. pytest for Python, Jest for JavaScript/TypeScript, JUnit for Java). Cover happy path, edge cases, error scenarios, and boundary conditions. Return well-structured test code.`;

    case "convert":
      return `${ctx}Convert this ${language} code to ${targetLanguage || "Python"} while preserving all functionality, logic, and behavior. Use idiomatic ${targetLanguage || "Python"} patterns and conventions. Return the complete converted code in a single code block.`;

    case "line-by-line":
      return `${ctx}Explain this code line by line. For each meaningful line or block, provide a numbered explanation in this format:
**Line N:** \`code here\`
→ Explanation of what this line does, why it exists, and any important details.

Be thorough but concise. Group closely related lines (e.g., a single for-loop or if-block) when it makes sense. Use markdown.`;

    case "time-complexity":
      return `${ctx}Analyze the time complexity of this code. Provide:
1. **Overall Time Complexity** (Big O notation)
2. **Per-function/loop breakdown** with reasoning for each
3. **Best case, Average case, Worst case** analysis
4. **Comparison** with optimal complexity for this type of problem
5. **Improvement suggestions** if a better time complexity is achievable

Use markdown with clear headings and examples.`;

    case "space-complexity":
      return `${ctx}Analyze the space complexity of this code. Provide:
1. **Overall Space Complexity** (Big O notation)
2. **Memory breakdown**: stack space, heap allocations, auxiliary data structures
3. **In-place vs extra space** analysis
4. **Memory optimization suggestions** with code examples
5. **Trade-offs** between time and space efficiency

Use markdown with clear headings.`;

    case "suggest-algorithm":
      return `${ctx}Review this code and suggest better algorithms or data structures. Provide:
1. **Current Approach** — what algorithm/structure is currently used and its limitations
2. **Better Algorithm** — name, description, and why it's superior
3. **Implementation** — complete rewritten code using the better algorithm
4. **Complexity Comparison** — before vs after (time & space)
5. **When to use each** — guidance on choosing between approaches

Use markdown with code examples.`;

    default:
      return `${ctx}Analyze this code and provide useful feedback.`;
  }
}
