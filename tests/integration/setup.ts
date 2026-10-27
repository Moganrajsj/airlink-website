import { loadEnvConfig } from "@next/env";

/**
 * Loads the same env files the app uses (`.env.local`, `.env`) before Prisma is
 * imported. `dev = true` deliberately skips `.env.production`, which is a
 * deployment template with placeholder credentials.
 */
loadEnvConfig(process.cwd(), true);
