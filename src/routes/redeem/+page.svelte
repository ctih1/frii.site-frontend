<script lang="ts">
	import { browser } from "$app/environment";
	import { AuthError, getAuthToken, redirectToLogin, ServerContactor } from "$lib";
	import Holder from "$lib/components/Holder.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import Loader from "$lib/components/ui/loader/loader.svelte";
	import { Confetti } from "svelte-confetti";
	import { m } from "../../paraglide/messages";

	let success: boolean | undefined = $state(undefined);
	let inputValue: string = $state("");
	let inputRequired: boolean = $state(false);

	if (browser) {
		let params = new URLSearchParams(window.location.search);

		if (!params.get("c")) {
			inputRequired = true;
		} else {
			redeem(params.get("c")!);
		}
	}

	function redeem(code: string) {
		inputRequired = false;
		let serverContactor = new ServerContactor(getAuthToken() ?? "");
		serverContactor
			.redeemCode(code)
			.catch(error => {
				if (error instanceof AuthError) {
					redirectToLogin(460);
				}

				inputRequired = true;
				success = false;

				return;
			})
			.then(_ => {
				success = true;
			});
	}
</script>

<Holder>
	{#if success === false}
		<div class="mb-8">
			<h1 class="text-2xl font-semibold">{m.activation_fail()}</h1>
			<p>{m.activation_fail_desc()}</p>
			<a href="mailto:support@frii.site">{m.activation_support_link()}</a>
		</div>
	{/if}
	{#if inputRequired}
		<h1 class="text-2xl font-semibold">{m.activation_title()}</h1>
		<p>{m.activation_guide()}</p>

		<div class="mt-4 space-y-2">
			<Label>{m.activation_code_label()}</Label>
			<Input bind:value={inputValue} placeholder="xxxxxxxxx" />
		</div>

		<Button onclick={_ => redeem(inputValue)} class="mt-2">Activate</Button>
	{:else if success === undefined}
		<h1 class="text-2xl font-semibold">{m.activation_loading()}</h1>
		<p>{m.loading()}</p>

		<div class="w-12">
			<Loader asForeground={true} />
		</div>
	{:else if success === true}
		<div class="absolute top-64 left-42">
			<Confetti
				colorArray={["#007bff"]}
				cone
				fallDistance={"60px"}
				amount={150}
				x={[-1.2, 1.2]} />
		</div>
		<h1 class="text-2xl font-semibold">{m.activation_success()}</h1>
		<p>{m.activation_thanks()}</p>
	{/if}
</Holder>
