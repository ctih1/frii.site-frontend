<script lang="ts">
	import { getAuthToken } from "$lib";
	import type { Domain } from "$lib/components/DomainTable.svelte";
	import DomainTable from "$lib/components/DomainTable.svelte";
	import Holder from "$lib/components/Holder.svelte";
	import Loader from "$lib/components/Loader.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Registrar from "$lib/components/Registrar.svelte";
	import { onMount } from "svelte";
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

	let domains: Domain[] = $state([]);
	let domainsLoaded: boolean = $state(false);

	let userConfirmedDeletion: boolean = false;
	let userDeletionDomain: string = "";

	let domainTable: DomainTable;
	let modal: Modal;
	let serverContactor: ServerContactor;
	let loader: Loader;

	function modalClose() {
		modal.close();
	}

	let modalTime: number = 15;

	function deleteDomain(domain: string) {
		modal.close();
		loader.show(undefined, m.dashboard_delete_loading_desc({ domain: domain }));
		serverContactor
			.deleteDomain(domain)
			.catch(error => {
				loader.hide();

				if (error instanceof AuthError) redirectToLogin(460);

				modal.open(m.dashboard_delete_error(), m.unhandled_error());

				throw new Error("Failed to delete domain");
			})
			.then(() => {
				loader.hide();
				window.gtag?.("event", "domain_delete");
				modal.open(
					m.dashboard_delete_success({ domain: domain }),
					m.dashboard_delete_success_description({ domain: domain })
				);
				removeDomain(domain);
			});
	}

	function registerDomain(domain: string, type: string) {
		loader.show(m.loading(), m.dashboard_register_load_desc({ domain: domain }));
		serverContactor
			.registerDomain(domain, type)
			.catch(error => {
				loader.hide();
				const errorMessage = m.dashboard_register_fail({ domain: domain });

				if (error instanceof AuthError) redirectToLogin(460);
				if (error instanceof DNSError) modal.open(errorMessage, m.dashboard_invalid());
				if (error instanceof PermissionError)
					modal.open(errorMessage, m.dashboard_domain_permissions());
				if (error instanceof LimitError)
					modal.open(errorMessage, m.dashboard_domain_limit());
				if (error instanceof ConflictError)
					modal.open(errorMessage, m.dashboard_domain_use());

				modal.open(errorMessage, m.unhandled_error());
				throw new Error("Failed to register dommain!");
			})
			.then(value => {
				loader.hide();
				window.gtag?.("event", "domain_register");
				modal.open(
					m.dashboard_register_success({ domain: domain }),
					m.dashboard_modify_success_description()
				);
				domains.push({ type, domain, value });
			});
	}

	function modifyDomain(name: string, value: string, type: string) {
		loader.show(m.loading(), m.dashboard_modify_load_desc({ domain: name }));
		serverContactor
			.modifyDomain(name, value, type)
			.catch(error => {
				loader.hide();
				const errorMessage = m.dashboard_modify_fail({ domain: name });

				if (error instanceof AuthError) redirectToLogin(460);
				if (error instanceof DNSError)
					modal.open(errorMessage, m.dashboard_invalid_value());
				if (error instanceof PermissionError)
					modal.open(errorMessage, m.dashboard_domain_permissions());

				modal.open(errorMessage, m.unhandled_error());
				throw Error("Failed to modify domain."); // stops execution to the .then block
			})
			.then(() => {
				loader.hide();
				console.log(name);
				window.gtag?.("event", "domain_modify");
				modal.open(
					m.dashboard_modify_success({ domain: name + ".frii.site" }),
					m.dashboard_modify_success_description()
				);
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
		modalTime = localStorage.getItem("del-count") ? 3 : 10;

		serverContactor = new ServerContactor(getAuthToken(), localStorage.getItem("server_url"));
		serverContactor
			.getDomains()
			.catch(error => {
				if (error instanceof AuthError) {
					redirectToLogin(460);
				} else {
					console.error(error);
					modal.open(m.dashboard_domain_load_fail(), m.generic_fail_description());
					throw new Error("Failed to load domains");
				}
			})
			.then(data => {
				domainsLoaded = true;

				// @ts-expect-error
				const userDomains = Object.entries(data);
				for (let [key, value] of userDomains) {
					domains.push({ type: value.type, domain: key, value: value.ip });
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

<Holder>
	<h1>{m.dashboard_your_domains()}</h1>
	<p>{m.dashboard_domain_explanation()}</p>
	<DomainTable
		on:delete={event => {
			userDeletionDomain = event.detail.domain;
			modal.open(
				m.dashboard_domain_deletion_alert({ domain: event.detail.domain }),
				m.dashboard_domain_deletion_description(),
				modalTime,
				[m.cancel_modal(), m.continue_modal()]
			);
		}}
		on:save={event => modifyDomain(event.detail.name, event.detail.value, event.detail.type)}
		bind:this={domainTable}
		domains={domains}
		loaded={domainsLoaded} />
</Holder>
<Holder>
	<h2>{m.dashboard_register_new_domain()}</h2>
	<p>{@html m.dashboard_register_description()}</p>
	<Registrar on:click={event => registerDomain(event.detail.domain, event.detail.type)} />
</Holder>

<Modal
	overrideDefault={true}
	on:primary={() => {
		modalClose();
		if (userDeletionDomain) userDeletionDomain = "";
	}}
	on:secondary={() => deleteDomain(userDeletionDomain)}
	bind:this={modal}
	options={[m.modal_ok()]}
	description={""}
	title={""}></Modal>
