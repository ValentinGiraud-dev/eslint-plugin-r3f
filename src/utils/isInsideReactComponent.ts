import { TSESTree } from "@typescript-eslint/utils";

export default function isInsideReactComponent(node: TSESTree.Node) {
    let current = node.parent;
  
    while (current) {
      // Function Declaration: function ComponentName() {}
      if (
        current.type === "FunctionDeclaration" &&
        current.id &&
        /^[A-Z]/.test(current.id.name ?? "")
      ) {
        return true;
      }
  
      // Arrow Function or Function Expression assigned to variable
      // const Component = () => {} or const Component = function() {}
      if (
        (current.type === "ArrowFunctionExpression" ||
         current.type === "FunctionExpression") &&
        current.parent &&
        current.parent.type === "VariableDeclarator" &&
        current.parent.id.type === "Identifier" &&
        /^[A-Z]/.test(current.parent.id.name)
      ) {
        return true;
      }
  
      current = current.parent;
    }
  
    return false;
  }