import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig((env) => {
  return {
    build: {
      outDir: "build",
    },
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    plugins: [
      react(),
      env.mode !== "test" && eslint(),
      VitePWA({
        manifest: {
          theme_color: "#282a36",
          background_color: "#282a36",
          display: "standalone",
          scope: "/",
          start_url: "/",
          short_name: "guitos",
          name: "guitos",
          icons: [
            {
              src: "favicon.svg",
              sizes: "any",
              type: "image/svg+xml",
            },
          ],
        },
      }),
    ],
    test: {
      coverage: {
        provider: "v8",
      },
      globals: true,
      mockClear: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  };
});
