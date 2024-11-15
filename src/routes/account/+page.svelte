<script lang="ts">
    import Cookies from 'js-cookie';
    import {getAuthToken} from "$lib";

    import { dev } from '$app/environment';
    import { t } from "$lib/translations";
    import Button from "$lib/components/Button.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Loader from "$lib/components/Loader.svelte";
    import { createToken, ServerContactor, digestMessage } from "../../serverContactor";
    import Modal from "$lib/components/Modal.svelte";
    import Holder from "$lib/components/Holder.svelte";

    let serverContactor: ServerContactor | undefined = undefined;

    let username: string;
    let password: string;
    let repeatPassword: string;
    let email: string;
    let modal: Modal;
    let redirectURL: string; // Used to automatically redirect user to the right endpoint after login
    let loader:Loader;
    let warningText: string; // Used for example "it seems like you don't have permissions to access this"
    function modalClose() {
        modal.close();
        loader?.hide();
    }
    function modalSecondary() {}

    onMount(() => {
        serverContactor = new ServerContactor(
            getAuthToken()
        );

        redirectURL = $page.url.searchParams.get("r") ?? "/";
        if(localStorage.getItem("logged-in") === "y" ) window.location.href = "/account/manage";

        switch(Number($page.url.searchParams.get("c"))) {  // switch status code that redirected user here
          case 460:
            warningText = $t("common.account_signed_out")
            break;

          case 461:
          case 462:
            warningText = $t("common.account_permissions_lack");
            break;
        }
    });
    let login: boolean = true;

    function accountActionButtonClick() { // Excuse me for this horrendous code TODO: refactor it. Don't feel like it though'
        if (serverContactor === undefined) {
            return;
        }
        if (login) {
            loader.show(undefined,$t("common.account_login_loading_desc"))
            serverContactor.login(username, password).then((response) => {
                loader.hide();
                switch (response.status) {
                    case 422:
                        modal.open(
                            $t("common.login_failed"),
                            $t("common.login_generic_error"),
                        );
                        break;
                    case 401:
                        modal.open(
                            $t("common.login_failed"),
                            $t("common.login_failed_description"),
                        );
                        break;
                    case 412:
                        localStorage.setItem("verif-token",username)
                        modal.open(
                            $t("common.login_failed_verify"),
                            $t("common.login_failed_verify_description"),
                            undefined,
                            undefined,
                            true,
                        );
                        break;
                    case 200:
                        //@ts-ignore
                        response.text().then(session=>{
                          const date = new Date(Date.now()+ 604800*1000).toUTCString();
                          document.cookie=`auth-token=${session}; expires=${date};`;
                          if(!getAuthToken()) {
                            console.error("Browser did not accept cookies... using localstorage");
                            localStorage.setItem("auth-token", session);
                          }
                        });
                        localStorage.removeItem("temp-token");
                        localStorage.removeItem("verif-token"); // Prevents users from potentially relogging without creds if verif-token is in localstrage
                        localStorage.setItem("logged-in", "y");
                        modal.open(
                            $t("common.login_succeed"),
                            $t("common.login_succeed_description"),
                        );
                        if (redirectURL === null) {
                            redirectURL = "/";
                        }
                        window.location.href = redirectURL;
                        break;
                }
            });
        }
        if (!login) {
          loader.show(undefined,$t("common.account_signup_loading_desc"))
            if (password !== repeatPassword) {
                modal.open(
                    $t("common.signup_password_not_match"),
                    $t("common.signup_password_not_match_description"),
                );
                return;
            }
            serverContactor
                .register(username, password, email)
                .then((response) => {
                  loader.hide();
                    switch (response.status) {
                        case 200:
                            modal.open(
                                $t("common.signup_success"),
                                $t("common.signup_success_description"),
                            );
                            login = true;
                            break;
                        case 400:
                            modal.open(
                                $t("common.signup_fail"),
                                $t("common.signup_fail_email"),
                            );
                            break;
                        case 409:
                            modal.open(
                                $t("common.signup_fail"),
                                $t("common.signup_fail_username"),
                            );
                            break;
                        case 422:
                            modal.open(
                                $t("common.signup_fail"),
                                $t("common.signup_fail_email"),
                            );
                            break;
                    }
                });
        }
    }
</script>

<svelte:head>
    <title>{$t("common.account_title_on_tab")}</title>
</svelte:head>


<Loader bind:this={loader}/>
<Holder>
    {#if login}
        <h1>
            {#if login}
                {$t("common.login_text")}
            {:else}
                {$t("common.signup_text")}
            {/if}
        </h1>
        <p>
            {#if !warningText}
                {#if login}
                    {$t("common.login_description")}
                {:else}
                    {$t("common.signup_description")}
                {/if}
            {:else}
                {warningText}
            {/if}
        </p>

        <form>
            {#if !login}
                <div class="inp">
                    <input bind:value={email} placeholder="email" type="email" />
                </div>
            {/if}
            <div class="inp">
                <input
                    bind:value={username}
                    placeholder={$t("common.username_placeholder")}
                    type="username"
                />
            </div>
            <div class="inp">
                <input
                    bind:value={password}
                    placeholder={$t("common.password_placeholder")}
                    type="password"
                />
            </div>
            {#if !login}
                <div class="inp">
                    <input
                        bind:value={repeatPassword}
                        placeholder={$t("common.confirm_password_placeholder")}
                        type="password"
                    />
                </div>
            {/if}
            <div class="button-holder">
                <Button on:click={() => accountActionButtonClick()} args={"fill"}>
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
                <h4 style="margin-top: 5px; margin-bottom: 5px;">
                    <a href="/account/recover"
                        >{$t("common.password_forget_intro")}</a
                    >
                </h4>
            {/if}

        <a href="#" on:click={() => (login = !login)}>
            {#if login}
                {$t("common.signup_instead")}
            {:else}
                {$t("common.login_instead")}
            {/if}
        </a>
    </form>
    {:else}
        <div style="display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 8em;" class="material-symbols-outlined">warning</span>
        </div>
        <h1>Account creation closed</h1>
        <p>Due to numerous people using frii.site for scamming people, for now, we have removed the ability to register accounts. We will be implementing an invitation system at some point in the future, but until then, no-one is allowed to register an account.</p>
        <p>Users who already have a frii.site account can freely create, modify and delete domains.</p>
        <p>Thank you for your support.</p>
        
        <a href="#" on:click={() => (login = !login)}>Login to an existing account</a>
    {/if}

</Holder>


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
        cursor: pointer;
    }
</style>