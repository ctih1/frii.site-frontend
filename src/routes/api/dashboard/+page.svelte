<script lang="ts">
    import Cookies from 'js-cookie';
    import {getAuthToken} from "$lib";

	import Pool from '$lib/components/Pool.svelte';
    import Holder from "$lib/components/Holder.svelte";
    import ApiKeyTable from "$lib/components/ApiKeyTable.svelte";
    import Button from "$lib/components/Button.svelte";
    import { ServerContactor } from '../../../serverContactor';
    import InputCompletor from "$lib/components/InputCompletor.svelte";
    import { t } from '$lib/translations';
    import { onMount } from 'svelte';
    import Modal from "$lib/components/Modal.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import { redirectToLogin } from '../../../helperFuncs';
    let domainPool:Pool;
    let loader:Loader;
    let modal:Modal;
    let permPool:Pool;
    let comment:string;

    interface key {
      key:string;
      comment:string;
      perms: string[]
      domains: string[];
    }

    let keys: key[];
    let loaded:boolean = false;
    let exampleData = {"key":"agiNAgn","comment":"This is a doman test test! And this is my life story. I was born in helsinki and lived a peaceful life for the end of time", "permissions": {"edit":{"content":true,"type":true,"domain":true},"view":true,"delete":true},"domains":["testing","anothertesting"]}
    let sc:ServerContactor;
    onMount(()=>{
        sc = new ServerContactor(getAuthToken());
        loader.show(undefined,$t("api_dashboard_loading"))
        sc.getApiKeys().then(response=>{
            if(response.status===460) {redirectToLogin(460)};
            response.json().then(data=>{
              console.log(data);
              keys = data as key[]
              loader.hide();
              loaded = true;
            })
        });
        sc.getDomains().then(response=>{
        if(response.status!==200) { modal.open($t("api_dashboard_domain_load_fail"),$t("api_dashboard_domain_load_fail_description")) }
            response.json().then(data=>{
              formatDomains(data);
            });
        })
    })

    let input:InputCompletor;
    let domainInput:InputCompletor;
    let domains:{displayText:string,valueText:string}[] = [];
    let valueDomains:string[] = [];
    let permissions:string[] = [];

    function formatDomains(data:Map<string,any>) {
        new Map(Object.entries(data)).forEach((key,value)=>{
            domains.push({displayText:value+(key["type"]==="TXT"?"":".frii.site"), valueText:value});
        })
        domains = [...domains]
    }

    function addItem(pool:Pool,detail:{displayText:string,valueText:string}) {
        pool.addItem(detail);
    }

    function undoRemove(ic:InputCompletor,item:{displayText:string,valueText:string}):void {
        ic.removeFromDeleted(item);
    }

    function submitKey() {
      domainPool.get().forEach((element:{displayText:string,valueText:string})=>{
        valueDomains.push(element.valueText);
      });
      permPool.get().forEach((element:{displayText:string,valueText:string})=>{
        permissions.push(element.valueText);
      });
      console.log(valueDomains);
      console.log(permissions);
      loader.show(undefined,$t("api_dashboard_create_loading_desc"))
      sc.createApi(valueDomains,permissions,comment).then(response=>{
        loader.hide();
        if(response.status===403) {
            modal.open($t("api_dashboard_create_fail"),$t("api_dashboard_create_fail_domains"));
        } else if(response.status===460) {
            redirectToLogin(460)
        } else if(response.status===200) {
            modal.open($t("api_dashboard_create_success"),$t("api_dashboard_create_success_description"));
            location.reload();
        }
      }
      )
    }

</script>

<Loader bind:this={loader}/>
<Modal bind:this={modal}/>
<Holder>
    <h1>{$t("api_title")}</h1>
    {#if loaded}
        <ApiKeyTable keys={keys}></ApiKeyTable>
    {/if}
</Holder>

<Holder>
    <h1>{$t("api_dashboard_create_title")}</h1>
    <form>
        <div class="form-item">
            <p>{$t("api_dashboard_comment_section")}</p>
            <input bind:value={comment} type="text" style="min-height: 2em;" placeholder={$t("api_dashboard_comment_placeholder")}>
        </div>
        <div class="form-item">
            <div class="flex">
                <p>{$t("api_dashboard_permission_section")}</p>
                <div class="permissions">
                    <InputCompletor bind:this={input}  on:enter={(event)=>(addItem(permPool,event.detail))} suggestions={[
                        {displayText:$t("api_dashboard_delete_perm"),valueText:"delete"},
                        {displayText:$t("api_dashboard_modify_type_perm"),valueText:"type"},
                        {displayText:$t("api_dashboard_modify_domain_perm"),valueText:"domain"},
                        {displayText:$t("api_dashboard_modify_content_perm"),valueText:"content"},
                        {displayText:$t("api_dashboard_view_perm"),valueText:"view"}
                    ]} inputPlaceholder={$t("api_dashboard_permission_input_placehoder")} removeUsed={true}/>
                    <Pool bind:this={permPool} items={[]} on:remove={(event)=>{undoRemove(input,event.detail)}}></Pool>
                </div>
            </div>
        </div>
        <div class="form-item">
            <div class="flex">
                <p>{$t("api_dashboard_domains_section")}</p>
                <InputCompletor bind:this={domainInput}  on:enter={(event)=>(addItem(domainPool,event.detail))} suggestions={domains} inputPlaceholder="Domains" removeUsed={true}/>
                <Pool bind:this={domainPool} items={[]} on:remove={(event)=>{undoRemove(domainInput,event.detail)}}></Pool>
            </div>
        </div>
        <Button on:click={()=>submitKey()} args="fill padding">{$t("api_dashboard_create_button")}</Button>
    </form>
</Holder>

<style>
    .form-item {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .flex {
        display: flex;
        flex-direction: row;
        align-items:start;
    }
    .permissions {
        height: max-content;
        display: flex;
        flex-direction: row;
    }
    .flex * {
        margin-top: 0px;
        margin-left: 0.25em;
        margin-right: 0.25em;
    }
    @media(max-width: 1220px) {

    }
</style>
