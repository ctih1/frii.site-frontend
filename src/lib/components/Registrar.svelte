<script lang="ts">
	import Cookies from "js-cookie";
	import { getAuthToken } from "$lib";

	import Button from "./Button.svelte";
	import { onMount } from "svelte";
	import Dropdown from "./Dropdown.svelte";
	import { ServerContactor } from "../../serverContactor";
	import { createEventDispatcher } from "svelte";

	let dispatch = createEventDispatcher();
	let authToken: string | null;
	let serverContactor: ServerContactor;
	onMount(() => {
		authToken = getAuthToken();
		serverContactor = new ServerContactor(authToken, localStorage.getItem("server_url"));
	});
	let domainInput: string;
	let selectedType: string = "A";
</script>

<form>
	<div class="button-container">
		<Dropdown
			on:optionchange={event => (selectedType = event.detail)}
			disabled={false}
			args={"primary"}
			options={["A", "CNAME", "NS", "TXT"]}
			defaultValue={"A"}></Dropdown>
	</div>
	<input bind:value={domainInput} placeholder="domain" />
	{#if selectedType !== "TXT"}
		<div style="width: 25%; min-width:55px;">
			<input style="width: 100%; min-width:55px;" disabled value=".frii.site" />
		</div>
	{/if}
	<div class="button-container">
		<Button
			on:click={() => dispatch("click", { domain: domainInput, type: selectedType })}
			args={"fill"}><span class="material-symbols-outlined">search</span></Button>
	</div>
</form>

<style>
	form {
		display: flex;
		flex-direction: row;
		height: 2em;
	}
	form * {
		margin-left: 0.25em;
		margin-right: 0.25em;
	}
	.button-container {
		width: 5em;
	}
</style>
