import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: { port: 5174 },
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment AWS lib to work
    global: {},
  },
});
