<script lang="ts">
	import { browser, dev } from "$app/environment";
	import { onMount } from "svelte";

	import Blur from "$lib/components/Blur.svelte";
	import Button from "$lib/components/Button.svelte";
	import Holder from "$lib/components/Holder.svelte";
	import Loader from "$lib/components/Loader.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Placeholder from "$lib/components/Placeholder.svelte";
	import Section from "$lib/components/Section.svelte";
	import Switch from "$lib/components/Switch.svelte";

	import QR from "@svelte-put/qr/svg/QR.svelte";

	import { createFile, getAuthToken, redirectToLogin } from "$lib";
	import {
		AuthError,
		CodeError,
		ConflictError,
		ServerContactor,
		UserError
	} from "../../../serverContactor";

	import copy from "clipboard-copy";
	import Cookies from "js-cookie";
	import { UAParser } from "ua-parser-js";
	import { m } from "../../../paraglide/messages";

	interface Session {
		hash: string;
		user_agent: string;
		ip: string;
		expire: number;
	}

	interface invite {
		code: string;
		used: boolean;
		used_by: string | null;
		shown: boolean;
	}

	let loader: Loader;
	let serverContactor: ServerContactor;
	let modal: Modal;
	let noConfirm: boolean = true;
	let sessions: Session[] = [];
	let blurElement: Blur;
	let emailE: string;
	let usernameE: string;
	let loaded: boolean = false;
	let verified: boolean = false;
	let maxDomains = 0;
	let wildcards = false;
	let admin = false;
	let vuln = false;
	let monitoring = false;
	let invites: invite[] = [];

	let mfaWaitingForVerification: boolean = false;
	let mfaIsVerified: boolean = false;
	let mfaUrl: string = "";
	let mfaVerificationCode: string = "";
	let backupCodes: string[] = [];
	let isDeletingMfa: boolean = false;
	let isUsingBackupCodes: boolean = false;

	let backupCode: string = "";
	let mfaCode: string = "";

	let allowBetaTesting: boolean = false;
	if (browser) {
		if (!localStorage.getItem("logged-in")) {
			redirectToLogin(-1);
		}
		allowBetaTesting = Boolean(localStorage.getItem("allow-testing")) ?? false;
	}
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
				emailE = m.account_email({ email: data["email"] });
				usernameE = m.account_username({ username: data["username"] });
				loaded = true;
				verified = data["verified"];
				//@ts-ignore
				maxDomains = data["permissions"]["max-domains"] ?? 4;
				wildcards = data["permissions"]["wildcards"] ?? false;
				admin = data["permissions"]["admin"] ?? false;
				vuln = data["permissions"]["reports"] ?? false;
				monitoring = data["permissions"]["userdetails"] ?? false;
				mfaIsVerified = data["mfa_enabled"];

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
		loader.show(m.mfa_loading());
		serverContactor
			.createMfaCode()
			.catch(error => {
				loader.hide();
				if (error instanceof AuthError) {
					redirectToLogin(460);
				}
				if (error instanceof ConflictError) {
					modal.open("", m.account_mfa_setup_exists());
				}
				throw new Error("Failed to begin 2fa setup");
			})
			.then(data => {
				mfaWaitingForVerification = true;
				mfaUrl = data?.app_link!;
				backupCodes = data?.backup_codes!;
				loader.hide();
			});
	}

	function verifyMfa(code: string) {
		loader.show(m.mfa_verification_loader());
		serverContactor
			.verifyMfaCode(code)
			.catch(error => {
				loader.hide();
				if (error instanceof AuthError) {
					redirectToLogin(460);
				}
				if (error instanceof CodeError) {
					modal.open(m.code_verif_loading_wrong(), m.mfa_fail_hint());
					throw new Error("Code already used");
				}
				if (error instanceof ConflictError) {
					console.error(
						"User has already verified code. user should have not gotten to this point again"
					);
				}
				modal.open(m.unhandled_error(), m.generic_fail_description());
				throw new Error("Failed to verify code");
			})
			.then(_ => {
				loader.hide();
				mfaIsVerified = true;
			});
	}

	function removeMfa(code?: string, backupCode?: string) {
		loader.show(m.mfa_remove_load());
		serverContactor
			.deleteMfaCode(
				isUsingBackupCodes ? undefined : mfaCode,
				isUsingBackupCodes ? backupCode : undefined
			)
			.catch(error => {
				loader.hide();
				if (error instanceof AuthError) {
					redirectToLogin(460);
				}
				if (error instanceof CodeError) {
					modal.open(m.code_verif_loading_wrong(), m.mfa_fail_hint());
					throw new Error("Code already used");
				}
				modal.open(m.unhandled_error(), m.generic_fail_description());
				throw new Error("Failed to verify code");
			})
			.then(_ => {
				loader.hide();
				mfaWaitingForVerification = false;
				mfaIsVerified = false;
				isDeletingMfa = false;

				modal.open(m.mfa_disabled_message(), "");
			});
	}

	function createInvite() {
		loader.show("Creating invite...", "This shouldn't take long");
		serverContactor
			.createInvite()
			.catch(err => {
				loader.hide();
				if (err instanceof AuthError) {
					redirectToLogin(460);
				}
				if (err instanceof ConflictError) {
					modal.open(m.account_invite_fail(), m.account_invite_fail_usage_description());
				} else {
				}
				throw new Error("Failed to create invite");
			})
			.then(response => {
				loader.hide();
				modal.open(
					m.account_invite_success(),
					m.account_invite_success_desc({
						link: `https://www.frii.site/account?invite=${response["code"]}`
					})
				);
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
		if (noConfirm) {
			modal.open(m.account_delete_confirm(), m.acount_delete_confirm_description(), 10, [
				m.cancel_modal(),
				m.continue_modal()
			]);
			noConfirm = false;
			return;
		}
		serverContactor
			.deleteAccount()
			.catch(err => {
				if (err instanceof AuthError) redirectToLogin(460);
				modal.open(m.account_deletion_fail(), m.account_deletion_fail_description());
				throw new Error("Failed to delete account");
			})
			.then(_ => {
				modal.open(m.account_check_email(), m.account_check_email_description());
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
		loader.show(undefined, m.account_manage_sessions_delete_loader());
		serverContactor
			.logOut(sessionHash)
			.catch(err => {
				if (err instanceof UserError) console.error("Session with that ID does not exist");
				if (err instanceof AuthError) redirectToLogin(460);
				throw Error("Failed to delete session");
			})
			.then(_ => {
				loader.hide();
				sessions = sessions.filter(el => {
					return el.hash !== sessionHash;
				});
				sessions = [...sessions];
			});
	}
</script>

<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
<Blur bind:this={blurElement} />
<Loader bind:this={loader} />
<Holder>
	<h1>{m.account_management()}</h1>
	<Section title={m.account_details()} id="details">
		<div class="details">
			{#if loaded}
				<h3 style="display: flex; align-items:center; width: fit-content;">
					{emailE}{#if verified}<verified style="margin-left: 0.5em;"
							><span class="material-symbols-outlined">check</span></verified
						>{/if}
				</h3>
				<h3 id="username">
					{usernameE}
				</h3>
				<div class="permission">
					<span class="material-symbols-outlined">lock</span>
					<p>
						{m.dashboard_permission_domains()}:
						<strong>{maxDomains}</strong>
					</p>
				</div>
				{#if wildcards}
					<div class="permission">
						<span class="material-symbols-outlined">asterisk</span>
						<p>
							{m.dashboard_permission_wildcards()}:
							<strong>{wildcards}</strong>
						</p>
					</div>
				{/if}
				{#if admin}
					<div class="permission">
						<span class="material-symbols-outlined">shield_person</span>
						<p>
							{m.dashboard_permission_admin()}:
							<strong>{admin}</strong>
						</p>
					</div>
				{/if}
				{#if vuln}
					<div class="permission">
						<span class="material-symbols-outlined">handyman</span>
						<p>
							{m.dashboard_permission_vulnerabilities()}:
							<strong>{vuln}</strong>
						</p>
					</div>
				{/if}
				{#if monitoring}
					<div class="permission">
						<span class="material-symbols-outlined">groups</span>
						<p>
							{m.dashboard_permission_monitoring()}:
							<strong>{monitoring}</strong>
						</p>
					</div>
				{/if}
			{:else}
				<h3 style="height: 1em; width:20vw;"><Placeholder /></h3>
				<h3 style="height: 1em; width:20vw;"><Placeholder /></h3>
			{/if}
		</div>
	</Section>
	<h1>{m.account_manage_account()}</h1>
	<Section title={m.account_manage()} id="manage">
		{#if browser}
			<div class="switch">
				<p>{m.account_domain_del_cooldown()}</p>
				<Switch
					initial={(localStorage.getItem("del-count") ?? "false") == "true"}
					on:change={event => {
						localStorage.setItem("del-count", event.detail);
					}} />
			</div>
			<div class="buttons">
				<div>
					{#if mfaIsVerified}
						<Button on:click={() => (isDeletingMfa = true)} args={"padding danger"}
							>{m.account_disable_mfa()}</Button>
					{:else}
						<Button on:click={() => mfaSetup()} args={"padding"}
							>{m.account_enable_mfa()}</Button>
					{/if}
					{#if isDeletingMfa}
						<div class="mfa-delete-wrapper">
							{#if isUsingBackupCodes}
								<div></div>
								<div class="mfa-wrapper">
									<input
										bind:value={backupCode}
										class="mfa-input"
										placeholder="xxxxxxxx" />
									<a onclick={_ => (isUsingBackupCodes = !isUsingBackupCodes)}>
										{m.mfa_use_code()}</a>
								</div>
							{:else}
								<div class="mfa-wrapper">
									<input
										bind:value={mfaCode}
										class="mfa-input"
										type="number"
										placeholder="000000" />
									<a onclick={_ => (isUsingBackupCodes = !isUsingBackupCodes)}>
										{m.mfa_use_backup()}</a>
								</div>
							{/if}
							<div class="mfa-button">
								<Button on:click={() => removeMfa()} args={"padding danger"}
									>{m.account_disable_mfa()}</Button>
							</div>
						</div>
					{/if}
					{#if mfaWaitingForVerification}
						{#if !mfaIsVerified}
							<h1>{m.mfa_verify_introduction()}</h1>
							{#key mfaUrl}
								<p>{m.mfa_qr_guide()}</p>
								<div class="mfa-qr-wrapper">
									<QR data={mfaUrl} />
								</div>
								<a href={mfaUrl}>{m.mfa_alternate_link_hint()}</a>

								<h2>{m.mfa_verification_step()}</h2>
								<input
									bind:value={mfaVerificationCode}
									class="mfa-input"
									type="number"
									placeholder="000000" />
								<div class="mfa-button">
									<Button
										on:click={_ => verifyMfa(mfaVerificationCode)}
										args={"fill padding"}>{m.mfa_verify_button()}</Button>
								</div>
							{/key}
						{:else}
							<h1>{m.mfa_success()}</h1>
							<h2>{m.mfa_backup_codes()}</h2>
							<ul>
								{#each backupCodes as code}
									<li>{code}</li>
								{/each}
							</ul>
							<p>
								{m.mfa_backup_warning()}
							</p>
						{/if}
					{/if}
				</div>
				<div>
					<Button on:click={() => gpdrData()} args={"padding"}
						>{m.account_download_data()}</Button>
				</div>
				<div>
					<Button on:click={() => logOut()} args={"padding danger"}
						>{m.account_log_out()}</Button>
				</div>

				<div class="danger">
					<Button args={"danger padding"} on:click={() => handleDelete()}
						>{m.account_delete_account()}</Button>
				</div>
			</div>
		{/if}
	</Section>

	{#if invites.length > 0}
		<Section title="Invites" id="invites">
			{#if browser}
				{#each invites as invite, index}
					{@const minres =
						Math.min(window.innerHeight, window.innerWidth) /
						(window.innerHeight > window.innerWidth ? 1.5 : 3)}
					{@const showQRCode = false}
					<div class="session invite">
						<h3>
							<a href="https://www.frii.site/account?invite={invite.code}"
								>Invite #{index + 1}
							</a>
						</h3>

						<Button
							args="padding"
							on:click={_ =>
								copy(`https://www.frii.site/account?invite=${invite.code}`)}
							>Copy to clipboard</Button>

						<p>Used: <b>{invite.used ? "Yes" : "No"}</b></p>
						{#if invite.used}
							<p style="word-break: break-all; width: {minres}px">
								Used by: <b>{invite.used_by}</b>
							</p>
						{/if}
						<Button args="padding" on:click={() => (invite.shown = !invite.shown)}
							>{m.account_show_invite_qr()}</Button>
						{#if invite.shown}
							<div
								class="h"
								style="display: flex; width: 100%; justify-content:center">
								<QR
									version="H"
									data="https://www.frii.site/account?invite={invite.code}"
									shape="circle"
									logo="https://www.frii.site/favicon.svg"
									width={minres}
									height={minres} />
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</Section>
	{/if}

	<Section title={m.account_manage_sessions()} id="sessions">
		{#each sessions as session}
			{@const parser = new UAParser(session.user_agent)}
			<div class="session">
				<h3 class="session-header">
					<span class="material-symbols-outlined">
						{#if parser.getDevice().type === "mobile"}
							smartphone
						{:else}
							desktop_windows
						{/if}
					</span>
					{parser.getOS().name ?? "Unknown OS"}
					{parser.getOS().version ?? ""} - {parser.getBrowser().name ?? "Unknown browser"}
					{parser.getBrowser().version ?? ""}
				</h3>
				<p class="ip">{session.ip}</p>
				<p style="display: flex; align-items: center;">
					<span class="material-symbols-outlined">update</span>Expires: {new Date(
						session.expire * 1000
					).toUTCString()}
				</p>
				<Button args="danger" on:click={() => deleteSession(session.hash)}>Remove</Button>
			</div>
		{/each}
	</Section>
</Holder>

<Modal
	bind:this={modal}
	on:secondary={() => handleDelete()}
	options={[m.continue_modal()]}
	title={""}
	description={""}></Modal>

<style>
	.buttons div {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}
	.switch {
		align-items: center;
		display: flex;
		flex-direction: row;
	}
	.switch * {
		width: fit-content;
	}
	.switch p {
		margin-right: 1em;
	}
	verified {
		align-items: center;
		justify-content: center;
		display: flex;
		background-color: var(--primary);
		border-radius: 50%;
		height: 1.5em;
		width: 1.5em;
	}
	verified span {
		color: white;
	}
	#username {
		overflow-wrap: break-word;
		word-break: break-all;
	}
	.permission {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.session {
		width: fit-content;
		border-radius: 0.5em;
		padding: 0.5em;
		margin-top: 1em;
		margin-bottom: 1em;
		background-color: var(--secondary-color);
	}
	.session-header {
		display: flex;
		align-items: center;
		margin-top: 0px;
		margin-bottom: 0px;
	}
	.ip {
		margin-top: 0px;
	}

	@media (orientation: portrait) {
		.invite {
			margin-left: auto;
			margin-right: auto;
			width: 90%;
		}

		.mfa-input {
			width: 100% !important;
		}
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

	.mfa-qr-wrapper {
		width: 50%;
		margin-right: auto;
		margin-left: auto;
	}

	.mfa-input {
		font-size: 32px;
		width: 10ch;
		font-family: "Inter", sans-serif;
		text-align: center;
		background-color: rgb(40, 40, 40);
		margin-bottom: 4px;
	}
	.mfa-button {
		height: 3em;
	}

	.mfa-wrapper {
		display: flex;
		flex-direction: column;
	}

	.mfa-wrapper a:hover {
		cursor: pointer;
	}

	.mfa-delete-wrapper {
		padding-bottom: 6em;
	}
</style>
