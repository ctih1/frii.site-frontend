<script lang="ts">

    import Registrar from '$lib/components/Registrar.svelte';
    import DomainTable from "$lib/components/DomainTable.svelte";
    import Holder from '$lib/components/Holder.svelte';
    import { t, l, locale, addArguements } from '$lib/translations';
    import { ServerContactor } from '../../serverContactor';
    import { onMount } from 'svelte';
    import { redirectToLogin } from '../../helperFuncs';

// modals go bye bye !


    let domainTable: DomainTable;
    let domains: Map<any, any>;
    let domainlist: Array<Array<string>> = [];
    let serverContactor: ServerContactor;
    let domain2delete: string;
    let modalTime: number = 15;

    function showAlert(message: string) {
        alert(message);
    }

    function showConfirm(message: string): boolean {
        return confirm(message);
    }

    function handleDelete(event) {
        domain2delete = event.detail.domain;
        const confirmationMessage = addArguements($t("common.dashboard_domain_deletion_alert"), { "%domain%": domain2delete }) +
            "\n" + $t("common.dashboard_domain_deletion_description");
        if (showConfirm(confirmationMessage)) {
            modalConfirm();
        }
    }

    function handleSave(event) {
        console.log("Save event triggered", event);
        modifyDomain(event.detail.name, event.detail.value, event.detail.type);
    }

    function handleRegister(event) {
        console.log("Register event triggered", event);
        registerDomain(event.detail.domain, event.detail.type);
    }

    function registerDomain(domain: string, type: string) {

        serverContactor.registerDomain(domain, type).then(response => {
            const errorMessage = addArguements($t("common.dashboard_register_fail"), { "%domain%": domain });
            switch (response.status) {
                case 200:
                    showAlert(addArguements($t("common.dashboard_register_success"), { "%domain%": domain }) + "\n" + $t("common.dashboard_register_success_description"));
                    domainlist.push([type, domain, "0.0.0.0"]);
                    domainTable.updateDomains(domainlist);
                    break;
                case 401:
                    redirectToLogin(401);
                    break;
                case 403:
                    showAlert(errorMessage + "\n" + $t("common.login_failed_verify"));
                    break;
                case 429:
                    showAlert(errorMessage + "\n" + $t("common.dashboard_domain_limit"));
                    break;
                case 405:
                    showAlert(errorMessage + "\n" + $t("commmon.dashboard_domain_permissions"));
                    break;
                case 406:
                case 400:
                    showAlert(errorMessage + "\n" + $t("common.dashboard_invalid"));
                    break;
                case 409:
                    showAlert(errorMessage + "\n" + $t("common.dashboard_domain_use"));
                    break;
                default:
                    showAlert(errorMessage + "\n" + $t("common.unhandled_error"));
                    break;
            }
        });
    }

    function modifyDomain(name: string, value: string, type: string) {
   
        serverContactor.modifyDomain(name, value, type).then(response => {
            const errorMessage = addArguements($t("common.dashboard_modify_fail"), { "%domain%": name });
            switch (response.status) {
                case 401:
                    redirectToLogin(401);
                    break;
                case 409:
                    showAlert(errorMessage + "\n" + $t("common.dashboard_domain_not_owned"));
                    break;
                case 405:
                    showAlert(errorMessage + "\n" + $t("common.dashboard_domain_permissions"));
                    break;
                case 406:
                    showAlert(errorMessage + "\n" + $t("common.dashboard_invalid_value"));
                    break;
                case 403:
                    showAlert(errorMessage + "\n" + $t("common.dashboard_domain_not_owned"));
                    break;
                case 500:
                    showAlert(errorMessage + "\n" + $t("common.unhandled_error"));
                    break;
                case 200:
                    showAlert(addArguements($t("common.dashboard_modify_success"), { "%domain%": name }) + "\n" + $t("common.dashboard_modify_success_description"));
                    break;
            }
        });
    }

    function removeDomain(name: string) {
        domainlist = domainlist.filter(domain => domain.at(1) !== name);
        domainTable.updateDomains(domainlist);
    }

    function modalConfirm() {
        if (domain2delete) {
            serverContactor.deleteDomain(domain2delete).then(response => {
                switch (response.status) {
                    case 200:
                        showAlert(addArguements($t("common.dashboard_delete_success"), { "%domain%": domain2delete }) + "\n" + addArguements($t("common.dashboard_delete_success_description"), { "%domain%": domain2delete }));
                        removeDomain(domain2delete);
                        break;
                    default:
                        showAlert($t("common.dashboard_delete_error") + "\n" + $t("common.unhandled_error"));
                        break;
                }
            }).catch(() => {
                showAlert($t("common.unhandled_error"));
            });
        }
    }

    onMount(() => {
        if (localStorage.getItem("del-count") === "true") {
            modalTime = 3;
        }
        serverContactor = new ServerContactor(localStorage.getItem("auth-token"), localStorage.getItem("server_url"));
        serverContactor.getDomains().then(response => {
            if (response.status === 401) {
                redirectToLogin(401);
            }
            if (response.status === 404) {
                domainTable.updateDomains([[""]]);
            }
            response.json().then(data => {
                domains = new Map(Object.entries(data));
                for (let [key, value] of domains) {
                    value = new Map(Object.entries(value));
                    domainlist.push([value.get("type"), key, value.get("ip")]);
                }
                domainTable.updateDomains(domainlist);
            });
        });
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
    <DomainTable
        on:delete={handleDelete}
        on:save={handleSave}
        bind:this={domainTable}
        domains={domainlist}
    />
</Holder>
<Holder>
    <h2>{$t("common.dashboard_register_new_domain")}</h2>
    <p>{@html $t("common.dashboard_register_description")}</p>
    <Registrar on:click={handleRegister} />
</Holder>

