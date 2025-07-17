<script lang="ts">
	import { getAuthToken } from "$lib";
	import type { Domain } from "$lib/components/DomainTable.svelte";
	import Loader from "$lib/components/Loader.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import * as Select from "$lib/components/ui/select/index.js";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { redirectToLogin } from "../../helperFuncs";
	import { m } from "../../paraglide/messages";
	import {
		AuthError,
		ConflictError,
		DNSError,
		LimitError,
		PermissionError,
		ServerContactor
	} from "../../serverContactor";

	import InlineAlert from "$lib/components/ui/inline-alert/inline-alert.svelte";
	import Cookies from "js-cookie";
	import { fade } from "svelte/transition";

	interface DashboardDomain extends Domain {
		deletionWarned: boolean;
		isLoading: boolean;
		buttonDisabled: boolean;
		deletionLoading: boolean;
	}

	let { data } = $props();

	let domains: DashboardDomain[] = $state([]);
	let domainsLoaded: boolean = $state(false);

	let registerNewDomainLoading: boolean = $state(false);
	let newDomain: string = $state("");
	let newDomainType: string = $state("A");

	let registerErrorTitle: string = $state("");
	let registerErrorDescription: string = $state("");

	let domainErrorTitle: string = $state("");
	let domainErrorDescription: string = $state("");

	let alertUpdate: number = $state(0);

	let serverContactor: ServerContactor;
	let loader: Loader;

	const SupportedTypes = ["A", "CNAME", "TXT", "NS"];

	function deleteDomain(domain: string, button: DashboardDomain) {
		serverContactor
			.deleteDomain(domain)
			.catch(error => {
				button.deletionLoading = false;
				if (error instanceof AuthError) redirectToLogin(460);

				domainErrorTitle = m.dashboard_delete_error();
				domainErrorDescription = m.unhandled_error();
				alertUpdate++;

				throw new Error("Failed to delete domain");
			})
			.then(() => {
				window.gtag?.("event", "domain_delete");
				button.deletionLoading = false;
				toast.success(m.dashboard_delete_success({ domain: domain }), {
					description: m.dashboard_delete_success_description({ domain: domain })
				});
				removeDomain(domain);
			});
	}

	function registerDomain(domain: string, type: string) {
		serverContactor
			.registerDomain(domain, type)
			.catch(error => {
				registerNewDomainLoading = false;
				registerErrorTitle = m.dashboard_register_fail({ domain: domain });

				if (error instanceof AuthError) redirectToLogin(460);
				else if (error instanceof DNSError)
					registerErrorDescription = m.dashboard_invalid();
				else if (error instanceof PermissionError)
					registerErrorDescription = m.dashboard_domain_permissions();
				else if (error instanceof LimitError)
					registerErrorDescription = m.dashboard_domain_limit();
				else if (error instanceof ConflictError)
					registerErrorDescription = m.dashboard_domain_use();
				else {
					registerErrorDescription = m.unhandled_error();
				}
				alertUpdate++;
				throw new Error("Failed to register dommain!");
			})
			.then(value => {
				registerNewDomainLoading = false;
				window.gtag?.("event", "domain_register");
				toast.success(m.dashboard_register_success({ domain: domain }));
				domains.push({
					type,
					domain,
					value,
					isLoading: false,
					deletionWarned: false,
					buttonDisabled: false,
					deletionLoading: false
				});
				Cookies.set("domain-amount", domains.length.toString());
			});
	}

	function modifyDomain(domain: DashboardDomain) {
		serverContactor
			.modifyDomain(domain.domain, domain.value, domain.type)
			.catch(error => {
				domain.isLoading = false;
				domainErrorTitle = m.dashboard_modify_fail({ domain: domain.domain });

				if (error instanceof AuthError) redirectToLogin(460);
				else if (error instanceof DNSError)
					domainErrorDescription = m.dashboard_invalid_value();
				else if (error instanceof PermissionError)
					domainErrorDescription = m.dashboard_domain_permissions();
				else {
					domainErrorDescription = m.unhandled_error();
				}
				alertUpdate++;
				throw Error("Failed to modify domain."); // stops execution to the .then block
			})
			.then(() => {
				window.gtag?.("event", "domain_modify");
				domain.isLoading = false;
				toast.success(m.dashboard_modify_success({ domain: domain.domain + ".frii.site" }));
			});
	}

	function removeDomain(name: string) {
		domains = domains.filter(domain => {
			return domain.domain !== name;
		});

		// Triggers svelte's reactivity. This was a bug in svelte4, but I'm not sure if its necessary anymore. Keeping in case.
		domains = [...domains];
	}

	onMount(() => {
		serverContactor = new ServerContactor(getAuthToken(), localStorage.getItem("server_url"));
		serverContactor
			.getDomains()
			.catch(error => {
				if (error instanceof AuthError) {
					redirectToLogin(460);
				} else {
					console.error(error);
					domainErrorTitle = m.dashboard_domain_load_fail();
					domainErrorDescription = m.generic_fail_description();
					throw new Error("Failed to load domains");
				}
			})
			.then(data => {
				domainsLoaded = true;
				// @ts-expect-error
				const userDomains = Object.entries(data);
				Cookies.set("domain-amount", userDomains.length.toString());

				for (let [key, value] of userDomains) {
					domains.push({
						type: value.type,
						domain: key,
						value: value.ip,
						isLoading: false,
						deletionWarned: false,
						buttonDisabled: false,
						deletionLoading: false
					});
				}
			});
	});
</script>

<svelte:head>
	<title>{m.dashboard_title()} - frii.site</title>
	<meta content="frii.site dashboard" property="og:title" />
	<meta content="Manage all of your domains here!" property="og:description" />
	<meta content="Manage all of your domains here!" name="description" />
	<meta content="https://frii.site/dashboard" property="og:url" />
	<meta content="https://frii.site/fse1.webp" property="og:image" />
	<meta content="#007be1" data-react-helmet="true" name="theme-color" />
</svelte:head>

<Loader bind:this={loader} />

<div class="domain-holder bg-card max-w-8xl mt-16 mr-auto ml-auto w-11/12 rounded-2xl p-6">
	<h1 class="text-3xl font-semibold">{m.dashboard_your_domains()}</h1>
	<p>{m.dashboard_domain_explanation()}</p>

	<InlineAlert
		variant={"error"}
		title={domainErrorTitle}
		description={domainErrorDescription}
		className="mb-6 mt-6"
		trigger={alertUpdate} />

	<div class="domains space-y-2">
		{#each domainsLoaded ? domains : new Array(data.domainAmount) as domain}
			<div transition:fade class="domain mt-1 mb-1 flex h-10 space-x-1">
				<div class="basic-controls flex w-2/5 space-x-1">
					{#if domainsLoaded}
						<Select.Root type="single" name="domain" bind:value={domain.type}>
							<Select.Trigger class="w-1/8 min-w-24">{domain.type}</Select.Trigger>
							<Select.Content>
								{#each SupportedTypes as type}
									<Select.Item value={type} label={type}>
										{type}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{:else}
						<Skeleton class="w-1/8 min-w-24" />
					{/if}
					<div class="domain-name flex w-full">
						{#if domainsLoaded}
							<Input class="rounded-r-none" value={domain.domain} disabled={true} />
							<Input
								class="w-1/4 min-w-20 rounded-l-none"
								value=".frii.site"
								disabled={true} />
						{:else}
							<Skeleton class="w-full" />
						{/if}
					</div>
				</div>
				<div class="value w-2/5">
					{#if domainsLoaded}
						<Input bind:value={domain.value} />
					{:else}
						<Skeleton class="h-full w-full" />
					{/if}
				</div>
				<div class="actions flex w-1/4 space-x-0.5">
					{#if domainsLoaded}
						<Button
							loading={domain.isLoading}
							onclick={_ => {
								domain.isLoading = true;
								modifyDomain(domain);
							}}
							class="w-1/2 max-w-40">{m.dashboard_save_modification()}</Button>
						<Separator orientation={"vertical"} />
						<Button
							loading={domain.deletionLoading}
							disabled={domain.buttonDisabled}
							onclick={_ => {
								if (!domain.deletionWarned) {
									domain.deletionWarned = true;
									domain.buttonDisabled = true;
									setTimeout(() => {
										domain.buttonDisabled = false;
									}, 700);

									setTimeout(() => {
										domain.deletionWarned = false;
									}, 7000);
								} else {
									domain.deletionLoading = true;
									deleteDomain(domain.domain, domain);
								}
							}}
							class="w-1/2 max-w-40"
							variant={"destructive"}
							>{#if domain.deletionWarned}
								{m.dashboard_delete_domain_confirm()}{:else}{m.dashboard_delete_domain_button()}
							{/if}</Button>
					{:else}
						<Skeleton class="h-full w-1/2 max-w-40"></Skeleton>
						<Skeleton class="h-full w-1/2 max-w-40"></Skeleton>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<div class="registrar bg-card max-w-8xl mt-8 mr-auto mb-8 ml-auto w-11/12 rounded-2xl p-6">
	<InlineAlert
		variant={"error"}
		title={registerErrorTitle}
		description={registerErrorDescription}
		className="mb-6"
		trigger={alertUpdate} />
	<div class="content flex space-y-2 space-x-2">
		<Select.Root bind:value={newDomainType} type="single" name="domain">
			<Select.Trigger class="w-1/8 min-w-24">{newDomainType}</Select.Trigger>
			<Select.Content>
				{#each SupportedTypes as type}
					<Select.Item value={type} label={type}>
						{type}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<div class="domain-bar flex w-full">
			<Input bind:value={newDomain} class="rounded-r-none" placeholder="domain" />
			<Input class="w-1/4 min-w-20 rounded-l-none" disabled={true} value=".frii.site" />
		</div>
		<Button
			loading={registerNewDomainLoading}
			onclick={_ => {
				registerNewDomainLoading = true;
				registerDomain(newDomain, newDomainType);
			}}
			disabled={!newDomain}
			class="w-24">{m.dashboard_register_domain_button()}</Button>
	</div>
</div>

<style>
	@media (orientation: portrait), (max-width: 700px) {
		.basic-controls {
			width: 100%;
		}
		.domain {
			flex-direction: column;
			height: 8rem;
		}
		.domain div {
			height: 2.5em;
		}
		.value {
			width: 100%;
		}
		.actions {
			width: 100%;
			justify-content: space-between;
		}

		.content {
			flex-direction: column;
		}
		:global(.registrar .content button) {
			width: 100%;
		}
		.domain-holder {
			padding: 0.5em;
		}
	}
</style>
