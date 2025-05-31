import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { sri } from "vite-plugin-sri3";

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig((_) => {
  return {
    build: {
      outDir: "build",
      rollupOptions: {
        external: ["@emotion/is-prop-valid"], // temp fix for rolldown-vite https://github.com/rolldown/rolldown/issues/4051#issuecomment-2786061196
      },
    },
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
    },
    plugins: [
      react({ devTarget: "es2022" }),
      VitePWA({
        manifest: {
          theme_color: "#343746",
          background_color: "#343746",
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
      sri(),
    ],
    test: {
      clearMocks: true,
      coverage: {
        provider: "v8",
        include: ["src/**"],
        exclude: ["**/*.mother.ts", "**/*.test.ts", "**/*.test.tsx"],
      },
      pool: "vmThreads",
      globals: true,
      mockClear: true,
      environment: "happy-dom",
      setupFiles: ["./src/setupTests.ts", "console-fail-test/setup"],
      include: [
        "src/**/*.{test,spec}.?(c|m)[jt]s?(x)",
        "src/*.{test,spec}.?(c|m)[jt]s?(x)",
      ],
    },
  };
});
