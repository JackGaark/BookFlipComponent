import {
	ORIGIN,
	BETTER_AUTH_SECRET,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET
} from '$app/env/private';

import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db, dbConfigured } from '#lib/server/db/index.js';

/** Auth only works once a real database and signing secret are configured. */
export const authEnabled = dbConfigured && Boolean(BETTER_AUTH_SECRET);

/** GitHub sign-in is offered only when its OAuth credentials are set. */
export const githubEnabled = Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET);

export const auth = betterAuth({
	baseURL: ORIGIN,
	// PLACEHOLDER secret is only used while auth is disabled (no requests reach Better Auth then).
	secret: BETTER_AUTH_SECRET ?? 'placeholder-auth-disabled-set-BETTER_AUTH_SECRET',
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: { enabled: true },
	socialProviders:
		githubEnabled && GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET
			? { github: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET } }
			: {},
	plugins: [
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
