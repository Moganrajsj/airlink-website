import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    test: {
        environment: "node",
        include: ["tests/unit/**/*.test.ts"],
        env: {
            FORM_TOKEN_SECRET: "test-form-token-secret",
            LEAD_NAME_MIN: "2",
            LEAD_NAME_MAX: "80",
        },
    },
});
