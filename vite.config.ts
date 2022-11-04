import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import { devtoolsPlugin } from "@solid-devtools/transform"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  plugins: [
    solidPlugin(),
    devtoolsPlugin({
      wrapStores: true,
      jsxLocation: true,
      name: true,
    }),
    visualizer({ template: "sunburst" }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  test: {
    globals: true,
    environment: "jsdom",
    transformMode: { web: [/\.tsx?$/] },
    deps: {
      inline: [/solid-testing-library/, /solid-js/],
    },
  },
  resolve: {
    conditions: ["development", "browser"],
  },
  assetsInclude: ["**/*.sgf"],
})
