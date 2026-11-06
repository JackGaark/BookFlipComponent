<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<h1>Login</h1>
{#if !data.authEnabled}
	<p role="alert">
		Auth is not configured on this deployment yet: set <code>DATABASE_URL</code> and
		<code>BETTER_AUTH_SECRET</code> to enable sign-in.
	</p>
{/if}
<form method="post" action="?/signInEmail" use:enhance>
	<label>
		Email
		<input type="email" name="email" />
	</label>
	<label>
		Password
		<input type="password" name="password" />
	</label>
	<label>
		Name (for registration)
		<input name="name" />
	</label>
	<button>Login</button>
	<button formaction="?/signUpEmail">Register</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>

{#if data.githubEnabled}
	<hr />

	<form method="post" action="?/signInSocial" use:enhance>
		<input type="hidden" name="provider" value="github" />
		<input type="hidden" name="callbackURL" value="/demo/better-auth" />
		<button>Sign in with GitHub</button>
	</form>
{/if}
