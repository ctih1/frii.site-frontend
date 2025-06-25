<script lang="ts">
	import { browser, dev } from "$app/environment";
	import { page } from "$app/stores";
	import { onMount } from "svelte";

	import Button from "$lib/components/Button.svelte";
	import Holder from "$lib/components/Holder.svelte";
	import Loader from "$lib/components/Loader.svelte";
	import Modal from "$lib/components/Modal.svelte";

	import { getAuthToken } from "$lib";
	import { m } from "../../paraglide/messages";
	import {
		AuthError,
		ConflictError,
		InviteError,
		PermissionError,
		ServerContactor,
		UserError,
		login
	} from "../../serverContactor";

	let code: string | null = null;
	let valid: boolean = false;

	if (browser) {
		const params: URLSearchParams = new URLSearchParams(window.location.search);
		code = params.get("invite");
		valid = code !== null;
	}

	let serverContactor: ServerContactor;

	let username: string;
	let password: string;
	let repeatPassword: string;
	let email: string;
	let modal: Modal;
	let redirectURL: string; // Used to automatically redirect user to the right endpoint after login
	let loader: Loader;
	let warningText: string; // Used for example "it seems like you don't have permissions to access this"

	function modalClose() {
		modal.close();
		loader?.hide();
	}
	function modalSecondary() {}

	onMount(() => {
		serverContactor = new ServerContactor(getAuthToken());

		redirectURL = $page.url.searchParams.get("r") ?? "/";
		if (localStorage.getItem("logged-in") === "y") window.location.href = "/account/manage";

		switch (
			Number($page.url.searchParams.get("c")) // switch status code that redirected user here
		) {
			case 460:
				warningText = m.account_signed_out();
				break;

			case 461:
			case 462:
				warningText = m.account_permissions_lack();
				break;
		}
	});

	function handleLogin() {
		loader.show(undefined, m.account_login_loading_desc());
		login(username, password)
			.catch(error => {
				loader.hide();

				if (error instanceof AuthError || error instanceof UserError) {
					modal.open(m.login_failed(), m.login_failed_description());
				} else if (error instanceof PermissionError) {
					modal.open(
						m.login_failed(),
						m.login_failed_verify(),
						undefined,
						undefined,
						true,
						username
					);
				} else {
					modal.open(m.login_failed(), m.login_generic_error());
				}

				throw new Error("Login failed");
			})
			.then(session => {
				// @ts-ignore
				const sessionId: string = session["auth-token"];
				loader.hide();
				const date = new Date(Date.now() + 604800 * 1000).toUTCString();
				document.cookie = `auth-token=${sessionId}; expires=${date}; SameSite=Strict; ${!dev ? "Secure" : ""}`;
				if (!getAuthToken()) {
					console.error("Browser did not accept cookies... using localstorage");
					localStorage.setItem("auth-token", `${sessionId}`);
				}
				localStorage.removeItem("temp-token");
				localStorage.removeItem("verif-token"); // Prevents users from potentially relogging without creds if verif-token is in localstrage
				localStorage.setItem("logged-in", "y");
				modal.open(m.login_succeed(), m.login_succeed_description());
				setTimeout(() => {
					// 3s timeout is for firefox, since an immediate redirect can cause a bug where localStorage doesnt save
					redirectURL = redirectURL ?? "/";
					window.location.href = redirectURL;
				}, 3000);
			});
	}

	function handleSignup() {
		loader.show(undefined, m.account_signup_loading_desc());
		if (password !== repeatPassword) {
			loader.hide();
			modal.open(m.signup_password_not_match(), m.signup_password_not_match_description());
			return;
		}
		serverContactor
			//@ts-ignore
			.register(username, password, email, code)

			.catch(err => {
				loader.hide();
				if (err instanceof InviteError)
					modal.open(
						m.account_register_invite_fail(),
						m.account_register_invite_fail_desc()
					);
				if (err instanceof ConflictError)
					modal.open(m.signup_fail(), m.signup_fail_username());
				if (err instanceof UserError) modal.open(m.signup_fail(), m.signup_fail_email());
				throw new Error("Registration failed");
			})
			.then(_ => {
				loader.hide();
				modal.open(m.signup_success(), m.signup_success_description());
			});
	}

	function accountActionButtonClick() {
		if (serverContactor === undefined) {
			return;
		}
		if (login_mode) {
			handleLogin();
		} else if (valid) {
			handleSignup();
		}
	}

	let login_mode: boolean = true;

	valid ? (login_mode = false) : (login_mode = true);
</script>

<svelte:head>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" defer></script>
	<title>{m.account_title_on_tab()}</title>
</svelte:head>

<Loader bind:this={loader} />
<Holder>
	<h1>{login_mode ? m.login_text() : m.signup_text()}</h1>
	<p>
		{#if warningText}
			{warningText}
		{:else}
			{login_mode ? m.login_description() : m.signup_description()}
		{/if}
	</p>

	<form>
		{#if !login_mode}
			<input bind:value={email} placeholder="email" type="email" />
		{/if}

		<input bind:value={username} placeholder={m.username_placeholder()} type="text" />

		<input bind:value={password} placeholder={m.password_placeholder()} type="password" />

		{#if !login_mode}
			<input
				bind:value={repeatPassword}
				placeholder={m.confirm_password_placeholder()}
				type="password" />
			<p>{@html m.legal_text()}</p>
		{/if}

		{#if login_mode}
			<h4 style="margin-top: 5px; margin-bottom: 5px;">
				<a href="/account/recover">{m.password_forget_intro()}</a>
			</h4>
		{/if}
	</form>

	<div class="button-holder">
		<Button on:click={accountActionButtonClick} args={"fill"}>
			{login_mode ? m.login_button() : m.signup_button()}
		</Button>
	</div>

	{#if !login_mode && !valid}
		<div style="display: flex; align-items: center; justify-content: center;">
			<span style="font-size: 8em;" class="material-symbols-outlined">warning</span>
		</div>
		<h1>Account creation closed</h1>
		<p>
			Due to numerous people using frii.site for scamming people, so we switched over to an
			invite-based system. If you know someone who uses frii.site, you can ask them for an
			invite.
		</p>
		<p>Thank you for your support.</p>

		<a href="#" on:click={() => (login_mode = true)}>Login to an existing account</a>
	{/if}
	<a href="#" on:click={() => (login_mode = !login_mode)}>
		{login_mode ? m.signup_instead() : m.login_instead()}
	</a>
</Holder>

<Modal
	bind:this={modal}
	on:primary={() => modalClose()}
	on:secondary={() => modalSecondary()}
	overrideDefault={true}
	description=""
	title=""
	options={["Continue"]}></Modal>

<style>
	form {
		display: flex;
		flex-direction: column;
		height: fit-content;
	}
	form input {
		margin-top: 0.25em;
		margin-bottom: 0.25em;
	}
	input {
		height: 3em;
		font-size: 16px;
	}
	.button-holder {
		height: 2em;
	}
	a {
		font-size: 0.75em;
	}
	a:hover {
		cursor: pointer;
	}
</style>
