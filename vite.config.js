import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { fileURLToPath, URL } from "node:url"
import eslintPlugin from "vite-plugin-eslint"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      include: ["src/**/*.js", "src/**/*.vue", "src/*.js", "src/*.vue"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ["vue3-plotly", "uuid", "lodash"],
  },
})
