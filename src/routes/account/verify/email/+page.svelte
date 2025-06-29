<script lang="ts">
	import { redirectToLogin } from "$lib";
	import Holder from "$lib/components/Holder.svelte";
	import { onMount } from "svelte";
	import { m } from "../../../../paraglide/messages";
	import { CodeError, UserError, verifyEmail } from "../../../../serverContactor";
	let doneVerifying: boolean = $state(false);
	let valid: boolean = $state(false);

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);

		verifyEmail(urlParams.get("code") || "undefined")
			.catch(err => {
				if (err instanceof CodeError) console.error("Code is invalid");
				if (err instanceof UserError) console.error("User does not exist");
				valid = false;
				doneVerifying = true;
				throw new Error("Verification failed!");
			})
			.then(_ => {
				valid = true;
				doneVerifying = true;
			});
	});

	$effect(() => {
		if (valid) redirectToLogin(200, 2);
	});
</script>

<Holder>
	<h1>{m.email_verif_title()}</h1>
	<br />
	<h2>
		{#if !doneVerifying}
			{m.code_verif_loading()}
		{:else if !valid}
			{m.code_verif_loading_wrong()}
		{:else if valid}
			{m.code_verif_loading_success()}
		{/if}
	</h2>
	{#if doneVerifying}
		<p>
			{#if valid}
				{m.code_verif_loading_success_desc()}
			{:else}
				{m.code_verif_loading_wrong_desc()}
			{/if}
		</p>
	{/if}
</Holder>
