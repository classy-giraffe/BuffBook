import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "src/components/ui/**",
        "src/db/schema.ts",
        "src/content.config.ts",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@db": path.resolve(__dirname, "src/db"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@data": path.resolve(__dirname, "src/data"),
      "cloudflare:workers": path.resolve(__dirname, "tests/mocks/cloudflare-workers.ts"),
    },
  },
});
