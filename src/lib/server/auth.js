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
import { db } from '#lib/server/db/index.js';

/** @param {NonNullable<typeof db>} database */
const createAuth = (database) =>
	betterAuth({
		baseURL: ORIGIN,
		secret: BETTER_AUTH_SECRET,
		database: drizzleAdapter(database, { provider: 'sqlite' }),
		emailAndPassword: { enabled: true },
		socialProviders:
			GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET
				? { github: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET } }
				: {},
		plugins: [
			sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
		]
	});

/**
 * `null` when the database or `BETTER_AUTH_SECRET` isn't configured; the portfolio doesn't
 * need auth, and the `/demo/better-auth` routes report that auth is unavailable.
 */
export const auth = db && BETTER_AUTH_SECRET ? createAuth(db) : null;
