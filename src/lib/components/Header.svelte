<script lang="ts">
	import * as Select from "$lib/components/ui/select/index.js";
	import { sidebarOpen } from "$lib/store";
	import { fade } from "svelte/transition";
	import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";
	import MaterialSymbolsMenuRounded from "~icons/material-symbols/menu-rounded";
	import { getFlagEmoji } from "../../helperFuncs";
	import { getLocale, locales, setLocale } from "../../paraglide/runtime";

	let { children } = $props();
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
		<Select.Trigger class="mr-4 ml-auto w-24"
			>{getFlagEmoji(getLocale())} - {getLocale()}</Select.Trigger>
		<Select.Content>
			{#each locales as locale}
				<Select.Item value={locale} label={getFlagEmoji(locale) + locale}>
					{getFlagEmoji(locale)} - {locale}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</header>
{#if $sidebarOpen}
	<div
		transition:fade={{ duration: 100 }}
		id="popout"
		class="popout bg-card absolute z-50 hidden h-full w-full max-w-96 flex-col space-y-4 rounded-br-2xl pl-4 opacity-95">
		{@render children()}
	</div>
{/if}

<style>
	@media (max-width: 960px) {
		:global(#header a) {
			display: none;
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
