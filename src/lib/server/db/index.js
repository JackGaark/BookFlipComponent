import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$app/env/private';

/** Whether a real database is configured. Without one, auth is disabled (see `authEnabled`). */
export const dbConfigured = Boolean(DATABASE_URL);

// PLACEHOLDER: with no DATABASE_URL, fall back to an empty in-memory database so the app can
// build and serve the non-auth pages. Set DATABASE_URL (and DATABASE_AUTH_TOKEN for Turso) to use a real one.
const client = createClient({ url: DATABASE_URL ?? ':memory:', authToken: DATABASE_AUTH_TOKEN });

export const db = drizzle(client, { schema });
