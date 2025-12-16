import { TSESTree } from "@typescript-eslint/utils";

export default function isThreeVector(node: TSESTree.NewExpression) {
    if (node.callee.type === "Identifier") {
      return ["Vector2", "Vector3", "Color"].includes(node.callee.name);
    }
  
    if (node.callee.type === "MemberExpression") {
      const isThreeObject =
        node.callee.object.type === "Identifier" &&
        node.callee.object.name === "THREE";
      
      if (!isThreeObject) {
        return false;
      }
  
      // Check if the member is a Vector type
      if (node.callee.property.type === "Identifier") {
        const vectorTypes = ["Vector2", "Vector3", "Vector4", "Color"];
        return vectorTypes.includes(node.callee.property.name);
      }
      
      return false;
    }
  
    return false;
  }