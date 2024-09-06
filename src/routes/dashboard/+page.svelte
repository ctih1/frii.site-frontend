<script lang="ts">
    import Loader from '$lib/components/Loader.svelte';  
    import Registrar from '$lib/components/Registrar.svelte';
    import DomainTable from "$lib/components/DomainTable.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Button from "$lib/components/Button.svelte";
    import Holder from '$lib/components/Holder.svelte';
    import { t, l, locale, addArguements } from '$lib/translations';
    import { ServerContactor } from '../../serverContactor';
    import { onMount } from 'svelte';
    import { redirectToLogin } from '../../helperFuncs';
    import { redirect } from '@sveltejs/kit';

    let loader;  

    let domainTable: DomainTable;
    let modal: Modal;
    let domains: Map<any, any>;
    let domainlist: Array<Array<string>> = [];
    let savedDomains: Array<Array<string>> = [];
    let serverContactor: ServerContactor;
    let domain2delete: string;

    let responseSave: Response;

    function modalClose() {
        modal.close();
        closeLoader();  
    }

    let modalTime: number = 15;

    function modalConfirm() {
        serverContactor.deleteDomain(domain2delete).then(response => {
            switch (response.status) {
                case 200:
                    modal.open(addArguements($t("common.dashboard_delete_success"), { "%domain%": domain2delete }), addArguements($t("common.dashboard_delete_success_description"), { "%domain%": domain2delete }));
                    removeDomain(domain2delete);
                    break;
                default:
                    modal.open($t("common.dashboard_delete_error"), $t("common.unhandled_error"));
                    break;
            }
        });
    }

    function registerDomain(domain: string, type: string) {
        openLoader(); 
        serverContactor.registerDomain(domain, type).then(response => {
            const errorMessage = addArguements($t("common.dashboard_register_fail"), { "%domain%": domain });
            switch (response.status) {
                case 200:
                    modal.open(addArguements($t("common.dashboard_register_success"), { "%domain%": domain }), $t("common.dashboard_register_success_description"));
                    domainlist.push([type, domain, "0.0.0.0"]);
                    domainTable.updateDomains(domainlist);
                    break;
                case 401:
                    redirectToLogin(401);
                    break;
                case 403:
                    modal.open(errorMessage, $t("common.login_failed_verify"));
                case 429:
                    modal.open(errorMessage, $t("common.dashboard_domain_limit"));
                    break;
                case 405:
                    modal.open(errorMessage, $t("commmon.dashboard_domain_permissions"));
                    break;
                case 406:
                case 400:
                    modal.open(errorMessage, $t("common.dashboard_invalid"));
                    break;
                case 409:
                    modal.open(errorMessage, $t("common.dashboard_domain_use"));
                    break;
                default:
                    modal.open(errorMessage, $t("common.unhandled_error"));
                    break;
            }
            closeLoader();  
        });
    }

    function modifyDomain(name: string, value: string, type: string) {
        openLoader(); 
        serverContactor.modifyDomain(name, value, type).then(response => {
            const errorMessage = addArguements($t("common.dashboard_modify_fail"), { "%domain%": name });
            switch (response.status) {
                case 401:
                    redirectToLogin(401);
                    break;
                case 409:
                    modal.open(errorMessage, $t("common.dashboard_domain_not_owned"));
                    break;
                case 405:
                    modal.open(errorMessage, $t("common.dashboard_domain_permissions"));
                    break;
                case 406:
                    modal.open(errorMessage, $t("common.dashboard_invalid_value"));
                    break;
                case 403:
                    modal.open(errorMessage, $t("common.dashboard_domain_not_owned"));
                    break;
                case 500:
                    modal.open(errorMessage, $t("common.unhandled_error"));
                    break;
                case 200:
                    modal.open(addArguements($t("common.dashboard_modify_success"), { "%domain%": name }), $t("common.dashboard_modify_success_description"));
                    break;
            }
            closeLoader(); 
        });
    }

    function removeDomain(name: string) {
        domainlist = domainlist.filter(domain => domain.at(1) !== name);
        domainTable.updateDomains(domainlist);
    }

    function saveDomains() {
        localStorage.setItem('savedDomains', JSON.stringify(domainlist));
        modal.open($t("common.save_success"), $t("common.domains_saved"));
    }

    function loadSavedDomains() {
        const savedDomainsString = localStorage.getItem('savedDomains');
        if (savedDomainsString) {
            savedDomains = JSON.parse(savedDomainsString);
            domainTable.updateDomains(savedDomains);
        } else {
            modal.open($t("common.restore_error"), $t("common.no_saved_domains"));
        }
    }

    function openLoader() {
        if (loader) {
            loader.show('Loading', '');
        }
    }

    function closeLoader() {
        if (loader) {
            loader.hide();
        }
    }

    onMount(() => {
        if (localStorage.getItem("del-count") ?? null === true) {
            modalTime = 3;
        }
        serverContactor = new ServerContactor(localStorage.getItem("auth-token"), localStorage.getItem("server_url"));
        serverContactor.getDomains().then(response => {
            if (response.status === 401) { redirectToLogin(401); }
            if (response.status === 404) { domainTable.updateDomains([[""]]); }
            response.json().then(data => {
                domains = new Map(Object.entries(data));
                for (let pair of domains) {
                    let [key, value] = pair;
                    value = new Map(Object.entries(value));
                    domainlist.push([value.get("type"), key, value.get("ip")]);
                }
                domainTable.updateDomains(domainlist);
            });
        });
        if (modal) {
            closeLoader()
        }
    });
</script>

<svelte:head>
    <title>{$t("common.dashboard_title")} - frii.site</title>
    <meta content="frii.site dashboard" property="og:title" />
    <meta content="Manage all of your domains here!" property="og:description" />
    <meta content="Manage all of your domains here!" name="description" />
    <meta content="https://frii.site/dashboard" property="og:url" />
    <meta content="https://frii.site/fse1.webp" property="og:image" />
    <meta content="#007be1" data-react-helmet="true" name="theme-color" />
</svelte:head>

<Holder>
    <h1>{$t("common.dashboard_your_domains")}</h1>
    <p>{$t("common.dashboard_domain_explanation")}</p>
    <DomainTable on:delete={(event) => { domain2delete = event.detail.domain; modal.open(addArguements($t("common.dashboard_domain_deletion_alert"), { "%domain%": domain2delete }), $t("common.dashboard_domain_deletion_description"), modalTime, [$t("common.cancel_modal"), $t("common.continue_modal")]) }} on:save={(event) => modifyDomain(event.detail.name, event.detail.value, event.detail.type)} bind:this={domainTable} domains={domainlist} />
</Holder>

<Holder>
    <h2>{$t("common.dashboard_register_new_domain")}</h2>
    <p>{@html $t("common.dashboard_register_description")}</p>
    <Registrar on:click={(event) => registerDomain(event.detail.domain, event.detail.type)} />
</Holder>
<!--
<Holder>

    <x class="bh">
        <Button on:click={saveDomains} args={"padding"}>
          <a style="color: #ffffff;" href="#">{$t("common.save_domains")}</a>
        </Button>
        <Button on:click={loadSavedDomains} args={"padding"}>
            <a style="color: #ffffff;" href="#">{$t("common.show_saved_domains")}</a>
        </Button> 
    </x>
</Holder>
-->

<Modal overrideDefault={true} on:primary={() => modalClose()} on:secondary={() => modalConfirm()} bind:this={modal} options={[$t("common.modal_ok")]} description={""} title={""}></Modal>
<Loader bind:this={loader} /> 
<style>
</style>
