<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import {
		AuthError,
		CaptchaError,
		ConflictError,
		getAuthToken,
		login,
		MFAError,
		PermissionError,
		register,
		resendEmail,
		serverURL,
		setAuthToken,
		UserError
	} from "$lib";
	import favicon from "$lib/assets/favicon.svg";
	import { Button } from "$lib/components/ui/button/index";
	import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
	import InlineAlert from "$lib/components/ui/inline-alert/inline-alert.svelte";
	import * as InputOTP from "$lib/components/ui/input-otp/index.js";
	import { Input } from "$lib/components/ui/input/index";
	import { Label } from "$lib/components/ui/label/index";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { activeTheme } from "$lib/store";
	import { REGEXP_ONLY_DIGITS } from "bits-ui";
	import consola from "consola";
	import Cookies from "js-cookie";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { m } from "../../paraglide/messages";
	import { localizeHref } from "../../paraglide/runtime";

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

	let widgetId: string = "";

	// forces svelte to load the div before onMount
	let turnstileWidget: HTMLDivElement;

	let captchaToken: string = "";
	let captchaDone: boolean = $state(false);

	let accountNeedsEmailVerification: boolean = $state(false);
	let resendEmailClicked: boolean = $state(false);

	function validateEmail(email: string) {
		return !String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	}

	function resetTurnstile() {
		consola.debug("Resetting captcha");
		captchaDone = false;
		// @ts-ignore
		turnstile.reset(widgetId);
	}

	function logIn() {
		login(username, password, captchaToken, mfaCode ? mfaCode : undefined)
			.catch(error => {
				buttonLoadingState = false;
				errorTitle = m.login_failed();
				if (error instanceof AuthError || error instanceof UserError)
					errorDescription = m.login_failed_description();
				else if (error instanceof PermissionError) {
					errorDescription = m.login_failed_verify();
					accountNeedsEmailVerification = true;
				} else if (error instanceof MFAError) {
					if (!requiresMfa) {
						errorTitle = "";
						errorDescription = "";
						requiresMfa = true;
						resetTurnstile();
						return;
					} else {
						errorDescription = m.mfa_wrong_code_desc();
					}
				} else if (error instanceof CaptchaError) errorDescription = m.captcha_fail();
				else errorDescription = m.login_generic_error();
				consola.warn(errorDescription);

				resetTurnstile();
				throw new Error("Login failed");
			})
			.then(session => {
				// @ts-expect-error no types implemented for this
				const sessionId: string = session["auth-token"];
				window.gtag?.("event", "log_in");

				const date = new Date(Date.now() + 604800 * 1000).toUTCString();
				if (!getAuthToken()) {
					console.error("Browser did not accept cookies...");
				}
				Cookies.set("logged-in", "yes");
				setAuthToken(sessionId);
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
				buttonLoadingState = false;
				errorTitle = m.signup_fail();
				if (error instanceof ConflictError) errorDescription = m.signup_fail_username();
				if (error instanceof UserError) errorDescription = m.signup_fail_email();
				if (error instanceof CaptchaError) errorDescription = m.captcha_fail();

				resetTurnstile();
				consola.warn(errorDescription);
				throw new Error("Signup failed");
			})
			.then(_ => {
				buttonLoadingState = false;
				window.gtag?.("event", "sign_up");
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
			let container = document.getElementById("turnstile-container");

			if (container) {
				container.innerHTML = "";
			}
			// @ts-ignore
			widgetId = turnstile.render("#turnstile-container", {
				sitekey: "0x4AAAAAABiGbbOhSUc5vWl9",
				theme: $activeTheme,
				callback: function (token: string) {
					captchaToken = token;
					captchaDone = true;
					consola.info("Solved captcha");
				}
			});
		});

		if (data.referrerCode) {
			Cookies.set("referrer", data.referrerCode, { expires: 14 });
		}

		if (Number(data.statusCode) && Number(data.statusCode) !== 200) {
			consola.warn(`Login error ${data.statusCode}`);
			switch (Number(data.statusCode)) {
				case 460:
				case 465: {
					alertTitle = m.login_failed();
					alertDescription = m.login_fail_signout();
					break;
				}

				case 469: {
					errorTitle = m.login_failed();
					errorDescription = m.social_login_conflict();
					break;
				}
				default: {
					errorTitle = m.unhandled_error();
					errorDescription = m.login_generic_error();
					break;
				}
			}

			const url = page.url;
			url.searchParams.delete("c");
			history.pushState({ data }, "", url.href);
		}
	});

	$effect(() => {
		if (!captchaDone) {
			consola.warn("Captcha not done...");
			actionButtonDisabled = true;
			return;
		}

		if (isLoggingIn) {
			if (!username || !password) actionButtonDisabled = true;
			else actionButtonDisabled = false;

			consola.debug(`Checking login...: ${actionButtonDisabled}`);
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
	<link
		rel="preload"
		href="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
		as="script" />
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
</svelte:head>

<div class="login-holder bg-card m-auto mt-8 w-[100vw] max-w-[500px] rounded-lg p-8">
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
	{#if accountNeedsEmailVerification}
		<Button
			variant={"ghost"}
			class="mt-4"
			loading={resendEmailClicked}
			onclick={_ => {
				resendEmailClicked = true;
				resendEmail(username)
					.catch(_ => {
						resendEmailClicked = false;
						errorDescription = "Failed to send verification";
						throw new Error("Failed to send resend email");
					})
					.then(_ => {
						resendEmailClicked = false;
						alertTitle = m.login_failed_verify();
						alertDescription = m.login_failed_verify_description();
					});
			}}>{m.login_resend_email()}</Button>
	{/if}
	{#if requiresMfa}
		<div class="mfa-screen mt-12">
			<h2 class="text-2xl font-semibold">{m.login_mfa_required()}</h2>
			<p>{m.login_mfa_description()}</p>
			<form>
				<InputOTP.Root
					bind:value={mfaCode}
					class="m-auto mt-8 w-fit"
					maxlength={6}
					pattern={REGEXP_ONLY_DIGITS}>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells as cell (cell)}
								<InputOTP.Slot
									class="h-14 text-2xl"
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
			</form>

			<a class="text-sm" href={localizeHref("/account/recover/2fa")}
				>{m.mfa_disable_with_backup()}</a>
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
						<Label for="email">{m.login_email_label()}</Label>
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
								tabindex="-1"
								transition:fade={{ duration: 100 }}
								href={localizeHref("/account/recover/")}
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

			<Button
				onclick={() => {
					buttonLoadingState = true;
					isLoggingIn ? logIn() : signUp();
				}}
				loading={buttonLoadingState}
				disabled={!browser || actionButtonDisabled}
				type="submit"
				class="mt-4 w-full">{isLoggingIn ? m.login_button() : m.signup_button()}</Button>
		</form>

		<a
			onclick={_ => (isLoggingIn = !isLoggingIn)}
			href="##"
			class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
			{isLoggingIn ? m.signup_instead() : m.login_instead()}
		</a>
	{/if}
	{#if !requiresMfa}
		<Separator />
		<Button
			onclick={_ => {
				const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
				googleAuthUrl.searchParams.set(
					"client_id",
					"596305333437-5n6obnm72ir29vi3kier0csqb7redca2.apps.googleusercontent.com"
				);
				const redirectUrl = `${serverURL}/auth/google/callback`;

				googleAuthUrl.searchParams.set("redirect_uri", redirectUrl);
				googleAuthUrl.searchParams.set("response_type", "code");
				googleAuthUrl.searchParams.set("scope", "openid email profile");
				googleAuthUrl.searchParams.set(
					"state",
					JSON.stringify({
						url: window.origin,
						mode: "login",
						redirect: redirectUrl,
						referrer: Cookies.get("referrer")
					})
				);

				window.location.href = googleAuthUrl.toString();
			}}
			class="mt-2 w-full">{m.login_with_google()}</Button>
	{/if}
</div>

<div bind:this={turnstileWidget} class="m-auto mt-6 w-fit" id="turnstile-container">
	<p>Loading captcha..</p>
</div>
