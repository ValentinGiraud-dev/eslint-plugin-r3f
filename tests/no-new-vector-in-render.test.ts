import { afterAll, describe, it } from "vitest";
import { RuleTester } from "@typescript-eslint/rule-tester";
import tsParser from "@typescript-eslint/parser";
import rule from "../src/rules/no-new-vector-in-render";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true
      }
    }
  }
});

ruleTester.run("no-new-vector-in-render", rule, {
  valid: [
    {
      code: `
        import { Vector3 } from "three";
        import { useMemo } from "react";

        function Scene() {
          const pos = useMemo(() => new Vector3(1, 2, 3), []);
          return <mesh position={pos} />;
        }
      `
    },
    {
      code: `
        import { Vector3 } from "three";
        import * as React from "react";

        function Scene() {
          const pos = React.useMemo(() => new Vector3(1, 2, 3), []);
          return <mesh position={pos} />;
        }
      `
    },
    {
      code: `
        import { Vector3 } from "three";
        import React from "react";

        function Scene() {
          const pos = React.useMemo(() => new Vector3(1, 2, 3), []);
          return <mesh position={pos} />;
        }
      `
    },
    {
      code: `
        import { Vector4 } from "three";
        import { useMemo } from "react";

        function Scene() {
          const pos = useMemo(() => new Vector4(1, 2, 3, 4), []);
          return <mesh position={pos} />;
        }
      `
    }
  ],
  invalid: [
    {
      code: `
        import { Vector3 } from "three";

        function Scene() {
          return <mesh position={new Vector3(1, 2, 3)} />;
        }
      `,
      errors: [{ messageId: "avoid" }]
    },
    {
      code: `
        import { Vector4 } from "three";

        function Scene() {
          return <mesh position={new Vector4(1, 2, 3, 4)} />;
        }
      `,
      errors: [{ messageId: "avoid" }]
    },
    {
      code: `
        function Scene() {
          return <mesh position={new THREE.Vector4(1, 2, 3, 4)} />;
        }
      `,
      errors: [{ messageId: "avoid" }]
    },
    {
      code: `
        import { Vector3 } from "three";

        const someObject = {
          useMemo: (fn) => fn()
        };

        function Scene() {
          // This should be flagged because someObject.useMemo is not a React hook
          const pos = someObject.useMemo(() => new Vector3(1, 2, 3));
          return <mesh position={pos} />;
        }
      `,
      errors: [{ messageId: "avoid" }]
    }
  ]
});