<script lang="ts">
	import Blur from '$lib/components/Blur.svelte';
	import Registrar from '$lib/components/Registrar.svelte';
    import DomainTable from "$lib/components/DomainTable.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Holder from '$lib/components/Holder.svelte';
    import { t,l,locale,addArguements } from '$lib/translations';
    import { ServerContactor } from '../../serverContactor';
    import { onMount } from 'svelte';
    import { redirectToLogin } from '../../helperFuncs';
    import { redirect } from '@sveltejs/kit';

    let blurBackground:Blur;
    let domainTable:DomainTable;
    let modal:Modal;
    let domains:Map<any,any>;
    let domainlist:Array<Array<string>> = [];
    let serverContactor:ServerContactor
    let domain2delete:string;

    let responseSave:Response;
    function modalClose() {
        modal.close();
        blurBackground.hide();
    }

    let modalTime:number = 15;

    function modalConfirm() {
        serverContactor.deleteDomain(domain2delete).then(response=>{
            switch(response.status) {
                case 200:
                    modal.open(addArguements($t("common.dashboard_delete_success"),{"%domain%":domain2delete}),addArguements($t("common.dashboard_delete_success_description"),{"%domain%":domain2delete}));
                    removeDomain(domain2delete)
                    break;
                default:
                    modal.open($t("common.dashboard_delete_error"),$t("common.unhandled_error"));
                    break;
            }
        })
    }

    function registerDomain(domain:string,type:string) {
        blurBackground.show();
        serverContactor.registerDomain(domain,type).then(response=>{
            const errorMessage = addArguements($t("common.dashboard_register_fail"),{"%domain%":domain})
            switch(response.status) {
                case 200:
                    modal.open(addArguements($t("common.dashboard_register_success"),{"%domain%":domain}),$t("common.dashboard_register_success_description"));
                    domainlist.push([type,domain,"0.0.0.0"]);
                    domainTable.updateDomains(domainlist);
                    break;
                case 401:
                    redirectToLogin(401);
                    break;
                case 403:
                    modal.open(errorMessage,$t("common.login_failed_verify"))
                case 429:
                    modal.open(errorMessage,$t("common.dashboard_domain_limit"));
                    break;
                case 405:
                    modal.open(errorMessage,$t("commmon.dashboard_domain_permissions"));
                    break;
                case 406:
                case 400:
                    modal.open(errorMessage,$t("common.dashboard_invalid"));
                    break;
                case 409:
                    modal.open(errorMessage, $t("common.dashboard_domain_use"));
                    break;
                default:
                    modal.open(errorMessage,$t("common.unhandled_error"));
                    break;
            }
        })
    }

    function modifyDomain(name:string,value:string,type:string) {
        blurBackground.show();
        serverContactor.modifyDomain(name,value,type).then(response=>{
            const errorMessage = addArguements($t("common.dashboard_modify_fail"),{"%domain%":name})
            switch(response.status) {
                case 401:
                    redirectToLogin(401);
                    break;
                case 409:
                    modal.open(errorMessage,$t("common.dashboard_domain_not_owned"));
                    break;
                case 405:
                    modal.open(errorMessage,$t("common.dashboard_domain_permissions"));
                    break;
                case 406:
                    modal.open(errorMessage, $t("common.dashboard_invalid_value"));
                    break;
                case 403:
                    modal.open(errorMessage,$t("common.dashboard_domain_not_owned"));
                    break;
                case 500:
                    modal.open(errorMessage,$t("common.unhandled_error"));
                    break;
                case 200:
                    modal.open(addArguements($t("common.dashboard_modify_success"),{"%domain%":name}),$t("common.dashboard_modify_success_description"))
                    break;
            }
        })
    } 

    function removeDomain(name:string) {
        domainlist=domainlist.filter(function(domain) {
            return domain.at(1)!==name
        });
        domainTable.updateDomains(domainlist);
    }

onMount(()=>{
        // stupid typescript done got fooled by the simplest trick in the book
        if(localStorage.getItem("del-count")??null===true) { 
            modalTime = 3;
        }
        serverContactor = new ServerContactor(localStorage.getItem("auth-token"),localStorage.getItem("server_url"));
        serverContactor.getDomains().then(response=>{
            if(response.status===401){redirectToLogin(401)}
            if(response.status===404){domainTable.updateDomains([[""]])}
            response.json().then(data=> {
                domains = new Map(Object.entries(data));
                for(let pair of domains) {
                    let [key,value] = pair;
                    value=new Map(Object.entries(value));
                    domainlist.push([value.get("type"),key,value.get("ip")]);
                }
                domainTable.updateDomains(domainlist);
            }
        )
    }
)});

</script>

<svelte:head>
    <title>{$t("common.dashboard_title")} - frii.site</title>
    <meta content="frii.site dashboard" property="og:title" />
    <meta content="Manage all of your domains here!" property="og:description" />
    <meta content="Manage all of your domains here!" name="description" />
    <meta content="https://frii.site/dashboard" property="og:url" />
    <meta content="https://frii.site/fse1.webp" property="og:image" />
    <meta content="#92c377" data-react-helmet="true" name="theme-color" />
</svelte:head>

<Holder>
    <h1>{$t("common.dashboard_your_domains")}</h1>
    <p>{$t("common.dashboard_domain_explanation")}</p>
    <DomainTable on:delete={(event)=>{domain2delete=event.detail.domain;modal.open(addArguements($t("common.dashboard_domain_deletion_alert"),{"%domain%":domain2delete}),$t("common.dashboard_domain_deletion_description"),modalTime,[$t("common.cancel_modal"),$t("common.continue_modal")])}} on:save={(event)=>modifyDomain(event.detail.name,
        event.detail.value,
        event.detail.type
    )} bind:this={domainTable} domains={domainlist}/>
</Holder>
<Holder>
    <h2>{$t("common.dashboard_register_new_domain")}</h2>
    <p>{@html $t("common.dashboard_register_description")}</p>
    <Registrar on:click={(event)=>registerDomain(event.detail.domain,event.detail.type)}/>
</Holder>

<Modal overrideDefault={true} on:primary={()=>modalClose()} on:secondary={()=>modalConfirm()} bind:this={modal} options={[$t("common.modal_ok")]} description={""} title={""}></Modal>
<Blur reverse={false} bind:this={blurBackground}/>
<style>

</style>
