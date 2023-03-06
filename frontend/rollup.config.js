const { nodeResolve } = require("@rollup/plugin-node-resolve");
module.exports = {
  input: "./editor.js",
  output: {
    file: "./editor.bundle.js",
    format: "iife",
  },
  plugins: [nodeResolve()],
};
