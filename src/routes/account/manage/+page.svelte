<script lang="ts">
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Button from '$lib/components/Button.svelte';
    import Holder from "$lib/components/Holder.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { onMount } from 'svelte';
    import { redirectToLogin,createFile } from '../../../helperFuncs';
    import { ServerContactor } from '../../../serverContactor';
    import Section from '$lib/components/Section.svelte';
    import Blur from '$lib/components/Blur.svelte';
    import { t, locale, locales, addArguements } from '$lib/translations';

    let serverContactor:ServerContactor;
    let modal:Modal;
    let noConfirm:boolean=true;

    let blurElement:Blur;
    let emailE:HTMLElement;
    let usernameE:HTMLElement;

    onMount(()=>{
        serverContactor=new ServerContactor(localStorage.getItem("auth-token"),localStorage.getItem("server_url"));
        getData();
    })



    function getData() {
        blurElement.show();
        serverContactor.getAccountDetails().then(response=>response.json()).then(data=>{
            emailE.innerHTML=addArguements($t("common.account_email"),{"%email%":data["email"]});
            usernameE.innerHTML=addArguements($t("common.account_username"),{"%username%":data["username"]});
            blurElement.hide();
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
<Blur bind:this={blurElement}/>
<Holder>
    <h1>{$t("common.account_management")}</h1>
    <Section title={$t("common.account_details")} id="details">
        <div class="details">
            <h3 bind:this={emailE}>Email</h3>
            <h3 bind:this={usernameE}>Username</h3>
        </div>
    </Section>
    <h1>{$t("common.account_manage_account")}</h1>
    <Section title={$t("common.account_manage")} id="manage">
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
</style>