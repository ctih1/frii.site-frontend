<script lang="ts">
	import { dev } from "$app/environment";
	import { createFile, getAuthToken, redirectToLogin } from "$lib";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as InputOTP from "$lib/components/ui/input-otp/index.js";
	import MaterialSymbolsSmartphone from "~icons/material-symbols/smartphone";
	import {
		AuthError,
		CodeError,
		ConflictError,
		MFAError,
		ServerContactor
	} from "../../../serverContactor";
	import type { Session } from "./+page";

	import { Button } from "$lib/components/ui/button";
	import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import QR from "@svelte-put/qr/img/QR.svelte";
	import { REGEXP_ONLY_DIGITS } from "bits-ui";
	import Cookies from "js-cookie";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { fade } from "svelte/transition";
	import { UAParser } from "ua-parser-js";
	import MaterialSymbolsDesktopMac from "~icons/material-symbols/desktop-mac";
	import { m } from "../../../paraglide/messages";

	let serverContactor: ServerContactor;

	let { data } = $props();

	let mfaIsVerified: boolean = $state(false);
	let backupCodes: string[] = $state([]);
	let mfaUrl: string = $state("");
	let mfaCode: string = $state("");
	let mfaInvalid: boolean = $state(false);
	let usingBackupCode: boolean = $state(false);
	let deleteAccountChecked: boolean = $state(false);

	let mfaButtonLoading: boolean = $state(false);

	let dialogOpen: boolean = $state(false);

	onMount(() => {
		serverContactor = new ServerContactor(getAuthToken());
	});

	function mfaSetup() {
		// get backup codes & setup authenticator
		serverContactor
			.createMfaCode()
			.catch(error => {
				if (error instanceof AuthError) {
					redirectToLogin(460);
				}
				if (error instanceof ConflictError) {
					toast.error(m.account_mfa_setup_exists());
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
				}
				if (error instanceof CodeError) {
					// modal.open(m.code_verif_loading_wrong(), m.mfa_fail_hint());
					throw new Error("Invalid code");
				}
				if (error instanceof ConflictError) {
					console.error(
						"User has already verified code. user should have not gotten to this point again"
					);
				}
				// modal.open(m.unhandled_error(), m.generic_fail_description());
				throw new Error("Failed to verify code");
			})
			.then(_ => {
				mfaButtonLoading = false;
				toast.success("2FA enabled!", { duration: 9000 });
				mfaIsVerified = true;
			});
	}

	function removeMfa(code: string) {
		mfaInvalid = false;
		serverContactor
			.deleteMfaCode(usingBackupCode ? undefined : code, usingBackupCode ? code : undefined)
			.catch(error => {
				// loader.hide();
				mfaButtonLoading = false;
				mfaInvalid = true;
				if (error instanceof AuthError) {
					redirectToLogin(460);
				}
				if (error instanceof CodeError) {
					// modal.open(m.code_verif_loading_wrong(), m.mfa_fail_hint());
					throw new Error("Code already used");
				}
				// modal.open(m.unhandled_error(), m.generic_fail_description());
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
		serverContactor
			.logOut(session?.hash)
			.catch(err => {
				throw new Error(
					"Failed to delete session. Please file an issue report over on our github (ctih1/frii.site-frontend)"
				);
			})
			.then(_ => {
				if (!session) {
					Cookies.remove("auth-token", { secure: !dev });
					localStorage.removeItem("logged-in");
					localStorage.removeItem("auth-token");
					redirectToLogin(200);
				} else {
					session.loading = false;
					data.sessions = data.sessions.filter(sess => {
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
		<span class="material-symbols-outlined">lock</span>
		<p>
			{m.dashboard_permission_domains()}:
			<strong>{data.maxDomains}</strong>
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
							<Dialog.Title>Disable 2FA</Dialog.Title>
							<Dialog.Description>
								Please enter your 2FA or backup code
							</Dialog.Description>

							{#if usingBackupCode}
								<div class="space-y-2">
									<Label for="backup-code">Backup code</Label>
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
								>{#if usingBackupCode}Use 2FA code instead{:else}Use backup code
									instead{/if}</Button>
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
								variant={"destructive"}>Delete</Button>
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
								<Dialog.Description>Starting MFA setup</Dialog.Description>
							{:else}
								<Dialog.Title>Setup 2Fa</Dialog.Title>
								<Dialog.Description>
									Please scan the QR code below to get started
								</Dialog.Description>

								<QR backgroundFill="white" data={mfaUrl} />

								<Button href={mfaUrl} variant={"link"}>Or use this link</Button>

								<h2 class="text-xl font-semibold">
									Now enter the code from your authentication app
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
							{/if}

							{#if mfaIsVerified}
								<h2 class="text-xl font-semibold">
									Please copy these backup codes somewhere safe
								</h2>
								<ul class="list-disc [&>li]:ml-8">
									{#each backupCodes as code}
										<li>{code}</li>
									{/each}
								</ul>
							{/if}
						</Dialog.Header>

						<Dialog.Footer>
							<Button
								loading={mfaButtonLoading}
								onclick={_ => {
									mfaButtonLoading = true;
									verifyMfa(mfaCode);
								}}
								disabled={mfaCode.length != 6}>Enable 2FA</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			{/if}
			<Dialog.Root onOpenChange={open => (dialogOpen = open)} open={dialogOpen}>
				<Dialog.Trigger>
					<Button variant={"destructive"}>{m.account_delete_account()}</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>{m.account_delete_account()}</Dialog.Title>
						<Dialog.Description>
							Please enter your 2FA or backup code
						</Dialog.Description>

						{#if usingBackupCode}
							<div class="space-y-2">
								<Label for="backup-code">Backup code</Label>
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
							>{#if usingBackupCode}Use 2FA code instead{:else}Use backup code instead{/if}</Button>
					</Dialog.Header>

					<Dialog.Footer>
						<div class="space-y-2">
							<p class="text-sm">{m.acount_delete_confirm_description()}</p>
							<div class="flex space-x-2">
								<Checkbox bind:checked={deleteAccountChecked} id="understand" />
								<Label for="understand">I understand and want to continue</Label>
							</div>
						</div>
						<Button
							loading={mfaButtonLoading}
							onclick={_ => {
								mfaButtonLoading = true;
								handleDelete(mfaCode);
							}}
							disabled={!deleteAccountChecked ||
								(!usingBackupCode && mfaCode.length != 6) ||
								(usingBackupCode && mfaCode.length < 16)}
							variant={"destructive"}>Delete</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
			<Button onclick={_ => gpdrData()}>Download GDPR</Button>
			<Button variant={"secondary"} onclick={_ => logOut()}>Log out</Button>
		</div>
	</div>

	<div class="mt-4 space-y-4">
		{#each data.sessions as session}
			{@const ua = new UAParser(session.user_agent)}
			{@const expires = new Date(session.expire * 1000)}
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
							console.log("Click!");
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
