<script lang="ts">
	import { browser } from "$app/environment";
	import * as Select from "$lib/components/ui/select/index.js";
	import { activeTheme, sidebarOpen } from "$lib/store";
	import consola from "consola";
	import Cookies from "js-cookie";
	import { SvelteMap } from "svelte/reactivity";
	import { fade } from "svelte/transition";
	import MaterialSymbolsAutorenewRounded from "~icons/material-symbols/autorenew-rounded";
	import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";
	import MaterialSymbolsDarkModeRounded from "~icons/material-symbols/dark-mode-rounded";
	import MaterialSymbolsLightModeRounded from "~icons/material-symbols/light-mode-rounded";
	import MaterialSymbolsMenuRounded from "~icons/material-symbols/menu-rounded";
	import { changeTheme, getFlagEmoji } from "../../helperFuncs";
	import { m } from "../../paraglide/messages";
	import { getLocale, type Locale, locales, setLocale } from "../../paraglide/runtime";
	import Label from "./ui/label/label.svelte";

	let { children } = $props();

	// cache the images
	let images = $state(new SvelteMap<string, string | undefined>());

	if (browser) {
		const savedLocale = Cookies.get("PARAGLIDE_LOCALE");

		if (!savedLocale) {
			const userLocale = navigator.language || navigator.languages[0] || "en";
			const matchedLocale =
				locales.find(locale => userLocale.toLowerCase().startsWith(locale.toLowerCase())) ||
				"en";
			setLocale(matchedLocale);
		}

		locales.forEach(async locale => {
			let flag: string = locale;
			if (locale === "en") flag = "gb";
			else if (locale === "ar") flag = "sa";
			else if (locale.startsWith("zh_")) flag = locale.slice(3).toLowerCase();

			const url = `https://flagcdn.com/${flag}.svg`;
			try {
				const res = await fetch(url);
				const blob = await res.blob();
				const reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = () => {
					images.set(locale, reader.result?.toString());
					images = images;
					consola.verbose(`Loaded locale flag ${locale}`);
				};
			} catch (e) {
				consola.warn(`Failed to load flag for ${locale}`, e);
			}
		});
	}
</script>

<header
	id="header"
	class="bg-card flex h-full w-screen max-w-screen items-center space-x-6 pt-1 pr-4 pb-1 pl-4">
	<button
		id="popout-toggle"
		class="relative hidden h-12 w-12"
		onclick={_ => ($sidebarOpen = !$sidebarOpen)}>
		{#key $sidebarOpen}
			<div transition:fade={{ duration: 100 }} class="absolute top-0">
				{#if !$sidebarOpen}
					<MaterialSymbolsMenuRounded class="h-12 w-12" />
				{:else}
					<MaterialSymbolsCloseRounded class="h-12 w-12" />
				{/if}
			</div>
		{/key}
	</button>

	<div class="flex gap-4.5">
		{@render children()}
	</div>

	<div class="mr-4 ml-auto flex space-x-2">
		<Select.Root
			onValueChange={value => setLocale(value as Locale)}
			type="single"
			name="Language">
			<Select.Trigger class="w-24">
				{#if images.get(getLocale().toString())}
					<img
						alt={getFlagEmoji(getLocale().toString())}
						src={images.get(getLocale().toString())}
						class="w-[2ch]" />
				{/if}
				{getLocale()}</Select.Trigger>
			<Select.Content>
				{#each locales as locale}
					<Select.Item value={locale} label={getFlagEmoji(locale) + locale}>
						{@const codePoint = Array.from(getFlagEmoji(locale))
							// @ts-ignore
							.map(c => c.codePointAt(0).toString(16))
							.join("-")}
						<img alt={getFlagEmoji(locale)} src={images.get(locale)} class="w-[2ch]" />
						- {locale}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<div id="lang-picker-navbar">
			<Select.Root onValueChange={changeTheme} type="single" name="Theme mode">
				<Select.Trigger class="flex w-28 items-center gap-1">
					{#if $activeTheme === "light"}
						<MaterialSymbolsLightModeRounded class="h-5 w-5" />
						{m.light_theme_select()}
					{:else if $activeTheme === "dark"}
						<MaterialSymbolsDarkModeRounded class="h-5 w-5" />
						{m.dark_theme_select()}
					{:else if $activeTheme === "auto"}
						<MaterialSymbolsAutorenewRounded class="h-5 w-5" />
						{m.auto_theme_select()}
					{/if}
				</Select.Trigger>
				<Select.Content>
					<Select.Item aria-selected={$activeTheme === "dark"} value="dark" label="dark">
						<MaterialSymbolsDarkModeRounded />
						{m.dark_theme_select()}
					</Select.Item>
					<Select.Item
						aria-selected={$activeTheme === "light"}
						value="light"
						label="light">
						<MaterialSymbolsLightModeRounded />
						{m.light_theme_select()}
					</Select.Item>
					<Select.Item aria-selected={$activeTheme === "auto"} value="auto" label="auto">
						<MaterialSymbolsAutorenewRounded />
						{m.auto_theme_select()}</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
	</div>
</header>
{#if $sidebarOpen}
	<div
		transition:fade={{ duration: 100 }}
		id="popout"
		class="popout bg-card absolute z-50 hidden h-[calc(100vh-48px)] w-full max-w-60 flex-col space-y-4 rounded-br-2xl pl-4 opacity-95">
		{@render children()}

		<div class="mt-auto mb-4">
			<Label class="text-md mb-0">{m.theme_selector_label()}</Label>
			<Select.Root onValueChange={changeTheme} type="single" name="Theme mode">
				<Select.Trigger class="w-24">
					{#if $activeTheme === "light"}
						{m.light_theme_select()}
					{:else if $activeTheme === "dark"}
						{m.dark_theme_select()}
					{:else if $activeTheme === "auto"}
						{m.auto_theme_select()}
					{/if}
				</Select.Trigger>
				<Select.Content>
					<Select.Item aria-selected={$activeTheme === "dark"} value="dark" label="dark">
						<MaterialSymbolsDarkModeRounded />
						{m.dark_theme_select()}
					</Select.Item>
					<Select.Item
						aria-selected={$activeTheme === "light"}
						value="light"
						label="light">
						<MaterialSymbolsLightModeRounded />
						{m.light_theme_select()}
					</Select.Item>
					<Select.Item aria-selected={$activeTheme === "auto"} value="auto" label="auto">
						<MaterialSymbolsAutorenewRounded />
						{m.auto_theme_select()}</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
	</div>
{/if}

<style>
	@media (max-width: 960px) {
		:global(#header a) {
			display: none;
		}
		:global(#header svg) {
			display: block;
		}
		#header {
			justify-content: space-between;
		}

		#lang-picker-navbar {
			display: none;
		}
		#popout-toggle {
			display: block;
		}
		#popout {
			display: flex;
		}
	}
</style>
