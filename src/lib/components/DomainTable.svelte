<script lang="ts">
	import { domainAmount } from "$lib/store";
	import { t } from "$lib/translations";
	import { createEventDispatcher } from "svelte";
	import Button from "./Button.svelte";
	import Dropdown from "./Dropdown.svelte";
	import Modal from "./Modal.svelte";
	import Placeholder from "./Placeholder.svelte";

	export interface Domain {
		type: string;
		domain: string;
		value: string;
	}
	interface Props {
		domains: Domain[];
		loaded: boolean;
	}
	let { domains, loaded }: Props = $props();

	let dispatcher = createEventDispatcher();
	let modal: Modal;

	async function saveDomain(name: string, value: string, record: string) {
		dispatcher("save", { name: name, value: value, type: record });
	}
</script>

<link
	rel="preload"
	href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

<table>
	<thead>
		<tr>
			<th style="width: 15%; min-width: 90px;">{$t("dashboardt_record")}</th>
			<th>{$t("dashboardt_content")}</th>
			<th style="width: 25%;">{$t("dashboardt_value")}</th>
			<th style="width:20%; min-width:160px;">{$t("dashboardt_manage")}</th>
		</tr>
	</thead>
	<tbody>
		{#if !loaded}
			{#each Array(Number($domainAmount)) as _, i}
				<tr>
					<td><Placeholder /></td>
					<td
						><div class="container">
							<div style="width: 75%" class="container">
								<Placeholder />
							</div>
							<div style="width: 25%; min-width:55px;">
								<Placeholder />
							</div>
						</div></td>
					<td><Placeholder /></td>
					<td style="display: flex; flex-direction: row;">
						<Placeholder />
						<Placeholder />
					</td>
				</tr>
			{/each}
		{/if}
		{#each domains as domain, index}
			<tr>
				<td>
					<Dropdown
						on:optionchange={event => (domain.type = event.detail)}
						defaultValue={domain.type}
						options={["A", "CNAME", "NS", "TXT"]}
						disabled={true} />
				</td>
				<td>
					<div class="container">
						{#if domain.type !== "TXT"}
							<div style="width: 75%" class="container">
								<input disabled type="text" bind:value={domain.domain} />
							</div>
							<div style="width: 25%; min-width:55px;">
								<input
									disabled
									style="width: 100%; min-width:55px;"
									value=".frii.site" />
							</div>
						{:else}
							<div style="width: 100%" class="container">
								<input disabled type="text" bind:value={domain.domain} />
							</div>
						{/if}
					</div>
				</td>
				<td>
					<input type="text" bind:value={domain.value} />
				</td>
				<td data-index={index} style="display: flex; flex-direction: row;">
					<Button
						on:click={() => saveDomain(domain.domain, domain.value, domain.type)}
						args={"fill three-quarters side-margin"}>Save</Button>
					<Button
						on:click={() => dispatcher("delete", { domain: domain.domain })}
						args={"fill danger quarter side-margin"}
						><span class="material-symbols-outlined">delete</span></Button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<Modal
	bind:this={modal}
	options={["Cancel", "Continue"]}
	countdown={15}
	title="Are you sure you want to delete"
	description={""}></Modal>

<style>
	thead {
		background-color: rgba(0, 0, 0, 0.05);
	}
	table {
		width: 100%;
		height: 100%;
		table-layout: fixed;
		background-color: var(--offwhite-coloe);
		border-collapse: collapse;
		padding: 1em;
	}
	th {
		text-align: left;
	}
	tr {
		background-color: rgba(0, 0, 0, 0.01);
	}

	td {
		min-width: 10vw;
		width: 100%;
		height: 2em;
		justify-content: center;
	}
	tr:not(:last-child) {
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.row {
		margin: 0px;
		display: flex;
		flex-direction: row;
	}
	.container {
		display: flex;
		flex-direction: row;
		height: 100%;
	}

	input:focus {
		transform: scale(1.05);
		z-index: 11;
	}
	@media (orientation: portrait) {
		input:focus {
			transform: scale(1.3);
			font-size: 0.6em;
			z-index: 11;
		}
	}
</style>
