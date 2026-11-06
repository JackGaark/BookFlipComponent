import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$app/env/private';

/** `null` when `DATABASE_URL` is unset, so the rest of the site keeps working without a database. */
export const db = DATABASE_URL
	? drizzle(createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN }), { schema })
	: null;
