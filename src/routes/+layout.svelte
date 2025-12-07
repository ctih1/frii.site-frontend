<script lang="ts">
	import { afterNavigate, beforeNavigate } from "$app/navigation";
	import Analytics from "$lib/components/Analytics.svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Header from "$lib/components/Header.svelte";
	import { Toaster } from "$lib/components/ui/sonner";
	import "$lib/nprogress.css";
	import { sidebarOpen } from "$lib/store";
	import consola from "consola";
	import NProgress from "nprogress";
	import type { Component } from "svelte";
	import MaterialSymbolsAccountCircle from "~icons/material-symbols/account-circle";
	import MaterialSymbolsCelebrationRounded from "~icons/material-symbols/celebration-rounded";
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

	afterNavigate(() => {
		$sidebarOpen = false;
		consola.debug("Navigation done");
		NProgress.done();

		localStorage.setItem("views", (Number(localStorage.getItem("views")) + 1).toString());
	});

	beforeNavigate(() => {
		consola.debug("Starting navigation");
		NProgress.start();
	});
</script>

{#snippet navbarLink(Icon: Component, href: string, text: string, preload: boolean = true)}
	{@const preloadValue = preload ? "hover" : "off"}

	<a
		class="hover:text-accent flex flex-row items-center justify-start gap-1.5 text-xl font-medium"
		href={href}
		data-sveltekit-preload-data={preloadValue}>
		<Icon />{text}
	</a>
{/snippet}

<Toaster />

<Header>
	{@render navbarLink(MaterialSymbolsHomeRounded, localizeHref("/"), m.dashboard_home())}
	{@render navbarLink(
		MaterialSymbolsTeamDashboard,
		localizeHref("/dashboard"),
		m.dashboard_navbar(),
		false
	)}
	{@render navbarLink(
		MaterialSymbolsAccountCircle,
		localizeHref("/account/manage"),
		m.dashboard_account(),
		false
	)}
	{@render navbarLink(MaterialSymbolsCelebrationRounded, localizeHref("/wrapped"), "Wrapped")}
	{@render navbarLink(MaterialSymbolsFlagRounded, localizeHref("/report"), m.dashboard_abuse())}
	{@render navbarLink(
		MaterialSymbolsMenuBookRounded,
		"https://guides.frii.site",
		m.guides_link_navbar()
	)}
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
		transition: color 0.2s ease-in-out;
	}

	:global(body) {
		overflow-x: hidden;
	}
</style>
