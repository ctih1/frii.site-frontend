<script lang="ts">
	import Registrar from '$lib/components/Registrar.svelte';
    import DomainTable from "$lib/components/DomainTable.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Holder from '$lib/components/Holder.svelte';
    import Loader from "$lib/components/Loader.svelte";
    import { t,l,locale,addArguements } from '$lib/translations';
    import { AuthError, ConflictError, DNSError, LimitError, PermissionError, ServerContactor } from '../../serverContactor';
    import { onMount } from 'svelte';
    import { redirectToLogin } from '../../helperFuncs';
    import { getAuthToken } from "$lib";

    let domainTable:DomainTable;
    let modal:Modal;
    let domains:Map<any,any>;
    let domainlist:Array<Array<string>> = [];
    let serverContactor:ServerContactor
    let domain2delete:string;
    let loader:Loader;

    function modalClose() {
        modal.close();
    }

    let modalTime:number = 15;

    function modalConfirm() {
      loader.show(undefined,addArguements($t("dashboard_delete_loading_desc"),{"%domain%":domain2delete}))
      serverContactor.deleteDomain(domain2delete).catch(error => {
        loader.hide();

        if(error instanceof AuthError) redirectToLogin(460);

        modal.open($t("dashboard_delete_error"),$t("unhandled_error"));

        throw new Error("Failed to delete domain");
      }).then(() => {
            loader.hide();
            modal.open(addArguements($t("dashboard_delete_success"),{"%domain%":domain2delete}),addArguements($t("dashboard_delete_success_description"),{"%domain%":domain2delete}));
            removeDomain(domain2delete)
      })
    }

    function registerDomain(domain:string,type:string) {
        loader.show($t("loading"), addArguements($t("dashboard_register_load_desc"),{"%domain%":domain}));
        serverContactor.registerDomain(domain,type)
        .catch(error=>{
            loader.hide();
            const errorMessage = addArguements($t("dashboard_register_fail"),{"%domain%":domain})

            if(error instanceof AuthError) redirectToLogin(460);
            if(error instanceof DNSError) modal.open(errorMessage,$t("dashboard_invalid"));
            if(error instanceof PermissionError)  modal.open(errorMessage,$t("dashboard_domain_permissions"));
            if(error instanceof LimitError) modal.open(errorMessage,$t("dashboard_domain_limit"));
            if(error instanceof ConflictError) modal.open(errorMessage, $t("dashboard_domain_use"));

            throw new Error("Failed to register dommain!");
        })
        .then(()=>{
            loader.hide();
            modal.open(addArguements($t("dashboard_register_success"),{"%domain%":name}),$t("dashboard_modify_success_description"));
        })
        
    }

    function modifyDomain(name:string,value:string,type:string) {
        loader.show($t("loading"),addArguements($t("dashboard_modify_load_desc"),{"%domain%":name}));
        serverContactor.modifyDomain(name,value,type)
        .catch(error=>{
            loader.hide();
            const errorMessage = addArguements($t("dashboard_modify_fail"),{"%domain%":name});

            if(error instanceof AuthError) redirectToLogin(460);
            if(error instanceof DNSError) modal.open(errorMessage, $t("dashboard_invalid_value"));
            if(error instanceof PermissionError) modal.open(errorMessage, $t("dashboard_domain_permissions"));

            throw Error("Failed to modify domain."); // stops execution to the .then block
        }).then(()=>{
            loader.hide();
            console.log(name);
            modal.open(addArguements($t("dashboard_modify_success"),{"%domain%":name+".frii.site"}),$t("dashboard_modify_success_description"));
        });
    }

    function removeDomain(name:string) {
        domainlist=domainlist.filter(function(domain) {
            return domain.at(1)!==name
        });
        domainTable.updateDomains(domainlist);
    }

    onMount(()=>{
        modalTime = localStorage.getItem("del-count") ? 3 : 15;

        serverContactor = new ServerContactor(getAuthToken(),localStorage.getItem("server_url"));
        serverContactor.getDomains()
        .catch(error=>{
            if(error instanceof AuthError) {
                redirectToLogin(460);
            };
        })
        .then(data=>{
            //@ts-ignore
            let domains = Object.entries(data);
            for(let [key,value] of domains) {
                domainlist.push([value.type,key,value.ip]);
            }
            domainTable.updateDomains(domainlist);
        });
    }
);

</script>

<svelte:head>
    <title>{$t("dashboard_title")} - frii.site</title>
    <meta content="frii.site dashboard" property="og:title" />
    <meta content="Manage all of your domains here!" property="og:description" />
    <meta content="Manage all of your domains here!" name="description" />
    <meta content="https://frii.site/dashboard" property="og:url" />
    <meta content="https://frii.site/fse1.webp" property="og:image" />
    <meta content="#007be1" data-react-helmet="true" name="theme-color" />
</svelte:head>

<Loader bind:this={loader}/>

<Holder>
    <h1>{$t("dashboard_your_domains")}</h1>
    <p>{$t("dashboard_domain_explanation")}</p>
    <DomainTable on:delete={(event)=>{domain2delete=event.detail.domain;modal.open(addArguements($t("dashboard_domain_deletion_alert"),{"%domain%":domain2delete}),$t("dashboard_domain_deletion_description"),modalTime,[$t("cancel_modal"),$t("continue_modal")])}} on:save={(event)=>modifyDomain(event.detail.name,
        event.detail.value,
        event.detail.type
    )} bind:this={domainTable} domains={domainlist}/>
</Holder>
<Holder>
    <h2>{$t("dashboard_register_new_domain")}</h2>
    <p>{@html $t("dashboard_register_description")}</p>
    <Registrar on:click={(event)=>registerDomain(event.detail.domain,event.detail.type)}/>
</Holder>

<Modal overrideDefault={true} on:primary={()=>modalClose()} on:secondary={()=>modalConfirm()} bind:this={modal} options={[$t("modal_ok")]} description={""} title={""}></Modal>
<style>

</style>
