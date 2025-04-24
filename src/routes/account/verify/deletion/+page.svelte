<script lang="ts">
    import { t } from "$lib/translations";
    import { redirectToLogin } from "$lib";
    import { CodeError, UserError, verifyDeletion } from "../../../../serverContactor";
    import Holder from "$lib/components/Holder.svelte";
    import Button from "$lib/components/Button.svelte";

    let doneVerifying:boolean = $state(false);
    let valid:boolean = $state(false);
    let clicked:boolean = $state(false);

    function confirmDeletion() {
        const urlParams = new URLSearchParams(window.location.search);

        verifyDeletion(urlParams.get("code") || "undefined")
            .catch(err => {
                if(err instanceof CodeError) console.error("Code is invalid");
                if(err instanceof UserError) console.error("User does not exist");
                valid = false;
                doneVerifying = true;
                throw new Error("Verification failed!");
            })
            .then(_ => {
                valid = true;
                doneVerifying = true;
            })
    }

    $effect(() => {
        if (valid) redirectToLogin(200,3);
        if (clicked) confirmDeletion();
    })
</script>

<Holder>
    <h1>{$t("deletion_verif_title")}</h1>
    <br>
    {#if !clicked}
        <p>{$t("account_del_desc")}</p>
        <ol>
            <li>{$t("account_del_steps_1")}</li>
            <li>{$t("account_del_steps_2")}</li>
            <li>{$t("account_del_steps_3")}</li>
            <li>{$t("account_del_steps_4")}</li>
        </ol>
        <Button on:click={_=>clicked = true} args="danger padding">{$t("account_del_agree")}</Button>
    {/if}
    <h2>
        {#if !doneVerifying && clicked}
            {$t("code_verif_loading")}
        {:else if !valid && clicked && doneVerifying}
            {$t("code_verif_loading_wrong")}
        {:else if valid && clicked && doneVerifying}
            {$t("account_verif_loading_success")}
        {/if}
    </h2>
    {#if doneVerifying}
        <p>
            {#if valid}
                {$t("account_verif_loading_success_desc")}
            {:else}
                {$t("code_verif_loading_wrong_desc")}
            {/if}
        </p>
    {/if}
</Holder>