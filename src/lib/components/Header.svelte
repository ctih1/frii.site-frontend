<script lang="ts">
	import { getFlagEmoji } from "../../helperFuncs";
	import { m } from "../../paraglide/messages";
	import type { Locale } from "../../paraglide/runtime";
	import { getLocale, locales, localizeHref, setLocale } from "../../paraglide/runtime";

	import Modal from "./Modal.svelte";
	let header: HTMLElement;
	let modal: Modal;

	let selectElement: HTMLSelectElement;

	function l() {
		setLocale("fi", { reload: false });
		console.log(m.account_check_email());
	}

	export function getHeight(): number {
		return Number(header.style.height.substring(0, header.style.height.length - 2));
	}
</script>

<header bind:this={header}>
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

	@media (max-width: 550px) {
		header a {
			font-size: 0.7em;
		}
		.item {
			margin-left: 0.25em;
			margin-right: 0.25em;
		}
	}

	@media (orientation: portrait) {
		header a {
			font-size: 0.7em;
		}
		.item {
			margin-left: 0.25em;
			margin-right: 0.25em;
		}
		.item p {
			display: none;
		}
		.material-symbols-outlined {
			font-size: 40px;
		}
		header {
			display: flex;
			justify-content: space-around;
		}
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
