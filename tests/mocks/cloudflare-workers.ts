// Mock for the `cloudflare:workers` module used in Vitest
// This is aliased in vitest.config.ts so that server-side code can be imported in tests

export const env: Record<string, unknown> = {};
