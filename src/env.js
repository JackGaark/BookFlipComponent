import { defineEnvVars } from '@sveltejs/kit/env';

/**
 * All of these only power the Better Auth demo under `/demo`. They are optional so the
 * portfolio builds and runs without them; auth is disabled until `DATABASE_URL`,
 * `BETTER_AUTH_SECRET` (and, for GitHub sign-in, the GitHub credentials) are set.
 * @param {string | undefined} value
 */
const optional = (value) => value || undefined;

export const variables = defineEnvVars({
	DATABASE_URL: { description: 'The database connection string.', schema: optional },
	DATABASE_AUTH_TOKEN: {
		description:
			'Auth token for the [Turso](https://turso.tech) database. Not needed for a local `file:` database.',
		schema: optional
	},
	ORIGIN: {
		description:
			'The app origin (base URL), e.g. `http://localhost:5173`. Inferred from the request when unset.',
		schema: optional
	},
	BETTER_AUTH_SECRET: {
		description:
			'Secret used to sign tokens. For production use 32 characters generated with high entropy. See [Better Auth installation](https://www.better-auth.com/docs/installation).',
		schema: optional
	},
	GITHUB_CLIENT_ID: {
		description:
			'GitHub OAuth client ID. See [Better Auth GitHub provider](https://www.better-auth.com/docs/authentication/github).',
		schema: optional
	},
	GITHUB_CLIENT_SECRET: {
		description:
			'GitHub OAuth client secret. See [Better Auth GitHub provider](https://www.better-auth.com/docs/authentication/github).',
		schema: optional
	}
});
