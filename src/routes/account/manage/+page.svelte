<script lang="ts">
	import { dev } from "$app/environment";
	import { createFile, getAuthToken, redirectToLogin } from "$lib";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as InputOTP from "$lib/components/ui/input-otp/index.js";
	import MaterialSymbolsLockOutline from "~icons/material-symbols/lock-outline";
	import MaterialSymbolsSmartphone from "~icons/material-symbols/smartphone";
	import {
		AuthError,
		CodeError,
		ConflictError,
		MFAError,
		ServerContactor,
		serverURL
	} from "../../../serverContactor";
	import type { Session } from "./+page";

	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import QR from "@svelte-put/qr/img/QR.svelte";
	import { REGEXP_ONLY_DIGITS } from "bits-ui";
	import consola from "consola";
	import Cookies from "js-cookie";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { fade } from "svelte/transition";
	import { UAParser } from "ua-parser-js";
	import MaterialSymbolsDesktopMac from "~icons/material-symbols/desktop-mac";
	import { m } from "../../../paraglide/messages";
	import { localizeHref } from "../../../paraglide/runtime";

	let serverContactor: ServerContactor;

	let { data } = $props();
	let sessions: Session[] = $state(data.sessions);

	let mfaIsVerified: boolean = $state(false);
	let backupCodes: string[] = $state([]);
	let mfaUrl: string = $state("");
	let mfaCode: string = $state("");
	let mfaInvalid: boolean = $state(false);
	let usingBackupCode: boolean = $state(false);
	let deleteAccountChecked: boolean = $state(false);

	let mfaButtonLoading: boolean = $state(false);

	let dialogOpen: boolean = $state(false);
	let deleteOpen: boolean = $state(false);

	onMount(() => {
		serverContactor = new ServerContactor(getAuthToken() ?? null);
	});

	function mfaSetup() {
		consola.info("Starting MFA setup");
		// get backup codes & setup authenticator
		serverContactor
			.createMfaCode()
			.catch(error => {
				if (error instanceof AuthError) {
					redirectToLogin(460);
					return;
				}
				if (error instanceof ConflictError) {
					toast.error(m.account_mfa_setup_exists());
					return;
				}
				throw new Error("Failed to begin 2fa setup");
			})
			.then(data => {
				mfaUrl = data?.app_link!;
				backupCodes = data?.backup_codes!;
			});
	}

	function verifyMfa(code: string) {
		// verify that the user's authenticator app actually worked and scanned the qr properly
		serverContactor
			.verifyMfaCode(code)
			.catch(error => {
				mfaButtonLoading = false;
				if (error instanceof AuthError) {
					redirectToLogin(460);
					return;
				}
				if (error instanceof CodeError) {
					consola.warn("Invalid MFA code");
					toast.error(m.code_verif_loading_wrong(), {
						description: m.code_verif_loading_wrong_desc()
					});
					return;
				}
				if (error instanceof ConflictError) {
					consola.error("MFA code already exist. This shouldn't be able to happen");
				}
				// modal.open(m.unhandled_error(), m.generic_fail_description());
				throw new Error("Failed to verify code");
			})
			.then(_ => {
				mfaButtonLoading = false;
				toast.success(m.mfa_success(), { duration: 9000 });
				mfaIsVerified = true;
			});
	}

	function removeMfa(code: string) {
		mfaInvalid = false;
		serverContactor
			.deleteMfaCode(usingBackupCode ? undefined : code, usingBackupCode ? code : undefined)
			.catch(error => {
				// loader.hide();
				consola.warn("Failed to remove MFA");

				mfaButtonLoading = false;
				mfaInvalid = true;
				if (error instanceof AuthError) {
					redirectToLogin(460);
					return;
				}
				if (error instanceof CodeError) {
					consola.warn("Invalid MFA code while removing MFA");
					toast.error(m.code_verif_loading_wrong(), {
						description: m.mfa_fail_hint()
					});
					return;
				}

				toast.error(m.unhandled_error(), {
					description: m.generic_fail_description()
				});
				throw new Error("Failed to verify code");
			})
			.then(_ => {
				mfaIsVerified = false;
				mfaButtonLoading = false;
				dialogOpen = false;
				toast.success(m.mfa_disabled_message());
			});
	}

	function handleDelete(mfaCode: string) {
		// sends an account deletion email to the user
		serverContactor
			.deleteAccount(mfaCode)
			.catch(err => {
				consola.warn("Failed to send account deletion email");
				mfaButtonLoading = false;

				if (err instanceof AuthError) redirectToLogin(460);
				else if (err instanceof MFAError) toast.error(m.mfa_wrong_code_desc());
				else
					toast.error(m.account_deletion_fail(), {
						description: m.generic_fail_description()
					});
				throw new Error("Failed to delete account");
			})
			.then(_ => {
				mfaButtonLoading = false;
				toast.success(m.account_check_email(), {
					description: m.account_check_email_description(),
					duration: 9000
				});
			});
	}
	function gpdrData() {
		// We don't store that much data so we can just fetch it from the server
		serverContactor.getGDPR().then(data => {
			createFile("data.json", JSON.stringify(data));
		});
	}
	function logOut(session?: Session) {
		// If session isn't specified, the user is logging themselves out
		consola.info("Logging out a session");
		serverContactor
			.logOut(session?.hash)
			.catch(err => {
				throw new Error(
					"Failed to delete session. Please file an issue report over on our github (ctih1/frii.site-frontend)"
				);
			})
			.then(_ => {
				consola.info("Succesfully logged session out");
				if (!session) {
					Cookies.remove("auth-token", { secure: !dev });
					localStorage.removeItem("logged-in");
					localStorage.removeItem("auth-token");
					redirectToLogin(200);
				} else {
					session.loading = false;
					sessions = sessions.filter(sess => {
						return sess.hash !== session.hash;
					});
				}
			});
	}

	$effect(() => {
		usingBackupCode; // Since svelte5 doesnt let you declare dependencies $effect
		dialogOpen; // same with this
		mfaCode = "";
	});
</script>

<div class="account bg-card mt-16 mr-auto ml-auto w-11/12 max-w-5xl rounded-2xl p-6">
	<h1 class="text-3xl font-semibold">{m.account_hello_user({ user: data.username })}</h1>
	<p>{m.account_email({ email: data.email })}</p>
	<h3 id="username">{m.account_username({ username: data.username })}</h3>
	<div class="permission flex items-center">
		<MaterialSymbolsLockOutline />
		<p>
			{m.dashboard_permission_domains()}:
			<strong>{data.maxDomains}</strong>
		</p>
	</div>

	<div class="permission flex items-center">
		<MaterialSymbolsLockOutline />
		<p>
			{m.account_max_subdomains()}:
			<strong>{data.maxSubdomains}</strong>
		</p>
	</div>

	<div class="mt-8">
		<h2 class="text-2xl font-semibold">{m.account_manage_account()}</h2>
		<div class="buttons space-y-1">
			{#if data.mfaEnabled}
				<Dialog.Root onOpenChange={open => (dialogOpen = open)} open={dialogOpen}>
					<Dialog.Trigger>
						<Button variant={"destructive"}>{m.account_disable_mfa()}</Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>{m.mfa_recovery_send()}</Dialog.Title>
							<Dialog.Description>
								{m.mfa_login_description()}
							</Dialog.Description>

							{#if usingBackupCode}
								<div class="space-y-2">
									<Label for="backup-code">{m.mfa_use_backup()}</Label>
									<Input bind:value={mfaCode} id="backup-code" />
								</div>
							{:else}
								<InputOTP.Root
									bind:value={mfaCode}
									class="m-auto mt-8 w-fit"
									maxlength={6}
									pattern={REGEXP_ONLY_DIGITS}>
									{#snippet children({ cells })}
										<InputOTP.Group>
											{#each cells as cell (cell)}
												<InputOTP.Slot
													class="h-16 text-2xl"
													aria-invalid={mfaInvalid}
													cell={cell} />
											{/each}
										</InputOTP.Group>
									{/snippet}
								</InputOTP.Root>
							{/if}

							<Button
								onclick={_ => (usingBackupCode = !usingBackupCode)}
								variant={"ghost"}
								>{#if usingBackupCode}{m.mfa_use_code()}{:else}{m.mfa_use_backup()}{/if}</Button>
						</Dialog.Header>

						<Dialog.Footer>
							<Button
								loading={mfaButtonLoading}
								onclick={_ => {
									mfaButtonLoading = true;
									removeMfa(mfaCode);
								}}
								disabled={(!usingBackupCode && mfaCode.length != 6) ||
									(usingBackupCode && mfaCode.length < 16)}
								variant={"destructive"}>{m.mfa_recovery_send()}</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			{:else}
				<Dialog.Root onOpenChange={open => (dialogOpen = open)} open={dialogOpen}>
					<Dialog.Trigger>
						<Button onclick={_ => mfaSetup()}>{m.account_enable_mfa()}</Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							{#if !mfaUrl}
								<Dialog.Title>Please wait...</Dialog.Title>
								<Dialog.Description>{m.mfa_loading()}</Dialog.Description>
							{:else}
								<Dialog.Title>Setup 2Fa</Dialog.Title>
								{#if !mfaIsVerified}
									<Dialog.Description>
										{m.mfa_qr_guide()}
									</Dialog.Description>

									<QR backgroundFill="white" data={mfaUrl} />
									<Button href={mfaUrl} variant={"link"}
										>{m.mfa_alternate_link_hint()}</Button>

									<h2 class="text-xl font-semibold">
										{m.mfa_verification_step()}
									</h2>

									<InputOTP.Root
										bind:value={mfaCode}
										class="m-auto w-fit"
										maxlength={6}
										pattern={REGEXP_ONLY_DIGITS}>
										{#snippet children({ cells })}
											<InputOTP.Group>
												{#each cells as cell (cell)}
													<InputOTP.Slot
														class="h-16 text-2xl"
														aria-invalid={mfaInvalid}
														cell={cell} />
												{/each}
											</InputOTP.Group>
										{/snippet}
									</InputOTP.Root>
								{:else}
									<h2 class="text-xl font-semibold">
										{m.mfa_backup_warning()}
									</h2>
									<ul class="list-disc [&>li]:ml-8">
										{#each backupCodes as code}
											<li>{code}</li>
										{/each}
									</ul>
								{/if}
							{/if}
						</Dialog.Header>

						<Dialog.Footer>
							{#if !mfaIsVerified}
								<Button
									loading={mfaButtonLoading}
									onclick={_ => {
										mfaButtonLoading = true;
										verifyMfa(mfaCode);
									}}
									disabled={mfaCode.length != 6}>{m.account_enable_mfa()}</Button>
							{/if}
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			{/if}
			<Dialog.Root onOpenChange={open => (deleteOpen = open)} open={deleteOpen}>
				<Dialog.Trigger>
					<Button variant={"destructive"}>{m.account_delete_account()}</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>{m.account_delete_account()}</Dialog.Title>
						{#if data.mfaEnabled}
							<Dialog.Description>
								{m.mfa_login_description()}
							</Dialog.Description>

							{#if usingBackupCode}
								<div class="space-y-2">
									<Label for="backup-code">{m.mfa_use_backup()}</Label>
									<Input bind:value={mfaCode} id="backup-code" />
								</div>
							{:else}
								<InputOTP.Root
									bind:value={mfaCode}
									class="m-auto mt-8 w-fit"
									maxlength={6}
									pattern={REGEXP_ONLY_DIGITS}>
									{#snippet children({ cells })}
										<InputOTP.Group>
											{#each cells as cell (cell)}
												<InputOTP.Slot
													class="h-16 text-2xl"
													aria-invalid={mfaInvalid}
													cell={cell} />
											{/each}
										</InputOTP.Group>
									{/snippet}
								</InputOTP.Root>
							{/if}

							<Button
								onclick={_ => (usingBackupCode = !usingBackupCode)}
								variant={"ghost"}
								>{#if usingBackupCode}{m.mfa_use_code()}{:else}{m.mfa_use_backup()}{/if}</Button>
						{/if}
					</Dialog.Header>

					<Dialog.Footer>
						<div class="space-y-2">
							<p class="text-sm">{m.acount_delete_confirm_description()}</p>
							<div class="flex space-x-2">
								<Checkbox bind:checked={deleteAccountChecked} id="understand" />
								<Label for="understand">{m.account_del_agree()}</Label>
							</div>
						</div>
						<Button
							loading={mfaButtonLoading}
							onclick={_ => {
								mfaButtonLoading = true;
								handleDelete(mfaCode);
							}}
							disabled={!deleteAccountChecked ||
								(data.mfaEnabled &&
									((!usingBackupCode && mfaCode.length != 6) ||
										(usingBackupCode && mfaCode.length < 16)))}
							variant={"destructive"}>{m.account_delete_account()}</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
			{#if data.permissions.get("admin") === true}
				<Button onclick={_ => goto(localizeHref("/account/admin"))}>Admin dashboard</Button>
			{/if}
			{#if !data.googleLinked}
				<Button
					onclick={async () => {
						await serverContactor.getOAuthLinkingCode().then(data => {
							const googleAuthUrl = new URL(
								"https://accounts.google.com/o/oauth2/v2/auth"
							);
							googleAuthUrl.searchParams.set(
								"client_id",
								"596305333437-5n6obnm72ir29vi3kier0csqb7redca2.apps.googleusercontent.com"
							);
							const redirectUrl = `${serverURL}/auth/google/callback`;
							googleAuthUrl.searchParams.set("redirect_uri", redirectUrl);
							googleAuthUrl.searchParams.set("response_type", "code");
							googleAuthUrl.searchParams.set("scope", "openid email profile");

							console.log(data);
							googleAuthUrl.searchParams.set(
								"state",
								JSON.stringify({
									url: window.origin,
									mode: "link",
									"linking-code": data["code"],
									redirect: redirectUrl
								})
							);

							window.location.href = googleAuthUrl.toString();
						});
					}}>{m.link_google()}</Button>
			{/if}
			<Button onclick={_ => gpdrData()}>{m.account_download_data()}</Button>
			<Button onclick={_ => goto(localizeHref("/api/dashboard"))}
				>{m.account_api_dashboard_link()}</Button>
			<Button variant={"secondary"} onclick={_ => logOut()}>{m.account_log_out()}</Button>
		</div>
	</div>

	<div class="mt-4 space-y-4">
		{#each sessions as session}
			{@const ua = new UAParser(session.user_agent)}
			{@const expires = new Date(session.expires * 1000)}
			<div
				transition:fade={{ duration: 100 }}
				class="session bg-popover w-full max-w-96 rounded-xl p-4">
				<div class="device flex items-center">
					{#if ua.getDevice().type === "mobile"}
						<MaterialSymbolsSmartphone class="text-4xl" />
					{:else}
						<MaterialSymbolsDesktopMac class="text-4xl" />
					{/if}
					<h1 class="text-2xl font-semibold">
						{ua.getOS().name}
					</h1>
					<h2 class="ml-2 text-xl font-medium">
						{ua.getBrowser().name}
						{ua.getBrowser().version}
					</h2>
				</div>
				<p>
					Expires: {expires.toLocaleString()}
				</p>
				<div class="footer flex items-center justify-between">
					<Button
						loading={session.loading}
						onclick={_ => {
							session.loading = true;
							logOut(session);
						}}
						variant={"destructive"}>Log out</Button>
					<p class="text-right opacity-50">{session.ip}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
