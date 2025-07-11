<script lang="ts">
	import { redirectToLogin } from "$lib";
	import Button from "$lib/components/Button.svelte";
	import Holder from "$lib/components/Holder.svelte";
	import { m } from "../../../../paraglide/messages";
	import { CodeError, UserError, verifyDeletion } from "../../../../serverContactor";

	let doneVerifying: boolean = $state(false);
	let valid: boolean = $state(false);
	let clicked: boolean = $state(false);

	function confirmDeletion() {
		const urlParams = new URLSearchParams(window.location.search);

		verifyDeletion(urlParams.get("code") || "undefined")
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
	}

	$effect(() => {
		if (valid) redirectToLogin(200, 3);
		if (clicked) confirmDeletion();
	});
</script>

<Holder>
	<h1 class="text-2xl font-semibold">{m.deletion_verif_title()}</h1>
	<br />
	{#if !clicked}
		<p>{m.account_del_desc()}</p>
		<ol>
			<li>{m.account_del_steps_1()}</li>
			<li>{m.account_del_steps_2()}</li>
			<li>{m.account_del_steps_3()}</li>
			<li>{m.account_del_steps_4()}</li>
		</ol>
		<Button on:click={_ => (clicked = true)} args="danger padding"
			>{m.account_del_agree()}</Button>
	{/if}
	<h2>
		{#if !doneVerifying && clicked}
			{m.code_verif_loading()}
		{:else if !valid && clicked && doneVerifying}
			{m.code_verif_loading_wrong()}
		{:else if valid && clicked && doneVerifying}
			{m.account_verif_loading_success()}
		{/if}
	</h2>
	{#if doneVerifying}
		<p>
			{#if valid}
				{m.account_verif_loading_success_desc()}
			{:else}
				{m.code_verif_loading_wrong_desc()}
			{/if}
		</p>
	{/if}
</Holder>
