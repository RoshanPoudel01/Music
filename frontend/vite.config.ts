import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
  publicDir: "public",
  server: { open: true, port: 6005 },

  resolve: {
    alias: {
      "@artist": path.resolve(__dirname, "src"),
    },
  },
});
