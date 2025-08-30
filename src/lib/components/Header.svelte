<script lang="ts">
	import { slide } from "svelte/transition";
	import { getFlagEmoji } from "../../helperFuncs";
	import { m } from "../../paraglide/messages";
	import type { Locale } from "../../paraglide/runtime";
	import { getLocale, locales, localizeHref, setLocale } from "../../paraglide/runtime";

	import { circOut } from "svelte/easing";
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
	export function getHeight(): number {
		return Number(header.style.height.substring(0, header.style.height.length - 2));
	}
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

{#if isSidebar && sidebarOpened}
	<div transition:slide={{ easing: circOut, duration: 220 }} class="sidebar-wrapper">
		<div class="sidebar">
			<a class="item" href={localizeHref("/account/manage")}>
				<span class="material-symbols-outlined">person</span>
				<p>{m.dashboard_account()}</p>
			</a>

			<a class="item" href={localizeHref("/report")}>
				<span class="material-symbols-outlined">flag</span>
				<p>{m.dashboard_abuse()}</p>
			</a>

			<a class="item" href="https://guides.frii.site">
				<span class="material-symbols-outlined">menu_book</span>
				<p>{m.guides_link_navbar()}</p>
			</a>

			<a class="item" href="https://canary.frii.site">
				<p>Test new website</p>
			</a>

			<div class="item">
				<p>Language:</p>
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
		</div>
	</div>
{/if}
<header bind:this={header}>
	{#if isSidebar}
		<div class="primary">
			<button class="sidebar-button" onclick={_ => (sidebarOpened = !sidebarOpened)}>
				<span class="material-symbols-outlined"> menu </span>
			</button>
		</div>
		<div class="secondary">
			<a class="item" href={localizeHref("/")}>
				<span class="material-symbols-outlined">home</span>
				<p>{m.dashboard_home()}</p>
			</a>

			<a class="item" href={localizeHref("/dashboard")}>
				<span class="material-symbols-outlined">apps</span>
				<p>{m.dashboard_navbar()}</p>
			</a>
		</div>
	{/if}

	{#if !isSidebar}
		<a class="item" href={localizeHref("/")}>
			<span class="material-symbols-outlined">home</span>
			<p>{m.dashboard_home()}</p>
		</a>

		<a class="item" href={localizeHref("/dashboard")}>
			<span class="material-symbols-outlined">apps</span>
			<p>{m.dashboard_navbar()}</p>
		</a>

		<a class="item" href={localizeHref("/account/manage")}>
			<span class="material-symbols-outlined">person</span>
			<p>{m.dashboard_account()}</p>
		</a>

		<a class="item" href={localizeHref("/report")}>
			<span class="material-symbols-outlined">flag</span>
			<p>{m.dashboard_abuse()}</p>
		</a>

		<a class="item" href="https://canary.frii.site">
			<p>Test new website</p>
		</a>

		<a class="item" href="https://guides.frii.site">
			<span class="material-symbols-outlined">menu_book</span>
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
	{/if}
</header>

<style>
	header {
		position: asbolute;
		display: flex;
		align-items: center;
		top: 0px;
		left: 0px;
		background-color: var(--offwhite-color);
		min-height: 50px;
		max-width: 100vw;
		z-index: 10;
	}
	header * {
		align-items: center;
		text-align: center;
	}
	.item {
		display: flex;
		align-items: center;
		margin-left: 1em;
		margin-right: 1em;
	}
	.item * {
		height: 100%;
		font-weight: 500;
	}

	.sidebar-button {
		background: none;
		border: none;
	}

	.sidebar-button:hover {
		cursor: pointer;
	}

	.sidebar-wrapper {
		position: absolute;
		left: 0px;
		top: 50px;
		width: 200px;
		background-color: var(--offwhite-color);
		border-bottom-right-radius: 0.5em;
		z-index: 5;
		padding: 12px;
	}
	.sidebar {
		display: flex;
		flex-direction: column;
	}
	.sidebar .item {
		margin: 4px;
		border-radius: 0.5em;
		padding: 4px;
	}
	.sidebar .item p {
		color: var(--primary);
	}

	@media (orientation: portrait) {
		.item {
			margin-left: 0.25em;
			margin-right: 0.25em;
		}
		.material-symbols-outlined {
			font-size: 40px;
		}
		header {
			display: flex;
			justify-content: unset;
		}
		header div {
			display: flex;
		}
		header .secondary {
			margin-left: auto;
			margin-right: 12px;
		}
	}
	.logo img {
		margin-left: 8px;
		width: 15px;
	}
	.logo p {
		color: white;
		margin: 0px;
		margin-left: 6px;
		font-size: 20px;
		font-weight: 600;
		padding: 0px;
	}
	select {
		border-style: none;
		background-color: var(--offwhite-color);
	}
	select * {
		color: var(--primary);
	}
	span {
		color: var(--primary);
	}
</style>
