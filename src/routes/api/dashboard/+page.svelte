<script lang="ts">
	import { getAuthToken, redirectToLogin } from "$lib";
	import type { Domain } from "$lib/components/DomainTable.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import InlineAlert from "$lib/components/ui/inline-alert/inline-alert.svelte";
	import { Input } from "$lib/components/ui/input";
	import Label from "$lib/components/ui/label/label.svelte";
	import * as Select from "$lib/components/ui/select/index.js";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { fade } from "svelte/transition";
	import MaterialSymbolsVisibility from "~icons/material-symbols/visibility";
	import MaterialSymbolsVisibilityOff from "~icons/material-symbols/visibility-off";
	import { m } from "../../../paraglide/messages";
	import { AuthError, ServerContactor } from "../../../serverContactor";
	interface Key {
		hash: string;
		perms: ("delete" | "register" | "modify" | "list")[];
		domains: string[];
		comment: string;
		decrypted?: string;
		visible: boolean;
		deletionLoading?: boolean;
	}

	const Permissions = ["register", "modify", "delete", "list"] as const;

	let apiKeys: Key[] = $state([]);
	let keysLoaded: boolean = $state(false);

	let domainsLoaded: boolean = $state(false);
	let domains: Domain[] = $state([]);

	let selectedDomains: string[] = $state([]);
	let selectedPermissions: string[] = $state([]);
	let apiCreationLoading: boolean = $state(false);

	let comment: string = $state("");

	let dialogOpen: boolean = $state(false);

	let apiErrorTitle: string = $state("");
	let apiErrorDescription: string = $state("");

	let alertUpdate: number = $state(0);

	let serverContactor: ServerContactor;

	function getKey(key: Key) {
		key.decrypted = "Loading..";
		serverContactor
			.getApiKey(key.hash)
			.catch(error => {
				if (error instanceof AuthError) {
					redirectToLogin(460);
				}
			})
			.then(data => {
				console.log(data);
				key.decrypted = data ?? "";
			});
	}

	function deleteKey(key: Key) {
		key.decrypted = "Loading..";
		serverContactor
			.deleteApiKey(key.hash)
			.catch(error => {
				key.deletionLoading = false;
				if (error instanceof AuthError) {
					redirectToLogin(460);
				}
			})
			.then(data => {
				key.deletionLoading = false;
				dialogOpen = false;
				apiKeys = apiKeys.filter(apiKey => apiKey.hash !== key.hash);
			});
	}

	function registerKey() {
		serverContactor
			// @ts-expect-error selectedPermissions typed as string[] instead of string literal
			.createApiKey(comment, selectedDomains, selectedPermissions)
			.catch(error => {
				apiCreationLoading = false;

				if (error instanceof AuthError) {
					redirectToLogin(460);
				}
			})
			.then(data => {
				apiCreationLoading = false;
				toast.success("API key created", {
					description: "Refreshing..."
				});
				window.location.reload();
			});
	}

	onMount(() => {
		serverContactor = new ServerContactor(getAuthToken());
		serverContactor
			.getApiKeys()
			.catch(error => {
				if (error instanceof AuthError) {
					redirectToLogin(460);
				}
			})
			.then(data => {
				keysLoaded = true;

				if (!data) {
					return;
				}
				const userKeys = Object.entries(data);
				for (let [key, value] of userKeys) {
					apiKeys.push({
						hash: key,
						comment: value.comment,
						perms: value.perms,
						domains: value.domains,
						visible: false
					});
				}
			});
		serverContactor
			.getDomains()
			.catch(error => {
				if (error instanceof AuthError) {
					redirectToLogin(460);
				} else {
					console.error(error);
					apiErrorTitle = m.dashboard_domain_load_fail();
					apiErrorDescription = m.generic_fail_description();
					throw new Error("Failed to load domains");
				}
			})
			.then(data => {
				domainsLoaded = true;
				// @ts-expect-error
				const userDomains = Object.entries(data);

				for (let [key, value] of userDomains) {
					domains.push({
						type: value.type,
						domain: key,
						value: value.ip
					});
				}
			});
	});
</script>

<div class="domain-holder bg-card max-w-8xl mt-16 mr-auto ml-auto w-10/12 rounded-2xl p-6">
	<h1 class="text-3xl font-semibold">{m.api_title()}</h1>

	{#key apiKeys}
		{#if !keysLoaded}
			<Skeleton class="mt-8 mb-8 h-48 items-center space-x-3 rounded-lg p-8" />
		{/if}
		<div transition:fade={{ duration: 100 }} class="keys">
			{#each apiKeys as key}
				<div class="key bg-popover mt-8 mb-8 items-center space-x-3 rounded-lg p-8">
					<Label class="text-2xl font-semibold">{key.comment}</Label>

					<div class="key flex w-full">
						<Input
							disabled={true}
							id="key"
							type={key.visible ? "text" : "password"}
							value={key.decrypted ?? "X".repeat(39)} />
						<Button
							onclick={_ => {
								if (!key.decrypted) {
									getKey(key);
								}
								key.visible = !key.visible;
							}}
							class="ml-1"
							variant={"ghost"}>
							{#if key.visible}
								<MaterialSymbolsVisibilityOff />
							{:else}
								<MaterialSymbolsVisibility />
							{/if}
						</Button>
					</div>
					<p class="font-semibold">{m.api_dashboard_permission_section()}</p>
					<ul class="list-disc [&>li]:ml-8">
						{#each key.perms as permission}
							{#if permission === "modify"}
								<li>{m.api_dashboard_modify_perm()}</li>
							{/if}
							{#if permission === "register"}
								<li>{m.api_dashboard_register_perm()}</li>
							{/if}
							{#if permission === "delete"}
								<li>{m.api_dashboard_delete_perm()}</li>
							{/if}
							{#if permission === "list"}
								<li>{m.api_dashboard_list_perm()}</li>
							{/if}
						{/each}
					</ul>
					<p class="font-semibold">{m.api_dashboard_domains_section()}</p>
					<ul class="list-disc [&>li]:ml-8">
						{#each key.domains as domain}
							<li>{domain}.frii.site</li>
						{/each}
					</ul>

					<Dialog.Root onOpenChange={open => (dialogOpen = open)} open={dialogOpen}>
						<Dialog.Trigger>
							<Button variant={"destructive"}
								>{m.api_dashboard_delete_action()}</Button>
						</Dialog.Trigger>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>{m.api_dashboard_delete_title()}</Dialog.Title>
								<Dialog.Description>
									{m.api_dashboard_delete_description()}
								</Dialog.Description>
							</Dialog.Header>
							<Dialog.Footer>
								<Button
									onclick={_ => {
										deleteKey(key);
										key.deletionLoading = true;
									}}
									loading={key.deletionLoading}
									variant={"destructive"}
									>{m.api_dashboard_delete_action()}</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
				</div>
			{/each}
		</div>
	{/key}

	<InlineAlert
		variant={"error"}
		title={apiErrorTitle}
		description={apiErrorDescription}
		className="mb-6 mt-6"
		trigger={alertUpdate} />
</div>

<div class="create bg-card max-w-8xl mt-16 mr-auto ml-auto w-10/12 rounded-2xl p-6">
	<h1 class="text-2xl font-semibold">{m.api_dashboard_create_title()}</h1>
	<form class="mt-4 items-center space-y-4 space-x-2">
		<div class="w-full max-w-96 space-y-2">
			<Label for="comment">{m.api_dashboard_create_comment_input()}</Label>
			<Input
				placeholder={m.api_dashboard_comment_placeholder()}
				aria-required={true}
				bind:value={comment}
				id="comment" />
		</div>
		<div class="space-y-2">
			<Label>{m.api_dashboard_create_affected_domains_input()}</Label>
			<Select.Root bind:value={selectedDomains} type="multiple">
				<Select.Trigger class="w-96"
					>{selectedDomains.join(", ").slice(0, 45)}...</Select.Trigger>
				<Select.Content>
					<Select.Item value="*">{m.api_dashboard_domain_any()}</Select.Item>
					{#each domains as domain}
						<Select.Item value={domain.domain}>{domain.domain}.frii.site</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="space-y-2">
			<Label>{m.api_dashboard_create_affected_permission_input()}</Label>
			<Select.Root bind:value={selectedPermissions} type="multiple">
				<Select.Trigger class="w-96"
					>{selectedPermissions.join(", ").slice(0, 45)}...</Select.Trigger>
				<Select.Content>
					{#each Permissions as permission}
						<Select.Item value={permission}
							>{m[`api_dashboard_${permission}_perm`]()}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<Button
			disabled={!comment}
			onclick={_ => {
				apiCreationLoading = true;
				registerKey();
			}}
			loading={apiCreationLoading}>{m.api_dashboard_create_action()}</Button>
	</form>
</div>
