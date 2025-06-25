<script lang="ts">
	import { browser } from "$app/environment";

	import Button from "$lib/components/Button.svelte";
	import Holder from "$lib/components/Holder.svelte";
	import Modal from "$lib/components/Modal.svelte";

	import { redirectToLogin } from "$lib";
	import { m } from "../../paraglide/messages";
	import {
		CodeError,
		confirmPasswordChange,
		sendForgotCode,
		UserError
	} from "./../../../serverContactor";

	let generatingNew: boolean = false;
	let code: string | null = null;

	if (browser) {
		const params: URLSearchParams = new URLSearchParams(window.location.search);
		code = params.get("c");
		generatingNew = code !== null;
	}

	function handleButton(event: any) {
		if (generatingNew) {
			if (password !== cPassword) {
				modal.open(
					m.signup_password_not_match(),
					m.signup_password_not_match_description()
				);
				return;
			}

			confirmPasswordChange(code ?? "", password)
				.catch(err => {
					if (err instanceof CodeError)
						modal.open(
							m.account_recovery_fail(),
							m.account_recovery_fail_description()
						);
					if (err instanceof UserError) redirectToLogin(404);

					throw new Error("Failed to reset password");
				})
				.then(response => {
					modal.open(
						m.account_recovery_success(),
						m.account_recovery_success_description()
					);
				});
		} else {
			sendForgotCode(username)
				.catch(err => {
					if (err instanceof UserError) redirectToLogin(404);

					modal.open(
						m.account_recovery_start_fail(),
						m.account_recovery_start_fail_description()
					);
					throw new Error("Failed to send password reset");
				})
				.then(_ => {
					modal.open(m.account_recovery_sent(), m.account_recovery_sent_description());
				});
		}
	}

	let cPassword: string;
	let password: string;
	let username: string;

	let modal: Modal;
</script>

<Modal countdown={undefined} description="" title="" options={[m.modal_ok()]} bind:this={modal} />
<Holder>
	{#if generatingNew}
		<h1>{m.account_recovery_title()}</h1>
		<input bind:value={password} placeholder={m.password_placeholder()} />
		<input bind:value={cPassword} placeholder={m.confirm_password_placeholder()} />
	{:else}
		<h1>{m.account_recovery_title()}</h1>
		<p>{m.account_recovery_description()}</p>
		<input bind:value={username} placeholder={m.username_placeholder()} />
	{/if}
	<Button on:click={handleButton} args="fill padding margin-1em-top"
		>{m.security_report_submit()}</Button>
</Holder>

<style>
</style>
