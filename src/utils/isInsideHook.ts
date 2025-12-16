import { TSESTree } from "@typescript-eslint/utils";

const ALLOWED_HOOKS = ["useMemo", "useRef", "useState", "useCallback"];

export default function isInsideHook(node: TSESTree.Node, hookNames: string[] = ALLOWED_HOOKS): boolean {
  let current = node.parent;

  while (current) {
    // Check if we're inside a CallExpression that's a hook call
    // e.g., useMemo(() => new Vector3(...))
    if (current.type === "CallExpression") {
      if (
        current.callee.type === "Identifier" &&
        hookNames.includes(current.callee.name)
      ) {
        return true;
      }
    }

    current = current.parent;
  }

  return false;
}

