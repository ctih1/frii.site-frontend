<script lang="ts">
	import { navigating } from "$app/stores";
	import { updateThemeBody } from "$lib";
	import Analytics from "$lib/components/Analytics.svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Button from "$lib/components/Button.svelte";
	import Header from "$lib/components/Header.svelte";
	import Holder from "$lib/components/Holder.svelte";
	import { Toaster } from "$lib/components/ui/sonner";
	import "$lib/nprogress.css";
	import { sidebarOpen } from "$lib/store";
	import consola from "consola";
	import NProgress from "nprogress";
	import { onMount } from "svelte";
	import MaterialSymbolsAccountCircle from "~icons/material-symbols/account-circle";
	import MaterialSymbolsFlagRounded from "~icons/material-symbols/flag-rounded";
	import MaterialSymbolsHomeRounded from "~icons/material-symbols/home-rounded";
	import MaterialSymbolsMenuBookRounded from "~icons/material-symbols/menu-book-rounded";
	import MaterialSymbolsTeamDashboard from "~icons/material-symbols/team-dashboard";
	import "../app.css";
	import { m } from "../paraglide/messages";
	import { localizeHref } from "../paraglide/runtime";

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
			consola.debug("Starting navigation");
			NProgress.start();
		}

		if (!$navigating) {
			$sidebarOpen = false;
			NProgress.done();
			consola.debug("Navigation done");

			localStorage.setItem("views", (Number(localStorage.getItem("views")) + 1).toString());
		}
	});

	onMount(() => {
		userDoesntCareAndWantsAdblock = localStorage.getItem("adblock-warn-surpress") !== null;

		if (!userDoesntCareAndWantsAdblock) {
			fetch("https://mc.yandex.ru/metrika/tag.js")
				.then(() => {
					userRespectsPrivacyInsane = false;
					consola.info("Adblock not detected");
				})
				.catch(() => {
					userRespectsPrivacyInsane = true;
					consola.info("Adblock detected");
				});
		}

		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", _ => {
			consola.info("Recieved theme update");
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				updateThemeBody("dark");
			} else {
				updateThemeBody("light");
			}
		});
	});

	function userDoesntWantToSupportUs() {
		// :(
		consola.info("User skipped adblock prompt");

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
<Header>
	<a class="flex flex-row text-xl font-medium" href={localizeHref("/")}
		><MaterialSymbolsHomeRounded />{m.dashboard_home()}</a>
	<a
		class="flex flex-row items-center text-xl font-medium"
		href={localizeHref("/dashboard")}
		data-sveltekit-preload-data="off"><MaterialSymbolsTeamDashboard />{m.dashboard_navbar()}</a>
	<a
		class="flex flex-row text-xl font-medium"
		href={localizeHref("/account/manage")}
		data-sveltekit-preload-data="off"
		><MaterialSymbolsAccountCircle />{m.dashboard_account()}</a>
	<a class="flex flex-row text-xl font-medium" href={localizeHref("/report")}
		><MaterialSymbolsFlagRounded />{m.dashboard_abuse()}</a>
	<a class="flex flex-row items-center text-xl font-medium" href="https://guides.frii.site"
		><MaterialSymbolsMenuBookRounded />{m.guides_link_navbar()}</a>
</Header>
<Banner />

<Analytics />

<svelte:head>
	<link
		rel="preload"
		as="font"
		href="/fonts/InterVariable.woff2"
		type="font/woff2"
		crossorigin="anonymous" />
</svelte:head>
<main>
	{@render children()}
</main>

<style>
	@font-face {
		font-family: "Inter";
		src: url("/fonts/InterVariable.woff2") format("woff2");
		font-weight: 100 600;
		font-style: normal;
		font-display: swap;
	}

	:global(*) {
		font-family: "Inter", sans-serif;
	}

	:global(a) {
		color: var(--color-primary);
	}

	:global(body) {
		overflow-x: hidden;
	}
</style>
