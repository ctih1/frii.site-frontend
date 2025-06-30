<script lang="ts">
	import { browser, dev } from "$app/environment";
	import {
		AuthError,
		CaptchaError,
		ConflictError,
		getAuthToken,
		login,
		MFAError,
		PermissionError,
		register,
		UserError
	} from "$lib";
	import favicon from "$lib/assets/favicon.svg";
	import { Button } from "$lib/components/ui/button/index";
	import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
	import InlineAlert from "$lib/components/ui/inline-alert/inline-alert.svelte";
	import * as InputOTP from "$lib/components/ui/input-otp/index.js";
	import { Input } from "$lib/components/ui/input/index";
	import { Label } from "$lib/components/ui/label/index";
	import { REGEXP_ONLY_DIGITS } from "bits-ui";
	import Cookies from "js-cookie";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { m } from "../../paraglide/messages";

	let { data } = $props();

	let isLoggingIn: boolean = $state(true);
	let username: string = $state("");
	let email: string = $state("");
	let password: string = $state("");
	let repeatPassword: string = $state("");
	let agreementsChecked: boolean = $state(false);

	let emailInvalid: boolean = $derived(validateEmail(email));
	let actionButtonDisabled: boolean = $state(false);
	let buttonLoadingState: boolean = $state(false);

	let errorTitle: string = $state("");
	let errorDescription: string = $state("");

	let alertTitle: string = $state("");
	let alertDescription: string = $state("");

	let requiresMfa: boolean = $state(false);
	let mfaInvalid: boolean = $state(false);
	let mfaCode: string = $state("");

	let captchaToken: string = "";
	let captchaDone: boolean = $state(false);

	function validateEmail(email: string) {
		return !String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	}

	function resetTurnstile() {
		captchaDone = false;
		// @ts-ignore
		turnstile.reset();
	}

	function logIn() {
		login(username, password, captchaToken, mfaCode ? mfaCode : undefined)
			.catch(error => {
				buttonLoadingState = false;
				errorTitle = m.login_failed();
				if (error instanceof AuthError || error instanceof UserError)
					errorDescription = m.login_failed_description();
				else if (error instanceof PermissionError)
					errorDescription = m.login_failed_verify();
				else if (error instanceof MFAError) {
					if (!requiresMfa) {
						requiresMfa = true;
					} else {
						errorDescription = m.mfa_wrong_code_desc();
					}
				} else if (error instanceof CaptchaError) errorDescription = m.captcha_fail();
				else errorDescription = m.login_generic_error();

				resetTurnstile();
				throw new Error("Login failed");
			})
			.then(session => {
				// @ts-expect-error no types implemented for this
				const sessionId: string = session["auth-token"];

				const date = new Date(Date.now() + 604800 * 1000).toUTCString();
				document.cookie = `auth-token=${sessionId}; expires=${date}; SameSite=Strict; ${!dev ? "Secure" : ""}`;
				if (!getAuthToken()) {
					console.error("Browser did not accept cookies...");
				}
				Cookies.set("logged-in", "yes");
				Cookies.set("auth-token", sessionId, {
					secure: !dev,
					domain: window.origin,
					sameSite: "Strict"
				});
				localStorage.setItem("logged-in", "y");
				setTimeout(() => {
					// 3s timeout is for firefox, since an immediate redirect can cause a bug where localStorage doesnt save
					window.location.href = data.redirectURL ?? "/";
				}, 3000);
			});
	}

	function signUp() {
		register(username, password, email, captchaToken)
			.catch(error => {
				errorTitle = m.signup_fail();
				if (error instanceof ConflictError) errorDescription = m.signup_fail_username();
				if (error instanceof UserError) errorDescription = m.signup_fail_email();
				if (error instanceof CaptchaError) errorDescription = m.captcha_fail();

				resetTurnstile();
				throw new Error("Signup failed");
			})
			.then(_ => {
				alertTitle = m.signup_success();
				alertDescription = m.signup_success_description();

				isLoggingIn = true;
				resetTurnstile();
			});
	}

	onMount(() => {
		// if using synchronous loading, will be called once the DOM is ready
		//@ts-ignore
		turnstile.ready(function () {
			// @ts-ignore
			turnstile.render("#turnstile-container", {
				sitekey: "0x4AAAAAABiGbbOhSUc5vWl9",
				callback: function (token: string) {
					captchaToken = token;
					captchaDone = true;

					console.log(`Challenge Success`);
				}
			});
		});
	});

	$effect(() => {
		if (!captchaDone) {
			console.log("Captcha not done...");
			actionButtonDisabled = true;
			return;
		}
		console.log("captcha done");

		if (isLoggingIn) {
			if (!username || !password) actionButtonDisabled = true;
			else actionButtonDisabled = false;

			console.log(`Checking login... ${actionButtonDisabled}`);
		} else {
			if (
				repeatPassword !== password ||
				!username ||
				!email ||
				emailInvalid ||
				!agreementsChecked
			)
				actionButtonDisabled = true;
			else actionButtonDisabled = false;
		}
	});
</script>

<svelte:head>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
</svelte:head>

<div class="login-holder bg-card m-auto w-[100vw] max-w-[500px] rounded-lg p-8">
	<div class="flex flex-col">
		<img class="w-8" src={favicon} alt="logo" />
		<h1 class="text-3xl font-bold">
			{#if isLoggingIn}
				{m.login_prompt()}
			{:else}
				{m.signup_prompt()}
			{/if}
		</h1>
	</div>
	<InlineAlert title={errorTitle} description={errorDescription} variant={"error"} />
	<InlineAlert title={alertTitle} description={alertDescription} variant={"note"} />
	{#if requiresMfa}
		<div class="mfa-screen mt-12">
			<h2 class="text-2xl font-semibold">{m.login_mfa_required()}</h2>
			<p>{m.login_mfa_description()}</p>
			<InputOTP.Root
				bind:value={mfaCode}
				class="m-auto mt-8 w-fit"
				maxlength={6}
				pattern={REGEXP_ONLY_DIGITS}>
				{#snippet children({ cells })}
					<InputOTP.Group>
						{#each cells as cell (cell)}
							<InputOTP.Slot
								class="h-16 w-16 text-2xl"
								aria-invalid={mfaInvalid}
								cell={cell} />
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>

			<Button
				onclick={() => {
					buttonLoadingState = true;
					logIn();
				}}
				loading={buttonLoadingState}
				disabled={!captchaDone || mfaCode.length != 6}
				type="submit"
				class="mt-4 w-full">{m.login_button()}</Button>
		</div>
	{:else}
		<form class="mt-6">
			<div class="flex flex-col gap-6">
				<div class="grid gap-2">
					<Label for="username">{m.username_placeholder()}</Label>
					<Input
						bind:value={username}
						id="username"
						type="text"
						placeholder="username"
						required />

					{#if !isLoggingIn}
						<Label for="email">Email</Label>
						<Input
							aria-invalid={emailInvalid}
							bind:value={email}
							id="email"
							type="email"
							placeholder="user@gmail.com"
							required />
					{/if}
					<div class="flex h-4 items-center">
						<Label for="password">{m.password_placeholder()}</Label>
						{#if isLoggingIn}
							<a
								transition:fade={{ duration: 100 }}
								href="##"
								class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
								{m.password_forget_intro()}
							</a>
						{/if}
					</div>
					<Input
						bind:value={password}
						id="password"
						type="password"
						placeholder="*********"
						required />
					{#if !isLoggingIn}
						<Label for="repeat-password">{m.confirm_password_placeholder()}</Label>
						<Input
							aria-invalid={!!repeatPassword && repeatPassword !== password}
							bind:value={repeatPassword}
							id="repeat-password"
							type="password"
							placeholder="*********"
							required />

						<div class="agreement flex">
							<Checkbox
								bind:checked={agreementsChecked}
								class="mr-2"
								id="agreements" />
							<Label for="agreements"
								>{@html m.signup_tos_and_privacy({
									tosLink: "/terms",
									privacyLink: "/privacy"
								})}</Label>
						</div>
					{/if}
				</div>
			</div>
		</form>

		<Button
			onclick={() => {
				buttonLoadingState = true;
				isLoggingIn ? logIn() : signUp();
			}}
			loading={buttonLoadingState}
			disabled={!browser || actionButtonDisabled}
			type="submit"
			class="mt-4 w-full">{isLoggingIn ? m.login_button() : m.signup_button()}</Button>

		<a
			onclick={_ => (isLoggingIn = !isLoggingIn)}
			href="##"
			class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
			{isLoggingIn ? m.signup_instead() : m.login_instead()}
		</a>
	{/if}
</div>

<div
	class="m-auto mt-12 w-fit"
	data-sitekey="0x4AAAAAABiGbbOhSUc5vWl9"
	data-theme="dark"
	id="turnstile-container">
</div>
