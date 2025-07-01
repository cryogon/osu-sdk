import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { readFileSync } from "fs";

// Read package.json to get library info
const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

export default {
  input: "src/main.ts", // Your main entry point

  // Define multiple output formats
  output: [
    // ES Module build
    {
      file: "dist/main.esm.js",
      format: "es",
      sourcemap: true,
    },
    // CommonJS build
    {
      file: "dist/main.js",
      format: "cjs",
      sourcemap: true,
      exports: "auto",
    },
    // UMD build for browsers
    {
      file: "dist/main.umd.js",
      format: "umd",
      name: "OsuApiSdk",
      sourcemap: true,
      globals: {
        // Define globals for external dependencies in UMD build
        // Example: 'react': 'React', 'lodash': '_'
      },
    },
    // Minified UMD build
    {
      file: "dist/main.umd.min.js",
      format: "umd",
      name: "OsuApiSdk",
      sourcemap: true,
      plugins: [terser()],
      globals: {
        // Same globals as above
      },
    },
  ],

  // External dependencies (won't be bundled)
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
    // Exclude Node.js built-ins for Node.js libraries
    /^node:/,
  ],

  plugins: [
    // Resolve node modules
    resolve({
      browser: true,
      preferBuiltins: false,
    }),

    // Convert CommonJS to ES modules
    commonjs(),

    // TypeScript compilation (remove if not using TypeScript)
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      rootDir: "src",
    }),

    // Babel transpilation
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              // Adjust based on your browser/Node.js support requirements
              node: "14",
              browsers: ["> 1%", "last 2 versions", "not dead"],
            },
          },
        ],
        // Add '@babel/preset-react' if building a React library
        // '@babel/preset-react',
      ],
    }),
  ],

  // Suppress warnings for certain scenarios
  onwarn(warning, warn) {
    // Skip certain warnings
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    if (warning.code === "MISSING_GLOBAL_NAME") return;

    // Use default for everything else
    warn(warning);
  },
};
