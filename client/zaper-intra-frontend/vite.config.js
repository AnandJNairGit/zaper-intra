// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Parse port with fallback
  const clientPort = parseInt(env.VITE_CLIENT_PORT) || 3001;
  
  return {
    plugins: [tailwindcss(), react()],
    server: {
      port: clientPort,
      host: true, // Allow access from network
      open: true, // Automatically open browser
    },
    preview: {
      port: clientPort,
      host: true,
    },
  };
});
