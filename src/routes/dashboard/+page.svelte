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


    function modalConfirm() {
        serverContactor.deleteDomain(domain2delete).then(response=>{
            switch(response.status) {
                case 200:
                    modal.open($l("common.dashboard_delete_success",domain2delete),$l("common.dashboard_delete_success_description",domain2delete));
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
            switch(response.status) {
                case 200:
                    modal.open(addArguements($t("common.dashboard_register_success"),{"%domain%":domain}),$t("common.dashboard_register_success_description"));
                    break;
                case 401:
                    redirectToLogin(401);
                    break;
                case 403:
                    modal.open(addArguements($t("common.dashboard_register_fail"),{"%domain%":domain}),"You have exceeded your domain limit. Please consider purchasing more domains at https://ko-fi.com/s/123804db77");
                    break;
                case 404:
                    redirectToLogin(404);
                    break;
                case 405:
                    modal.open(addArguements($t("common.dashboard_register_fail"),{"%domain%":domain}),$t("common.dashboard_domain_limit"));
                    break;
                case 409:
                    modal.open(addArguements($t("common.dashboard_register_fail"),{"%domain%":domain}), $t("common.dashboard_invalid"));
                    break;
                case 412:
                    redirectToLogin(412);
                    break;
                default:
                    modal.open(addArguements($t("common.dashboard_register_fail"),{"%domain%":domain}),$t("common.unhandled_error"));
                    break;
            }
        })
    }

    function modifyDomain(name:string,value:string,type:string) {
        blurBackground.show();
        serverContactor.modifyDomain(name,value,type).then(response=>{
            switch(response.status) {
                case 401:
                    redirectToLogin(401);
                    break;
                case 403:
                    modal.open(addArguements($t("common.dashboard_modify_fail"),{"%domain%":name}),$t("common.dashboard_domain_not_owned"));
                    break;
                case 404:
                    redirectToLogin(404);
                    break;
                case 412:
                    redirectToLogin(412);
                    break;
                case 422:
                    modal.open(addArguements($t("common.dashboard_modify_fail"),{"%domain%":name}), $t("common.dashboard_invalid_value"));
                    break;
                case 500:
                    modal.open(addArguements($t("common.dashboard_modify_fail"),{"%domain%":name}),$t("common.unhandled_error"));
                    break;
                case 200:
                    modal.open($t("common.dashboard_modify_success"),$t("common.dashboard_modify_success_description"))
                    break;
            }
        })
    } 

    onMount(()=>{
        blurBackground.show();
	try {
		
	        serverContactor = new ServerContactor(localStorage.getItem("auth-token"),localStorage.getItem("server_url"));
	        serverContactor.getDomains().then(response=>response.json()).then(data=> {

	            domains = new Map(Object.entries(data));

	            for(let pair of domains) {
	                let [key,value] = pair;
	                value=new Map(Object.entries(value));
	                domainlist.push([value.get("type"),key,value.get("ip")]);
	            }

				blurBackground.hide();
	            domainTable.updateDomains(domainlist);
	        }).catch(err=>{console.log(err);blurBackground.hide();});
	}
	catch(e) {console.log(e);blurBackground.hide();}
	blurBackground.hide();
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
    <DomainTable on:delete={(event)=>{domain2delete=event.detail.domain;modal.open(addArguements($t("common.dashboard_domain_deletion_alert"),{"%domain%":domain2delete}),$t("common.dashboard_domain_deletion_description"),15,[$t("common.cancel_modal"),$t("common.continue_modal")])}} on:save={(event)=>modifyDomain(event.detail.name,
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
