import { defineConfig } from 'drizzle-kit';

// `drizzle-kit generate` only reads the schema, so it works without a database.
// PLACEHOLDER: commands that connect (push, migrate, studio) need a real DATABASE_URL.
if (!process.env.DATABASE_URL && process.argv.some((arg) => /^(push|migrate|studio)$/.test(arg))) {
	throw new Error('DATABASE_URL is not set');
}

export default defineConfig({
	schema: './src/lib/server/db/schema.js',
	dialect: 'turso',
	dbCredentials: {
		authToken: process.env.DATABASE_AUTH_TOKEN,
		url: process.env.DATABASE_URL || 'file:local.db'
	},
	verbose: true,
	strict: true
});
