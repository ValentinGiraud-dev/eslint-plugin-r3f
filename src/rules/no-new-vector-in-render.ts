import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import { isThreeVector, isInsideReactComponent, isInsideHook } from "../utils";

export default ESLintUtils.RuleCreator(
  () => "https://github.com/yourname/eslint-plugin-r3f"
)({
  name: "no-new-vector-in-render",
  meta: {
    type: "problem",
    docs: {
      description: "Avoid creating new THREE.Vector in render"
    },
    messages: {
      avoid: "Avoid creating new {{type}} in render. Use useMemo or reuse a ref."
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    return {
      NewExpression(node: TSESTree.NewExpression) {
        // Skip if inside a hook like useMemo, useRef, etc.
        if (isInsideHook(node)) {
          return;
        }

        if (isThreeVector(node) && isInsideReactComponent(node)) {
            context.report({
              node,
              messageId: "avoid",
              data: {
                type: node.callee.type === "Identifier"
                  ? node.callee.name
                  : "THREE.Vector"
              }
            });
          }
      }
    };
  }
});