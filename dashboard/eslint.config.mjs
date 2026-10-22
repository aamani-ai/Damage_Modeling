import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // public/twin/ is the Digital Twin's viewer and models, vendored unchanged and checked by SHA (DCD-D21): not ours to lint
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "public/twin/**"]),
]);

export default eslintConfig;
