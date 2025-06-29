<script lang="ts">
	import { browser } from "$app/environment";
	import {
		AuthError,
		CodeError,
		getAuthToken,
		redirectToLogin,
		ServerContactor,
		UserError
	} from "$lib";
	import Button from "$lib/components/Button.svelte";
	import Holder from "$lib/components/Holder.svelte";
	import { m } from "../../../../paraglide/messages";

	let value = $state("");
	let json = $state("");
	let currentPosition: number = $state(-1);
	let userHasConencted: boolean = $state(false);
	let userWasVerified: boolean = $state(false);

	let serverContactor: ServerContactor;
	let intervalId: number = 0;

	if (browser) {
		serverContactor = new ServerContactor(getAuthToken());
	}

	function fetchQueueData() {
		serverContactor
			.getVercelQueue()
			.catch(err => {
				if (err instanceof AuthError) redirectToLogin(460);
				if (err instanceof CodeError) {
					userHasConencted = false;
					userWasVerified = true;
					clearInterval(intervalId);
				}
				if (err instanceof UserError) connectToQueue();
				throw new Error("Failed to get queue data1§");
			})
			.then(position => {
				currentPosition = Number(position);
			});
	}

	function connectToQueue() {
		console.log("connecting to queue");
		serverContactor.joinVercelQueue(value).catch(err => {
			alert("Failed to join queue");
			throw new Error("Failed to join queue");
		});

		userHasConencted = true;

		//@ts-ignore
		intervalId = setInterval(() => fetchQueueData(), 3000);
	}
</script>

<Holder>
	<h1>Vercel verification</h1>
	{#if userHasConencted}
		{#if currentPosition === -1}
			<p>{m.vercel_verification_queue_join()}</p>
		{:else if currentPosition === 0}
			<p>{m.vercel_verification_generic()}</p>
		{:else}
			<p>
				{m.vercel_verification_queue({ position: currentPosition })}
			</p>
		{/if}
	{:else if userWasVerified}
		<p>{m.vercel_verification_queue_over()}</p>
	{:else}
		<input
			bind:value={value}
			placeholder="vc-domain-verify=***.frii.site,********************" />
		<Button args="padding margin-1em-top" on:click={() => connectToQueue()}
			>{m.vercel_verification_queue_join_action_button()}</Button>
	{/if}
</Holder>

<style>
	input {
		height: 4em;
	}
</style>
