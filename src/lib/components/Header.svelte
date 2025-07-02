<script lang="ts">
	import MaterialSymbolsAccountCircle from "~icons/material-symbols/account-circle";
	import MaterialSymbolsBookRibbonRounded from "~icons/material-symbols/book-ribbon-rounded";
	import MaterialSymbolsFlagRounded from "~icons/material-symbols/flag-rounded";
	import MaterialSymbolsHome from "~icons/material-symbols/home";
	import MaterialSymbolsTeamDashboard from "~icons/material-symbols/team-dashboard";
	import { getFlagEmoji } from "../../helperFuncs";
	import { m } from "../../paraglide/messages";
	import type { Locale } from "../../paraglide/runtime";
	import { getLocale, locales, localizeHref, setLocale } from "../../paraglide/runtime";

	import Modal from "./Modal.svelte";
	let header: HTMLElement;
	let modal: Modal;

	let selectElement: HTMLSelectElement;
	let isSidebar: boolean = $state(true);
	let sidebarOpened: boolean = $state(false);

	let height = $state(0);
	let width = $state(0);

	$effect(() => {
		isSidebar = height > width;
	});
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />
<header class="bg-card flex h-16 items-center space-x-8 pr-6 pl-6 text-xl [&>div]:items-center">
	<a class="item flex" href={localizeHref("/")}>
		<MaterialSymbolsHome />
		<p>{m.dashboard_home()}</p>
	</a>

	<a class="item flex" href={localizeHref("/dashboard")}>
		<MaterialSymbolsTeamDashboard />
		<p>{m.dashboard_navbar()}</p>
	</a>

	<a class="item flex" href={localizeHref("/account/manage")}>
		<MaterialSymbolsAccountCircle />
		<p>{m.dashboard_account()}</p>
	</a>

	<a class="item flex" href={localizeHref("/report")}>
		<MaterialSymbolsFlagRounded />
		<p>{m.dashboard_abuse()}</p>
	</a>

	<a class="item flex" href="https://guides.frii.site">
		<MaterialSymbolsBookRibbonRounded />
		<p>{m.guides_link_navbar()}</p>
	</a>

	<div class="item">
		<select
			style="color: var(--primary);"
			bind:this={selectElement}
			onchange={_ => setLocale(selectElement.value as Locale)}>
			{#each locales as locale}
				<option selected={locale === getLocale()} value={locale}
					>{getFlagEmoji(locale)} {locale}</option>
			{/each}
		</select>
	</div>
</header>

<style>
	.item {
		align-items: center;
	}
</style>
