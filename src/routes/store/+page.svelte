<script lang="ts">
	import { getAuthToken } from "$lib";
	import Holder from "$lib/components/Holder.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Placeholder from "$lib/components/Placeholder.svelte";
	import ShopItem from "$lib/components/ShopItem.svelte";
	import { redirectToLogin } from "../../helperFuncs";
	import { m } from "../../paraglide/messages";
	import { ServerContactor } from "./../../serverContactor";

	let credits: number = 0;
	let sc = new ServerContactor(getAuthToken());
	let modal: Modal;
	let loaded: boolean = false;

	sc.getCredits().then(response => {
		if (response.status !== 200) {
			redirectToLogin(response.status);
		}
		response.json().then(data => {
			credits = data["credits"];
			loaded = true;
		});
	});

	function convertCredits() {
		sc.convertCredits().then(response => {
			if (response.status !== 200) {
				modal.open(
					"Something went wrong",
					"Something went wrong while converting domains!"
				);
			} else {
				modal.open("Success!", "Succesfully converted");
				credits -= 200;
			}
		});
	}
</script>

{#if loaded}
	<Modal title="" description="" options={["OK"]} bind:this={modal}></Modal>
	<Holder>
		<h1>{m.store_title()}</h1>
		<p>
			WARNING: This page is still in beta. The styling, way credits work, or item prices have
			not been determined yet.
		</p>
		<p style="display: flex; align-items: center;">
			{credits}
			<span style="color: var(--primary)" class="material-symbols-outlined">poker_chip</span>
		</p>
		<div class="shop">
			<ShopItem
				on:buy={() => convertCredits()}
				description={m.store_extra_domains_description()}
				price={200}>{m.store_extra_domains()}</ShopItem>
		</div>
	</Holder>
{:else}
	<Holder>
		<Placeholder />
		<Placeholder />
	</Holder>
{/if}

<style>
	.shop {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(auto, auto);
	}

	@media (orientation: portrait) {
		.shop {
			grid-template-columns: repeat(1, 1fr);
		}
	}
</style>
