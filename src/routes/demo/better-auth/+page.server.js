import { redirect } from '@sveltejs/kit';

import { auth, authEnabled } from '#lib/server/auth.js';

export const load = (event) => {
	if (!event.locals.user) {
		return redirect(302, '/demo/better-auth/login');
	}
	return { user: event.locals.user };
};

export const actions = {
	signOut: async (event) => {
		if (!authEnabled) return redirect(302, '/demo/better-auth/login');
		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/demo/better-auth/login');
	}
};
