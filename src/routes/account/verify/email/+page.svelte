<script lang="ts">
    import { onMount } from "svelte";
    import { t } from "$lib/translations";
    import { redirectToLogin } from "$lib";
    import { CodeError, UserError, verifyEmail } from "../../../../serverContactor";
    import Holder from "$lib/components/Holder.svelte";

    let doneVerifying:boolean = $state(false);
    let valid:boolean = $state(false);

    onMount(()=>{
        const urlParams = new URLSearchParams(window.location.search);

        verifyEmail(urlParams.get("code") || "undefined")
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
    });

    $effect(() => {
        if(valid) redirectToLogin(200)
    })
</script>

<Holder>
    <h1>{$t("email_verif_title")}</h1>
    <br>
    <h2>
        {#if !doneVerifying}
            {$t("code_verif_loading")}
        {:else if !valid}
            {$t("code_verif_loading_wrong")}
        {:else if valid}
            {$t("code_verif_loading_success")}
        {/if}
    </h2>
    {#if doneVerifying}
        <p>
            {#if valid}
                {$t("code_verif_loading_success_desc")}
            {:else}
                {$t("code_verif_loading_wrong_desc")}
            {/if}
        </p>
    {/if}
</Holder>