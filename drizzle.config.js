import { defineConfig } from 'drizzle-kit';

// `drizzle-kit generate` only reads the schema, so it runs without credentials.
// Commands that connect (push, migrate, studio) need DATABASE_URL (and DATABASE_AUTH_TOKEN for Turso).
const url = process.env.DATABASE_URL || 'file:local.db';

export default defineConfig({
	schema: './src/lib/server/db/schema.js',
	dialect: 'turso',
	dbCredentials: {
		authToken: process.env.DATABASE_AUTH_TOKEN,
		url
	},
	verbose: true,
	strict: true
});
