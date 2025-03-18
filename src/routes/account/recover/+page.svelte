<script lang="ts">
    import { browser } from "$app/environment"

    import Holder from "$lib/components/Holder.svelte";
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';

    import { sendForgotCode,confirmPasswordChange } from './../../../serverContactor';
    import { t } from '$lib/translations';

    let generatingNew:boolean = false;
    let code:string|null = null
    if(browser) {
        const params:URLSearchParams = new URLSearchParams(window.location.search);
        code = params.get("c");
        generatingNew = code!==null;
    }

    function handleButton(event:any) {
        if(generatingNew) {
            if(password!==cPassword) {modal.open($t("signup_password_not_match"),$t("signup_password_not_match_description"));return;}
            confirmPasswordChange(code??"",password).then(response=>{
                if(response.status===200) {
                    modal.open($t("account_recovery_success"),$t("account_recovery_success_description"));
                    return;
                } else {
                    modal.open($t("account_recovery_fail"),$t("account_recovery_fail_description"))
                }
            })
        } else {
            sendForgotCode(username).then(response=> {
                if(response.status===200) {
                    modal.open($t("account_recovery_sent"),$t("account_recovery_sent_description"));
                    return;
                } else {
                    modal.open($t("account_recovery_start_fail"),$t("account_recovery_start_fail_description"));
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
<Modal countdown={undefined} description="" title="" options={[$t("modal_ok")]} bind:this={modal}/>
<Holder>
    {#if generatingNew}
        <h1>{$t("account_recovery_title")}</h1>
        <input  bind:value={password} placeholder={$t("password_placeholder")}>
        <input bind:value={cPassword} placeholder={$t("confirm_password_placeholder")}>
    {:else}
        <h1>{$t("account_recovery_title")}</h1>
        <p>{$t("account_recovery_description")}</p>
        <input bind:value={username} placeholder={$t("username_placeholder")}>
    {/if}
    <Button on:click={handleButton} args="fill padding margin-1em-top">{$t("security_report_submit")}</Button>
</Holder>

<style>
</style>