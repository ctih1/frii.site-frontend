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
	import { localizeHref } from "../../paraglide/runtime";
	import {
		AuthError,
		CaptchaError,
		ConflictError,
		InviteError,
		MFAError,
		PermissionError,
		ServerContactor,
		UserError,
		login
	} from "../../serverContactor";

	let serverContactor: ServerContactor;

	let username: string;
	let password: string;
	let repeatPassword: string;
	let email: string;
	let modal: Modal;
	let redirectURL: string; // Used to automatically redirect user to the right endpoint after login
	let loader: Loader;
	let warningText: string; // Used for example "it seems like you don't have permissions to access this"
	let requiresMfa: boolean = false;
	let mfaCode: string = "";
	let captchaSolved: boolean = false;
	let captchaCode: string = "";
	let loginButton: Button;

	$: mfaCode = mfaCode.slice(0, 6);

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
		login(username, password, captchaCode, mfaCode ? mfaCode : undefined)
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
				} else if (error instanceof MFAError) {
					if (mfaCode) {
						modal.open(m.code_verif_loading_wrong(), m.mfa_wrong_code_desc());
					}
					requiresMfa = true;
				} else if (error instanceof CaptchaError) {
					// @ts-ignore
					turnstile.reset();
					modal.open(m.captcha_fail(), "");
				} else {
					modal.open(m.login_failed(), m.login_generic_error());
				}

				// @ts-ignore
				turnstile.reset();
				throw new Error("Login failed");
			})
			.then(session => {
				// @ts-ignore
				const sessionId: string = session["auth-token"];
				loader.hide();
				window.gtag?.("event", "log_in");
				const date = new Date(Date.now() + 604800 * 1000).toUTCString();
				document.cookie = `auth-token=${sessionId}; expires=${date}; SameSite=Strict; ${!dev ? "Secure" : ""}`;
				if (!getAuthToken()) {
					console.error("Browser did not accept cookies...");
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
			.register(username, password, email, captchaCode)

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
				// @ts-ignore
				turnstile.reset();
				throw new Error("Registration failed");
			})
			.then(_ => {
				loader.hide();
				modal.open(m.signup_success(), m.signup_success_description());
				window.gtag?.("event", "sign_up");

				// @ts-ignore
				turnstile.reset();
			});
	}

	function accountActionButtonClick() {
		if (!captchaSolved) {
			modal.open(m.captcha_fail(), "");
			return;
		}
		if (serverContactor === undefined) {
			return;
		}
		if (login_mode) {
			handleLogin();
		} else {
			handleSignup();
		}
	}

	let login_mode: boolean = true;

	if (browser) {
		// if using synchronous loading, will be called once the DOM is ready
		//@ts-ignore
		turnstile.ready(function () {
			// @ts-ignore
			turnstile.render("#turnstile-container", {
				sitekey: "0x4AAAAAABiGbbOhSUc5vWl9",
				callback: function (token: string) {
					captchaCode = token;
					captchaSolved = true;

					loginButton.enable();
					console.log(`Challenge Success`);
				}
			});
		});
	}
</script>

<svelte:head>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
	<title>{m.account_title_on_tab()}</title>
</svelte:head>

<Loader bind:this={loader} />
{#if requiresMfa}
	<Holder>
		<h1>2 Factor authentication</h1>
		<p>Enter your one time code from your authenticator app</p>
		<input style="font-size: 28px" bind:value={mfaCode} placeholder={"000000"} type="number" />
		<Button args={"fill padding"} on:click={_ => handleLogin()}>{m.login_text()}</Button>

		<a href={localizeHref("/account/recover/2fa")}>{m.mfa_disable_with_backup()}</a>
		<br />
		<a href="mailto:contact@frii.site">{m.mfa_unable_to_login()}</a>
	</Holder>
{:else}
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
			<Button
				bind:this={loginButton}
				startDisabled={true}
				on:click={accountActionButtonClick}
				args={"fill"}>
				{login_mode ? m.login_button() : m.signup_button()}
			</Button>
		</div>
		<a href="#" on:click={() => (login_mode = !login_mode)}>
			{login_mode ? m.signup_instead() : m.login_instead()}
		</a>
	</Holder>
{/if}
<div data-sitekey="0x4AAAAAABiGbbOhSUc5vWl9" data-theme="dark" id="turnstile-container"></div>
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

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type="number"] {
		-moz-appearance: textfield;
	}

	#turnstile-container {
		margin-left: auto;
		margin-right: auto;
		margin-top: 12px;
		width: fit-content;
	}
</style>
