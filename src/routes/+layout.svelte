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
	import MaterialSymbolsCollectionsBookmarkOutlineRounded from "~icons/material-symbols/collections-bookmark-outline-rounded";
	import MaterialSymbolsFlagRounded from "~icons/material-symbols/flag-rounded";
	import MaterialSymbolsHomeRounded from "~icons/material-symbols/home-rounded";
	import MaterialSymbolsMenuBookRounded from "~icons/material-symbols/menu-book-rounded";
	import MaterialSymbolsTeamDashboard from "~icons/material-symbols/team-dashboard";

	import Button from "$lib/components/ui/button/button.svelte";
	import { isBrowser } from "@sentry/core";
	import "../app.css";
	import { m } from "../paraglide/messages";
	import { localizeHref } from "../paraglide/runtime";

	let { children } = $props();
	let localSponsorHidden = $state(false);
	let innerWidth = $state(0);
	let adsVisible = $state(true);
	let towerAdsVisible = $state(false);
	let navigationTrigger = $state(0);

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
		navigationTrigger++;
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
	{@render navbarLink(
		MaterialSymbolsCollectionsBookmarkOutlineRounded,
		localizeHref("/blogs"),
		m.blogs_navbar()
	)}
	{@render navbarLink(MaterialSymbolsFlagRounded, localizeHref("/report"), m.dashboard_abuse())}
	{@render navbarLink(
		MaterialSymbolsMenuBookRounded,
		"https://guides.frii.site",
		m.guides_link_navbar()
	)}
</Header>

<Banner />

<Analytics />

{#if isBrowser() && Number(localStorage.getItem("views")) > 7 && !localStorage.getItem("donation-dismissed") && !localSponsorHidden}
	<div class="flex w-full items-center justify-around p-4">
		<div>
			<h1 class="text-2xl font-semibold">{m.donate_beg_title()}</h1>
			<p class="max-w-[60ch]">
				{@html m.donate_beg_description()}
			</p>
			<a href="https://ko-fi.com/ctih1">{m.donate_beg_options()}</a>
		</div>

		<Button
			variant={"destructive"}
			onclick={_ => {
				localSponsorHidden = true;
				localStorage.setItem("donation-dismissed", "true");
			}}>{m.donate_beg_ignore()}</Button>
	</div>
{/if}

{#if isBrowser() && navigationTrigger && innerWidth > 1450 && window.location.pathname !== "/" && window.location.pathname !== "/dashboard" && towerAdsVisible}
	<iframe
		title="Tower Advertisement"
		class="absolute top-[25%] left-0 z-20 aspect-[320/600] h-[50vh] w-fit"
		src="https://scontent.frii.site/tower"></iframe>
	<iframe
		title="Tower Advertisement"
		class="absolute top-[25%] right-0 z-20 aspect-[320/600] h-[50vh] pr-2"
		src="https://scontent.frii.site/tower"></iframe>
{/if}

<svelte:head>
	<link
		rel="preload"
		as="font"
		href="/fonts/InterVariable.woff2"
		type="font/woff2"
		crossorigin="anonymous" />

	<script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2958231337684546"
		crossorigin="anonymous">
	</script>
	<script
		defer
		src="https://analytics.koti.frii.site/script.js"
		data-website-id="34175ac9-02fb-4df0-96b9-0e847365184e"></script>
</svelte:head>
<svelte:window bind:innerWidth={innerWidth} />

<main>
	{@render children()}
</main>

{#if isBrowser() && navigationTrigger && window.location.pathname !== localizeHref("/") && adsVisible}
	<div class="sm:[220px] relative h-full w-full md:pt-[360px]">
		<iframe
			title="Banner Advertisement"
			class="absolute bottom-4 left-[50%] aspect-[600/320] translate-x-[-50%] text-center sm:w-[300px] md:w-[600px]"
			src="https://scontent.frii.site/banner"></iframe>
	</div>
{/if}

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
