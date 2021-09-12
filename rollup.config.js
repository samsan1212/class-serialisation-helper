import packageJson from "./package.json";

// plugins
import { nodeResolve } from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";

const base = {
  input: "src/mod.ts",
  external: ["reflect-metadata"],
  plugins: [
    nodeResolve(),
    commonjs(),
    esbuild({
      include: /\.[jt]sx?$/,
      exclude: /node_modules/,
      sourceMap: false,
      minify: true,
      target: "es2017",
    }),
  ],
};

export default [
  {
    // generate type file, and type-checking
    input: "src/mod.ts",
    output: [{ file: packageJson.types, format: "es" }],
    plugins: [dts()],
  },
  {
    ...base,
    output: {
      file: packageJson.main,
      format: "cjs",
      exports: "auto",
    },
  },
  {
    ...base,
    output: {
      file: packageJson.module,
      format: "es",
    },
  },
];
