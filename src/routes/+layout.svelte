<script lang="ts">
	import { navigating } from "$app/stores";
	import Ads from "$lib/components/Ads.svelte";
	import Analytics from "$lib/components/Analytics.svelte";
	import Button from "$lib/components/Button.svelte";
	import Header from "$lib/components/Header.svelte";
	import Holder from "$lib/components/Holder.svelte";
	import { Toaster } from "$lib/components/ui/sonner";
	import "$lib/nprogress.css";
	import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
	import NProgress from "nprogress";
	import { onMount } from "svelte";
	import "../app.css";

	let { children } = $props();
	let userRespectsPrivacyInsane = $state(false);
	let userDoesntCareAndWantsAdblock = $state(false);

	NProgress.configure({
		minimum: 0.55,
		trickle: true,
		trickleSpeed: 200
	});

	$effect(() => {
		if ($navigating) {
			NProgress.start();
		}

		if (!$navigating) {
			NProgress.done();
			localStorage.setItem("views", (Number(localStorage.getItem("views")) + 1).toString());
		}
	});

	onMount(() => {
		polyfillCountryFlagEmojis();
		userDoesntCareAndWantsAdblock = localStorage.getItem("adblock-warn-surpress") !== null;

		if (!userDoesntCareAndWantsAdblock) {
			fetch("https://mc.yandex.ru/metrika/tag.js")
				.then(() => {
					userRespectsPrivacyInsane = false;
				})
				.catch(() => {
					userRespectsPrivacyInsane = true;
				});
		}
	});

	function userDoesntWantToSupportUs() {
		// :(
		localStorage.setItem("adblock-warn-surpress", "yes");
		userDoesntCareAndWantsAdblock = true;
	}
</script>

{#if userRespectsPrivacyInsane && !userDoesntCareAndWantsAdblock}
	<Holder>
		<h1>Hello dear Adblock enthusiast</h1>
		<p>
			Looks like you're using an adblocker. That's okay. Press 'Ignore' if you don't want to
			support us.
		</p>
		<div class="holder" style="height: 2em;">
			<Button args="padding" on:click={() => userDoesntWantToSupportUs()}>Ignore</Button>
		</div>
	</Holder>
{/if}
<Toaster />
<Header />
<Analytics />
<Ads></Ads>
<svelte:head></svelte:head>
<main>
	{@render children()}
</main>

<style>
	@font-face {
		font-family: "Inter";
		src: url("/fonts/InterVariable.woff2") format("woff2");
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}

	:global(*) {
		font-family: "Twemoji Country Flags", "Inter", sans-serif;
	}

	:global(a) {
		color: var(--color-primary);
	}

	:global(body) {
		overflow-x: hidden;
	}
</style>
