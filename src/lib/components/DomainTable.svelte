<script lang="ts">
	import { domainAmount } from "$lib/store";
	import { createEventDispatcher } from "svelte";
	import { m } from "../../paraglide/messages";
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

	let isMobile: boolean = $state(true);
	let width: number = $state(0);
	let height: number = $state(0);

	let dispatcher = createEventDispatcher();
	let modal: Modal;

	let opened: Map<number, boolean> = $state(new Map());
	let openedModified: number = $state(0);

	async function saveDomain(name: string, value: string, record: string) {
		dispatcher("save", { name: name, value: value, type: record });
	}

	$effect(() => {
		isMobile = height > width;
	});
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<link
	rel="preload"
	href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

{#if !isMobile}
	<table>
		<thead>
			<tr>
				<th style="width: 15%; min-width: 90px;">{m.dashboardt_record()}</th>
				<th>{m.dashboardt_content()}</th>
				<th style="width: 25%;">{m.dashboardt_value()}</th>
				<th style="width:20%; min-width:160px;">{m.dashboardt_manage()}</th>
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
{:else}
	<table>
		<thead>
			<tr>
				<th>{m.dashboardt_content()}</th>
				<th style="width: 25%">{m.dashboardt_manage()}</th>
			</tr>
		</thead>
		<tbody>
			{#if !loaded}
				{#each Array(Number($domainAmount)) as _, i}
					<tr class="domain-row">
						<td>
							<div class="container">
								<div style="width: 75%" class="container">
									<Placeholder />
								</div>
								<div style="width: 25%; min-width:55px;">
									<Placeholder />
								</div>
							</div>
						</td>
						<td class="manage-row">
							<Placeholder />
						</td>
					</tr>
				{/each}
			{/if}
			{#each domains as domain, index}
				<tr>
					<td>
						<div class="container domain-row">
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
								<div style="width: 100%" class="container domain-row">
									<input disabled type="text" bind:value={domain.domain} />
								</div>
							{/if}
						</div>
					</td>
					<td
						class="manage-row"
						data-index={index}
						style="display: flex; flex-direction: row;">
						<Button
							on:click={() => {
								opened.set(index, !opened.get(index));
								openedModified++;
							}}
							args={"fill side-margin capitalize"}>{m.dashboardt_manage()}</Button>
					</td>
				</tr>
				{#key openedModified}
					{#if opened.get(index)}
						<tr class="mobile-expanded">
							<td>
								<div class="mobile-manage">
									<div style="width: 35%; height: 100%;">
									</div>
									<input type="text" bind:value={domain.value} />
								</div>
							</td>
							<td
								style="height: 100%; width: 100%"
								class="manage-row"
								data-index={index}>
								<div class="mobile-actions">
									<Button
										on:click={() => {
											saveDomain(domain.domain, domain.value, domain.type);
										}}
										args={"side-margin capitalize tiny-margin-bottom"}
										>Save</Button>
									<Button
										on:click={() =>
											dispatcher("delete", { domain: domain.domain })}
										args={"danger side-margin tiny-margin-top tiny-margin-bottom"}
										><span class="material-symbols-outlined">delete</span
										></Button>
								</div>
							</td>
						</tr>
					{/if}
				{/key}
			{/each}
		</tbody>
	</table>
{/if}

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

	.mobile-expanded {
		width: 100%;
		height: 4em;
	}

	.mobile-actions {
		display: flex;
		flex-direction: column;
		margin: 0px;
		height: 100%;
		width: 100%;
	}

	.mobile-manage {
		height: 100%;
		display: flex;
	}

	.mobile-manage input {
		font-size: 16px;
	}

	.manage-row {
		display: flex;
		flex-direction: row;
	}
</style>
