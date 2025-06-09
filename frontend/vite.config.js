import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: "all", // allow any host during development, safer for now
    hmr: {
      protocol: "ws",
      host: "gitverse.local", // your hostname here
      port: 5173,
      clientPort: 5173,
    },
  },
});
