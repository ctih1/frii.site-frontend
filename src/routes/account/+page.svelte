<script lang="ts">
    import { t } from '$lib/translations';
    import Button from "$lib/components/Button.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Loader from '$lib/components/Loader.svelte';
    import { createToken, ServerContactor } from "../../serverContactor";
    import Modal from "$lib/components/Modal.svelte";
    import Holder from "$lib/components/Holder.svelte";
    let serverContactor: ServerContactor|undefined = undefined;
    
    let username: string;
    let password: string;
    let repeatPassword:string;
    let email:string
    let modal:Modal;
    let redirectURL:string|null; 
    let loader;

    function openLoader() {
        if (loader) {
            loader.show('Loading', '');
        }
    }
    function closeLoader() {
        if (loader) {
            loader.hide();
        }
    }
    function modalClose() {
        modal.close();
    }
    function modalSecondary() {

    }

    onMount(()=>{
        serverContactor = new ServerContactor(localStorage.getItem("auth-token"),localStorage.getItem("server_url"));
        redirectURL=$page.url.searchParams.get("r");
        if(localStorage.getItem("logged-in")==="y") {
            window.location.href="/account/manage";
            return;
        }
    });
    let login:boolean=true;

    async function accountActionButtonClick() {
    openLoader();
    if (serverContactor === undefined) {
        return;
    }

    try {
        let modalTitle = '';
        let modalDescription = '';
        let modalOptions: string[] = [];

        if (login) {
            const response = await serverContactor.login(username, password);

            switch (response) {
                case 422:
                    modalTitle = $t("common.login_failed");
                    modalDescription = $t("common.login_generic_error");
                    break;
                case 401:
                    modalTitle = $t("common.login_failed");
                    modalDescription = $t("common.login_failed_description");
                    break;
                case 417:
                    const token = await createToken(username, password);
                    localStorage.setItem("verif-token", token);
                    modalTitle = $t("common.login_failed_verify");
                    modalDescription = $t("common.login_failed_verify_description");
                    modalOptions = ["Resend Verification Code"]; // Set specific options for this case
                    break;
                case 200:
                    //@ts-ignore
                    localStorage.setItem("auth-token", localStorage.getItem("temp-token")); // this should **never** break
                    localStorage.removeItem("temp-token");
                    localStorage.setItem("logged-in", "y");
                    if (redirectURL === null) {
                        redirectURL = "/";
                    }
                    closeLoader();
                    window.location.href = redirectURL;
                    return; // Exit function here as redirect will cause a page reload
            }
        } else {
            if (password !== repeatPassword) {
                modalTitle = $t("common.signup_password_not_match");
                modalDescription = $t("common.signup_password_not_match_description");
            } else {
                const response = await serverContactor.register(username, password, email);

                switch (response.status) {
                    case 200:
                        modalTitle = $t("common.signup_success");
                        modalDescription = $t("common.signup_success_description");
                        login = true;
                        break;
                    case 400:
                        modalTitle = $t("common.signup_fail");
                        modalDescription = $t("common.signup_fail_email");
                        break;
                    case 409:
                        modalTitle = $t("common.signup_fail");
                        modalDescription = $t("common.signup_fail_username");
                        break;
                    case 422:
                        modalTitle = $t("common.signup_fail");
                        modalDescription = $t("common.signup_fail_email");
                        break;
                }
            }
        }

        // Close the loader first
        closeLoader();

        // Only open the modal if there was an issue or success message
        if (modalTitle) {
            modal.open(modalTitle, modalDescription, undefined, undefined, modalOptions.includes("Resend Verification Code"));
        }
    } catch (error) {
        console.error(error);
        closeLoader();
        modal.open($t("common.error"), $t("common.generic_error_description"));
    }
}




    onMount(() => {
        closeLoader()
    });
</script>

<svelte:head>
    <title>{$t("common.account_title_on_tab")}</title>
</svelte:head>

<Holder>
        <h1 >
            {#if login}
                {$t("common.login_text")}
            {:else}
                {$t("common.signup_text")}   
            {/if}
        </h1>
        <p >
            {#if login} 
                {$t("common.login_description")}
            {:else} 
                {$t("common.signup_description")}
            {/if}
        </p>

    <form>
        {#if !login} 
            <div class="inp"><input bind:value={email} placeholder="email" type="email"></div>
        {/if}
        <div class="inp"><input bind:value={username} placeholder={$t("common.username_placeholder")} type="username"></div>
        <div class="inp"><input bind:value={password} placeholder={$t("common.password_placeholder")} type="password"></div>
        {#if !login}
            <div class="inp"><input bind:value={repeatPassword} placeholder={$t("common.confirm_password_placeholder")} type="password"></div>
        {/if}
        <div class="button-holder">
            <Button on:click={()=>accountActionButtonClick()} args={"fill"}>
                {#if login}
                    {$t("common.login_button")}
                {:else}
                    {$t("common.signup_button")}
                {/if}
            </Button>
        </div>
        {#if !login}
            <p>{@html $t("common.legal_text")}</p>
        {:else}
            <h4 style="margin-top: 5px; margin-bottom: 5px;"><a href="/account/recover">{$t("common.password_forget_intro")}</a></h4>
        {/if}

        <a on:click={()=>login=!login}>
            {#if login}
                {$t("common.signup_instead")}
            {:else}
                {$t("common.login_instead")}
            {/if}</a>
    </form>

</Holder>

<Loader bind:this={loader} />

<Modal bind:this={modal} on:primary={()=>modalClose()} on:secondary={()=>modalSecondary()} overrideDefault={true} description="" title="" options={["Continue"]}></Modal>

<style>
    form {
        display: flex;
        flex-direction: column;
        height: fit-content;
    }
    form div {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
    }
    .inp {
        height: 2em;
    }
    .button-holder {
        height: 2em;
    }
    a {
        font-size: 0.75em;
    }
    a:hover {
        cursor:pointer;
    }
</style>