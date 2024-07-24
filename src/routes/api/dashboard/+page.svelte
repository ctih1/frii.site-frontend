<script lang="ts">
	import Pool from '$lib/components/Pool.svelte';
    import Holder from "$lib/components/Holder.svelte";
    import ApiKeyTable from "$lib/components/ApiKeyTable.svelte";
    import Button from "$lib/components/Button.svelte";
    import { ServerContactor } from '../../../serverContactor';
    import InputCompletor from "$lib/components/InputCompletor.svelte";
    import { t } from '$lib/translations';
    import { onMount } from 'svelte';
    let domainPool:Pool;
    let permPool:Pool;
    let exampleData = {"key":"agiNAgn","comment":"This is a doman test test! And this is my life story. I was born in helsinki and lived a peaceful life for the end of time", "permissions": {"edit":{"content":true,"type":true,"domain":true},"view":true,"delete":true},"domains":["testing","anothertesting"]}

    onMount(()=>{
        let sc:ServerContactor = new ServerContactor(localStorage.getItem("auth-token"));
        sc.getDomains().then(response=>response.json()).then(data=> {
            formatDomains(data);
        }
        )
    })

    let input:InputCompletor;
    let domainInput:InputCompletor;
    let domains:{displayText:string,valueText:string}[] = [];

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

</script>

<Holder>
    <h1>{$t("common.api_title")}</h1>
    <ApiKeyTable keys={[exampleData,exampleData]}></ApiKeyTable>
</Holder>

<Holder>
    <h1>{$t("common.api_dashboard_create_title")}</h1>
    <form>
        <div class="form-item">
            <p>{$t("common.api_dashboard_comment_section")}</p>
            <input type="text" style="min-height: 2em;" placeholder={$t("common.api_dashboard_comment_placeholder")}>
        </div>
        <div class="form-item">
            <div class="flex">
                <p>{$t("common.api_dashboard_permission_section")}</p>
                <div class="permissions">
                    <InputCompletor bind:this={input}  on:enter={(event)=>(addItem(permPool,event.detail))} suggestions={[
                        {displayText:$t("common.api_dashboard_delete_perm"),valueText:"delete"},
                        {displayText:$t("common.api_dashboard_modify_type_perm"),valueText:"type"},
                        {displayText:$t("common.api_dashboard_modify_domain_perm"),valueText:"domain"},
                        {displayText:$t("common.api_dashboard_modify_content_perm"),valueText:"content"},
                        {displayText:$t("common.api_dashboard_view_perm"),valueText:"view"}
                    ]} inputPlaceholder={$t("common.api_dashboard_permission_input_placehoder")} removeUsed={true}/>
                    <Pool bind:this={permPool} items={[]} on:remove={(event)=>{undoRemove(input,event.detail)}}></Pool>
                </div>
            </div>
        </div>
        <div class="form-item">
            <div class="flex">
                <p>{$t("common.api_dashboard_domains_section")}</p>
                <InputCompletor bind:this={domainInput}  on:enter={(event)=>(addItem(domainPool,event.detail))} suggestions={domains} inputPlaceholder="Domains" removeUsed={true}/>
                <Pool bind:this={domainPool} items={[]} on:remove={(event)=>{undoRemove(domainInput,event.detail)}}></Pool>
            </div>
        </div>
        <Button args="fill padding">{$t("common.api_dashboard_create_button")}</Button>
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