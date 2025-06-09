import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "a501b2edf3d9b43018c2425fb4f5cb3c-112455890.ap-south-1.elb.amazonaws.com",
    ],
  },
});
