<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { sendForgotCode,confirmPasswordChange } from './../../../serverContactor';
	import Button from '$lib/components/Button.svelte';
    import { t } from '$lib/translations';
    import Holder from "$lib/components/Holder.svelte";
    const params:URLSearchParams = new URLSearchParams(window.location.search);
    
    let code:string|null = params.get("c");
    let generatingNew:boolean = code!==null;
    
    function handleButton(event:any) {
        if(generatingNew) {
            if(password!==cPassword) {modal.open($t("common.signup_password_not_match"),$t("common.signup_password_not_match_description"));return;}
            confirmPasswordChange(code??"",password).then(response=>{
                if(response.status===200) {
                    modal.open($t("common.account_recovery_success"),$t("common.account_recovery_success_description"));
                    return;
                } else {
                    modal.open($t("common.account_recovery_fail"),$t("common.account_recovery_fail_description"))
                }
            })
        } else {
            sendForgotCode(username).then(response=> {
                if(response.status===200) {
                    modal.open($t("common.account_recovery_sent"),$t("common.account_recovery_sent_description"));
                    return;
                } else {
                    modal.open($t("common.account_recovery_start_fail"),$t("common.account_recovery_start_fail_description"));
                    return;
                }
            })
        }
    }

    let cPassword:string;
    let password:string;
    let username:string;

    let modal:Modal;
</script>
<Modal countdown={undefined} description="" title="" options={[$t("common.modal_ok")]} bind:this={modal}/>
<Holder>
    {#if generatingNew}
        <h1>{$t("common.account_recovery_title")}</h1>
        <input  bind:value={password} placeholder={$t("common.password_placeholder")}>
        <input bind:value={cPassword} placeholder={$t("common.confirm_password_placeholder")}>
    {:else}
        <h1>{$t("common.account_recovery_title")}</h1>
        <p>{$t("common.account_recovery_description")}</p>
        <input bind:value={username} placeholder={$t("common.username_placeholder")}>
    {/if}
    <Button on:click={handleButton} args="fill padding margin-1em-top">{$t("common.security_report_submit")}</Button>
</Holder>

<style>
</style>