import { error, redirect } from '@sveltejs/kit';

import { auth } from '#lib/server/auth.js';

export const load = (event) => {
	if (!auth) error(503, 'Auth is not configured: set DATABASE_URL and BETTER_AUTH_SECRET.');
	if (!event.locals.user) {
		return redirect(302, '/demo/better-auth/login');
	}
	return { user: event.locals.user };
};

export const actions = {
	signOut: async (event) => {
		await auth?.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/demo/better-auth/login');
	}
};
