<script lang="ts">
	import { dev } from "$app/environment";
	import { onMount } from "svelte";

	import { createFile, getAuthToken, redirectToLogin } from "$lib";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as InputOTP from "$lib/components/ui/input-otp/index.js";
	import {
		AuthError,
		CodeError,
		ConflictError,
		ServerContactor,
		UserError
	} from "../../../serverContactor";

	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import QR from "@svelte-put/qr/img/QR.svelte";
	import { REGEXP_ONLY_DIGITS } from "bits-ui";
	import Cookies from "js-cookie";
	import { toast } from "svelte-sonner";
	import { m } from "../../../paraglide/messages";

	interface Session {
		hash: string;
		user_agent: string;
		ip: string;
		expire: number;
	}

	interface Invite {
		code: string;
		used: boolean;
		used_by: string | null;
		shown: boolean;
	}

	let serverContactor: ServerContactor;

	let invites: Invite[] = $state([]);
	let sessions: Session[] = $state([]);

	let email: string = $state("");
	let username: string = $state("");

	let loaded: boolean = $state(false);

	let maxDomains: number = $state(0);
	let mfaIsVerified: boolean = $state(false);

	let mfaIsOn: boolean = $state(false);
	let backupCodes: string[] = $state([]);
	let mfaUrl: string = $state("");
	let mfaCode: string = $state("");
	let mfaInvalid: boolean = $state(false);
	let usingBackupCode: boolean = $state(false);

	let mfaButtonLoading: boolean = $state(false);

	let dialogOpen: boolean = $state(false);

	onMount(() => {
		serverContactor = new ServerContactor(getAuthToken(), localStorage.getItem("server_url"));

		serverContactor
			.getAccountSettings()
			.catch(error => {
				if (error instanceof AuthError) {
					redirectToLogin(460);
				}
			})
			.then(data => {
				if (!data) {
					throw Error("Data is not defined");
				}
				email = m.account_email({ email: data["email"] });
				username = m.account_username({ username: data["username"] });
				loaded = true;
				//@ts-ignore
				maxDomains = data["permissions"]["max-domains"] ?? 4;
				mfaIsOn = data["mfa_enabled"];

				let inviteObject = data["invites"];
				let sessionObject = data["sessions"];

				for (let i = 0; i < Object.entries(inviteObject).length; i++) {
					let name: string | undefined = Object.keys(inviteObject)[i];
					if (name === undefined) {
						continue;
					}
					invites.push({
						code: name,
						//@ts-ignore
						used: inviteObject[name]["used"],
						//@ts-ignore
						used_by: inviteObject[name]["used_by"],
						shown: false
					});
				}

				invites = [...invites];

				sessionObject.forEach(element => {
					sessions.push({
						expire: element["expire"],
						//@ts-ignore
						hash: element["_id"],
						ip: element["ip"],
						user_agent: element["user-agent"]
					});
				});

				sessions = [...sessions];
			});
	});

	function mfaSetup() {
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
		serverContactor
			.verifyMfaCode(code)
			.catch(error => {
				mfaButtonLoading = false;
				if (error instanceof AuthError) {
					redirectToLogin(460);
				}
				if (error instanceof CodeError) {
					// modal.open(m.code_verif_loading_wrong(), m.mfa_fail_hint());
					throw new Error("Code already used");
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

	function createInvite() {
		serverContactor
			.createInvite()
			.catch(err => {
				if (err instanceof AuthError) {
					redirectToLogin(460);
				}
				if (err instanceof ConflictError) {
					// modal.open(m.account_invite_fail(), m.account_invite_fail_usage_description());
				} else {
				}
				throw new Error("Failed to create invite");
			})
			.then(response => {
				// <				modal.open(
				// 					m.account_invite_success(),
				// 					m.account_invite_success_desc({
				// 						link: `https://www.frii.site/account?invite=${response["code"]}`
				// 					})
				// 				);>
				invites.push({
					code: response["code"],
					used: false,
					used_by: null,
					shown: false
				});
				invites = [...invites];
			});
	}

	function handleDelete() {
		// if (noConfirm) {
		// 	// modal.open(m.account_delete_confirm(), m.acount_delete_confirm_description(), 10, [
		// 	// 	m.cancel_modal(),
		// 	// 	m.continue_modal()
		// 	// ]);
		// 	noConfirm = false;
		// 	return;
		// }
		serverContactor
			.deleteAccount()
			.catch(err => {
				if (err instanceof AuthError) redirectToLogin(460);
				// modal.open(m.account_deletion_fail(), m.account_deletion_fail_description());
				throw new Error("Failed to delete account");
			})
			.then(_ => {
				// modal.open(m.account_check_email(), m.account_check_email_description());
			});
	}
	function gpdrData() {
		serverContactor.getGDPR().then(data => {
			createFile("data.json", JSON.stringify(data));
		});
	}
	function logOut() {
		serverContactor
			.logOut()
			.catch(err => {
				throw new Error(
					"Failed to delete session. Please file an issue report over on our github (ctih1/frii.site-frontend)"
				);
			})
			.then(_ => {
				Cookies.remove("auth-token", { secure: !dev });
				localStorage.removeItem("logged-in");
				localStorage.removeItem("auth-token");
				redirectToLogin(200);
			});
	}

	function deleteSession(sessionHash: string) {
		serverContactor
			.logOut(sessionHash)
			.catch(err => {
				if (err instanceof UserError) console.error("Session with that ID does not exist");
				if (err instanceof AuthError) redirectToLogin(460);
				throw Error("Failed to delete session");
			})
			.then(_ => {
				sessions = sessions.filter(el => {
					return el.hash !== sessionHash;
				});
				sessions = [...sessions];
			});
	}
</script>

<div class="account bg-card max-w-8xl mt-16 mr-auto ml-auto w-10/12 rounded-2xl p-6">
	<h1 class="text-3xl font-semibold">{m.account_management()}</h1>

	{#if loaded}
		<p>{email}</p>
		<h3 id="username">{username}</h3>
		<div class="permission">
			<span class="material-symbols-outlined">lock</span>
			<p>
				{m.dashboard_permission_domains()}:
				<strong>{maxDomains}</strong>
			</p>
		</div>
	{:else}
		<Skeleton class="h-32" />
	{/if}

	<div class="mt-8">
		<h2 class="text-2xl font-semibold">{m.account_manage_account()}</h2>
		{#if !loaded}
			<Skeleton class="h-16" />
		{/if}
		{#if mfaIsOn}
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
												class="h-16 w-16 text-2xl"
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
												class="h-16 w-16 text-2xl"
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
		<Button onclick={_ => gpdrData()}>Download GDPR</Button>
		<Button variant={"secondary"} onclick={_ => logOut()}>Log out</Button>
	</div>
</div>
