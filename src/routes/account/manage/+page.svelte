<script lang="ts">
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Button from '$lib/components/Button.svelte';
    import Holder from "$lib/components/Holder.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Placeholder from '$lib/components/Placeholder.svelte';
    import { onMount } from 'svelte';
    import { redirectToLogin,createFile } from '../../../helperFuncs';
    import { ServerContactor } from '../../../serverContactor';
    import Section from '$lib/components/Section.svelte';
    import Blur from '$lib/components/Blur.svelte';
    import { t, locale, locales, addArguements } from '$lib/translations';
    import Switch from '$lib/components/Switch.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';

    let serverContactor:ServerContactor;
    let modal:Modal;
    let noConfirm:boolean=true;

    let blurElement:Blur;
    let emailE:string;
    let usernameE:string;
    let loaded:boolean=false;
    let verified:boolean=false;
    onMount(()=>{
        serverContactor=new ServerContactor(localStorage.getItem("auth-token"),localStorage.getItem("server_url"));
        getData();
    })



    function getData() {
        serverContactor.getAccountDetails().then(response=>response.json()).then(data=>{
            console.log(data);
            emailE=addArguements($t("common.account_email"),{"%email%":data["email"]});
            usernameE=addArguements($t("common.account_username"),{"%username%":data["username"]});
            loaded=true;
            verified=data["verified"];
        })
    }

    function handleDelete() {
        if(noConfirm) {
            modal.open($t("common.account_deletion_confirm"),$t("common.account_delete_confirm_description"),15,[$t("common.modal_cancel"),$t("common.modal_continue")]);
            noConfirm=false;
            return;
        }
        serverContactor.deleteAccoint().then(response=>{
            switch(response.status) {
                case 412:
                    redirectToLogin(412);
                    break;
                case 404:
                    modal.open($t("common.account_deletion_fail"),$t("common.account_deletion_fail_description"))
                    break;
                case 401:
                    redirectToLogin(401);
                    break;
                case 200:
                    modal.open($t("common.account_check_email"),$t("common.account_check_email_description"));
                    break;
            }
        })
    }
    function gpdrData() {
        serverContactor.getGDPR().then(response=>response.json()).then(data=>{
            createFile("data.json",JSON.stringify(data));
        });
    }
    function logOut() {
        localStorage.removeItem("logged-in");
        localStorage.removeItem("auth-token");
        redirectToLogin(200);
    }
</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
<Blur bind:this={blurElement}/>
<Holder>
    <h1>{$t("common.account_management")}</h1>
    <Section title={$t("common.account_details")} id="details">
        <div class="details">
            {#if loaded} 
                <h3 style="display: flex; align-items:center; width: fit-content;">{emailE}{#if verified}<verified style="margin-left: 0.5em;"><span  class="material-symbols-outlined">check</span></verified>{/if}</h3>
                <h3>{usernameE} <Tooltip>{$t("common.account_username_tooltip")}</Tooltip></h3>
            {:else} 
                <h3 style="height: 1em; width:20vw;"><Placeholder/></h3>
                <h3 style="height: 1em; width:20vw;"><Placeholder/></h3>
            {/if}
        </div>
    </Section>
    <h1>{$t("common.account_manage_account")}</h1>
    <Section title={$t("common.account_manage")} id="manage">
        <div class="switch">
            <p>{$t("common.account_domain_del_cooldown")}</p>
            <Switch initial={(localStorage.getItem("del-count")??"false")=="true"} on:change={(event)=>{localStorage.setItem("del-count",event.detail)}}/>
        </div>
        <div class="switch">
            <p>{$t("common.account_version_testing")}</p>
            <Switch initial={(localStorage.getItem("allow-testing")??"false")=="true"} on:change={(event)=>{localStorage.setItem("allow-testing",event.detail)}}/>
        </div>
        <div class="buttons">
            <div><Button on:click={()=>gpdrData()} args={"padding"}>{$t("common.account_download_data")}</Button></div>
            <div><Button on:click={()=>logOut()} args={"padding danger"}>{$t("common.account_log_out")}</Button></div>
            <div class="danger">
                <Button args={"danger padding"} on:click={()=>handleDelete()}>{$t("common.account_delete_account")}</Button>
            </div>
        </div>
    </Section>
</Holder>

<Modal bind:this={modal} on:secondary={()=>handleDelete()} options={[$t("common.continue_modal")]} title={""} description={""}></Modal>

<style>
    .buttons div {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }
    .switch {
        align-items: center;
        display: flex;
        flex-direction: row;
    }
    .switch * {
        width: fit-content;
    }
    .switch p {
        margin-right: 1em;
    }
    verified {
        align-items: center;
        justify-content: center;
        display: flex;
        background-color: var(--primary);
        border-radius: 50%;
        height: 1.5em;
        width: 1.5em;
    }
    verified span {
        color: white;
    }
</style>