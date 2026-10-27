import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Integration tests run against the database in `.env` (the same schema the
 * production app uses, because the hosting account cannot create a second
 * database). They create leads through the real server action, assert the
 * stored result, and delete only the rows they created. Run with:
 *
 *   npm run test:integration
 */
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    test: {
        environment: "node",
        include: ["tests/integration/**/*.test.ts"],
        setupFiles: ["tests/integration/setup.ts"],
        testTimeout: 60_000,
        hookTimeout: 60_000,
        fileParallelism: false,
        sequence: { concurrent: false },
        env: {
            RUN_DB_TESTS: "1",
            FORM_TOKEN_SECRET: "integration-form-token-secret",
            AI_LEAD_SCORING_ENABLED: "false",
        },
    },
});
