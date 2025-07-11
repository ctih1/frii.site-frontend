<script lang="ts">
	import { AuthError, CodeError, MFAError, recoverMfaCode, UserError } from "$lib";
	import Holder from "$lib/components/Holder.svelte";
	import Loader from "$lib/components/Loader.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { m } from "../../../../paraglide/messages";

	let username: string = $state("");
	let password: string = $state("");
	let backupCode: string = $state("");

	let modal: Modal;
	let loader: Loader;

	function sendRemoval() {
		loader.show();
		recoverMfaCode(username, password, backupCode)
			.catch(error => {
				loader.hide();
				if (error instanceof AuthError || error instanceof UserError) {
					modal.open(m.mfa_recovery_fail(), m.login_failed_description());
				} else if (error instanceof CodeError) {
					modal.open(m.code_verif_loading_wrong(), m.mfa_wrong_backup_code());
				} else if (error instanceof MFAError) {
					modal.open(m.mfa_already_disabled(), "");
				} else {
					modal.open(m.unhandled_error(), m.generic_fail_description());
				}
				throw new Error("Failed to remove 2FA");
			})
			.then(_ => {
				loader.hide();
				modal.open(m.mfa_disabled_message(), "");
			});
	}
</script>

<Modal bind:this={modal} description="" title="" options={["Continue"]}></Modal>
<Loader bind:this={loader} />
<Holder>
	<h1 class="text-2xl font-semibold">{m.mfa_recovery()}</h1>

	<form class="space-y-2">
		<Input type="text" placeholder="Username" bind:value={username} />
		<Input type="password" placeholder="Password" bind:value={password} />
		<Input type="text" placeholder="Backup code" bind:value={backupCode} />

		<Button onclick={_ => sendRemoval()}>
			{m.mfa_recovery_send()}
		</Button>
	</form>
	<a class="support-tip" href="mailto:contact@frii.site">{m.mfa_unable_to_login()}</a>
</Holder>

<style>
	form {
		display: flex;
		flex-direction: column;
		height: fit-content;
	}

	.support-tip {
		margin-top: 4em;
		font-size: small;
	}
</style>
