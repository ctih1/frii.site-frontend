<script lang="ts">
	import { browser } from "$app/environment";
	import consola from "consola";
	import MaterialSymbolsLock from "~icons/material-symbols/lock";
	import { getStatus } from "../../serverContactor";
	let height: number;
	let loaded: boolean = false;
	let danger: boolean = false;

	let message: string;
	getStatus()
		.catch(err => {
			consola.error(err);
			danger = true;
			message = "We are experiencing server difficulties.";
		})
		.then(status => {
			if (status["message"]) {
				consola.info("Recieved message on server");
				hidden = false;
				danger = true;
				message = status["message"];
			}
		});
	loaded = true;

	let hidden: boolean = false;

	function calcIsHidden(): boolean {
		if (!browser) {
			return false;
		}
		hidden =
			((localStorage.getItem("notification-hidden") ?? false) as boolean) &&
			localStorage.getItem("notification-hidden-message") === message;
		return hidden;
	}

	calcIsHidden();
</script>

{#if loaded && danger && !hidden}
	<div bind:clientHeight={height} class="bar">
		<MaterialSymbolsLock />
		<p>{message}</p>

		<a
			on:click={() => {
				localStorage.setItem("notification-hidden", "true");
				localStorage.setItem("notification-hidden-message", message);
				hidden = true;
			}}>X</a>
	</div>
{/if}

<style>
	.bar {
		display: flex;
		align-items: center;
		background-color: var(--primary);
		min-width: 100vw;
		width: 100%;
		top: 0px;
		left: 0px;
	}
	.bar * {
		color: white;
	}
	a {
		cursor: pointer;
		margin-left: auto;
		margin-right: 2em;
		font-size: 1em;
	}
</style>
