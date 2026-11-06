import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	DATABASE_URL: {
		description:
			'The database connection string. Optional: when unset, auth is disabled and a throwaway in-memory placeholder database is used.',
		schema: (value) => value || undefined
	},
	DATABASE_AUTH_TOKEN: {
		description:
			'Auth token for the [Turso](https://turso.tech) database. Not needed for a local `file:` database.',
		schema: (value) => value || undefined
	},
	ORIGIN: {
		description:
			'The app origin (base URL), e.g. `http://localhost:5173`. Optional on Netlify, where it falls back to the site `URL`; if neither is set, Better Auth infers it from the request.',
		schema: (value) => value || process.env.URL || undefined
	},
	BETTER_AUTH_SECRET: {
		description:
			'Secret used to sign tokens. For production use 32 characters generated with high entropy. See [Better Auth installation](https://www.better-auth.com/docs/installation). Optional: when unset, auth is disabled.',
		schema: (value) => value || undefined
	},
	GITHUB_CLIENT_ID: {
		description:
			'Optional GitHub OAuth client ID; GitHub sign-in is enabled only when this and `GITHUB_CLIENT_SECRET` are set. See [Better Auth GitHub provider](https://www.better-auth.com/docs/authentication/github).',
		schema: (value) => value || undefined
	},
	GITHUB_CLIENT_SECRET: {
		description:
			'Optional GitHub OAuth client secret. See [Better Auth GitHub provider](https://www.better-auth.com/docs/authentication/github).',
		schema: (value) => value || undefined
	}
});
