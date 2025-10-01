<script lang="ts">
	import { browser } from "$app/environment";
	import * as Select from "$lib/components/ui/select/index.js";
	import { sidebarOpen } from "$lib/store";
	import consola from "consola";
	import { fade } from "svelte/transition";
	import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";
	import MaterialSymbolsMenuRounded from "~icons/material-symbols/menu-rounded";
	import { getFlagEmoji } from "../../helperFuncs";
	import { getLocale, locales, setLocale } from "../../paraglide/runtime";

	let { children } = $props();

	// cache the images
	const images = $state(new Map());
	if (browser) {
		const flagCache = locales.map(async locale => {
			let flag = locale.toString();
			if (locale === "en") {
				flag = "gb";
			} else if (locale === "ar") {
				flag = "sa";
			}

			const url = `https://flagcdn.com/${flag}.svg`;
			await fetch(url)
				.then(req => req.blob())
				.then(data => {
					const reader = new FileReader();
					reader.readAsDataURL(data);
					reader.onloadend = () => {
						consola.debug(`Loaded locale flag ${locale}`);
						images.set(locale, reader.result);
					};
				});
		});
	}
</script>

<header
	id="header"
	class="bg-card flex h-full w-screen max-w-screen items-center space-x-6 pt-1 pr-4 pb-1 pl-4">
	<button
		id="popout-toggle"
		class="hidden h-12 w-12"
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
	{@render children()}

	<Select.Root onValueChange={value => setLocale(value)} type="single" name="Language">
		<Select.Trigger class="mr-4 ml-auto w-24">
			{#if images.size > 2}
				<img
					src={images.get(getLocale())}
					alt={getFlagEmoji(getLocale())}
					class="w-[2ch] rounded-md" />
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
</header>
{#if $sidebarOpen}
	<div
		transition:fade={{ duration: 100 }}
		id="popout"
		class="popout bg-card absolute z-50 hidden h-full w-full max-w-60 flex-col space-y-4 rounded-br-2xl pl-4 opacity-95">
		{@render children()}
	</div>
{/if}

<style>
	:global(#header svg) {
		display: none;
	}
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
		#popout-toggle {
			display: block;
		}
		#popout {
			display: flex;
		}
	}
</style>
