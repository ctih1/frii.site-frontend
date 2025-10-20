<script lang="ts">
	import { navigating } from "$app/stores";
	import Analytics from "$lib/components/Analytics.svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Header from "$lib/components/Header.svelte";
	import { Toaster } from "$lib/components/ui/sonner";
	import "$lib/nprogress.css";
	import { sidebarOpen } from "$lib/store";
	import consola from "consola";
	import NProgress from "nprogress";
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
</script>

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
