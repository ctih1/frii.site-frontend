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

<script lang="ts">
	import { prefLocale } from "./../../routes/stores"
	import Modal from "./Modal.svelte"
	import { t, locale, locales } from "$lib/translations"
	import { getFlagEmoji } from "../../helperFuncs"
	let header: HTMLElement
	let modal: Modal
	export function getHeight(): number {
		return Number(header.style.height.substring(0, header.style.height.length - 2))
	}

	const handleChange = ({ currentTarget }) => {
		const { value } = currentTarget
		prefLocale.set(value)
	}
</script>

<header bind:this={header}>
	<a class="item" href="/">
		<span class="material-symbols-outlined">home</span>
		<p>{$t("dashboard_home")}</p>
	</a>

	<a class="item" href="/dashboard">
		<span class="material-symbols-outlined">apps</span>
		<p>{$t("dashboard_navbar")}</p>
	</a>

	<a class="item" href="/account/manage">
		<span class="material-symbols-outlined">person</span>
		<p>{$t("dashboard_account")}</p>
	</a>

	<a class="item" href="/report">
		<span class="material-symbols-outlined">flag</span>
		<p>{$t("dashboard_abuse")}</p>
	</a>

	<div class="item">
		<span class="material-symbols-outlined">language</span>
		<select style="color: var(--primary);" bind:value={$locale} on:change={handleChange}>
			{#each $locales.sort((a, b) => $t(`lang.${a}`) > $t(`lang.${b}`)) as value}
				<option value={value} selected={$locale === value}
					>{$t(`lang.${value}`)} {getFlagEmoji(value)}</option>
			{/each}
		</select>
	</div>
</header>
