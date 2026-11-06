import { error, fail, redirect } from '@sveltejs/kit';

import { auth } from '#lib/server/auth.js';
import { APIError } from 'better-auth/api';

/** @returns {NonNullable<typeof auth>} */
const requireAuth = () => {
	if (!auth) error(503, 'Auth is not configured: set DATABASE_URL and BETTER_AUTH_SECRET.');
	return auth;
};

export const load = (event) => {
	requireAuth();
	if (event.locals.user) {
		return redirect(302, '/demo/better-auth');
	}
	return {};
};

export const actions = {
	signInEmail: async (event) => {
		const { api } = requireAuth();
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		try {
			await api.signInEmail({
				body: {
					email,
					password,
					callbackURL: '/auth/verification-success'
				}
			});
		} catch (err) {
			if (err instanceof APIError) {
				return fail(400, { message: err.message || 'Signin failed' });
			}
			return fail(500, { message: 'Unexpected error' });
		}

		return redirect(302, '/demo/better-auth');
	},
	signUpEmail: async (event) => {
		const { api } = requireAuth();
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const name = formData.get('name')?.toString() ?? '';

		try {
			await api.signUpEmail({
				body: {
					email,
					password,
					name,
					callbackURL: '/auth/verification-success'
				}
			});
		} catch (err) {
			if (err instanceof APIError) {
				return fail(400, { message: err.message || 'Registration failed' });
			}
			return fail(500, { message: 'Unexpected error' });
		}

		return redirect(302, '/demo/better-auth');
	},
	signInSocial: async (event) => {
		const { api } = requireAuth();
		const formData = await event.request.formData();
		const provider = formData.get('provider')?.toString() ?? 'github';
		const callbackURL = formData.get('callbackURL')?.toString() ?? '/demo/better-auth';

		const result = await api.signInSocial({
			body: {
				provider: provider,
				callbackURL
			}
		});

		if (result.url) {
			return redirect(302, result.url);
		}
		return fail(400, { message: 'Social sign-in failed' });
	}
};
