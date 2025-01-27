<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { dev } from '$app/environment';
    import { browser } from "$app/environment"

    import Cookies from 'js-cookie';

    import Loader from "$lib/components/Loader.svelte";
    import Button from "$lib/components/Button.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Holder from "$lib/components/Holder.svelte";

    import { getAuthToken } from "$lib";
    import { t } from "$lib/translations";
    import { createToken, ServerContactor, login, AuthError, UserError, MFAError } from "../../serverContactor";



    let generatingNew:boolean = false;
    let code:string|null = null
    let valid:boolean = false;

    if(browser) {
        const params:URLSearchParams = new URLSearchParams(window.location.search);
        code = params.get("invite");
        valid = code!==null;
    }

    let serverContactor: ServerContactor;

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

    function handleLogin() {
        loader.show(undefined, $t("common.account_login_loading_desc"));
        login(username, password).catch(error=>{
            loader.hide();
            console.log(error instanceof AuthError);

            if(error instanceof AuthError || error instanceof UserError) {
                modal.open(
                    $t("common.login_failed"),
                    $t("common.login_failed_description"),
                );
            }

            else {
                modal.open(
                    $t("common.login_failed"),
                    $t("common.login_generic_error"),
                );
            }
        
            throw new Error("Login failed");
        })
        .then(session=>{
            const session_id = session["auth-token"];
            loader.hide();
            console.log(session_id);
            const date = new Date(Date.now()+ 604800*1000).toUTCString();
            document.cookie=`auth-token=${session_id}; expires=${date};`;
            if(!getAuthToken()) {
            console.error("Browser did not accept cookies... using localstorage");
            localStorage.setItem("auth-token", `${session_id}`);
            }
            localStorage.removeItem("temp-token");
            localStorage.removeItem("verif-token"); // Prevents users from potentially relogging without creds if verif-token is in localstrage
            localStorage.setItem("logged-in", "y");
            modal.open(
                $t("common.login_succeed"),
                $t("common.login_succeed_description"),
            );
            redirectURL = redirectURL ?? "/";
            window.location.href = redirectURL;
        })
    }

    function handleSignup() {
        loader.show(undefined, $t("common.account_signup_loading_desc"));
        if (password !== repeatPassword) {
            modal.open(
                $t("common.signup_password_not_match"),
                $t("common.signup_password_not_match_description"),
            );
            return;
        }
        serverContactor
            //@ts-ignore
            .register(username, password, email, code)
            .then((response) => {
                loader.hide();
                handleSignupResponse(response);
            });
    }

    function handleSignupResponse(response) {
        switch (response.status) {
            case 200:
                modal.open(
                    $t("common.signup_success"),
                    $t("common.signup_success_description"),
                );
                login = true;
                break;
            case 400:
            case 422:
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
            case 403:
                modal.open("Invalid invite", "Your invite code is invalid.");
                break;
        }
    }

    function accountActionButtonClick() {
        if (serverContactor === undefined) {
            return;
        }
        if (login) {
            handleLogin();
        } else if (valid) {
            handleSignup();
        }
    }

    let login_mode: boolean = true;

    valid?login_mode=false:login_mode=true;

</script>

<svelte:head>
    <title>{$t("common.account_title_on_tab")}</title>
</svelte:head>


<Loader bind:this={loader}/>
<Holder>
    {#if login_mode}
        <h1>{$t("common.login_text")}</h1>
        <p>
            {#if warningText}
                {warningText}
            {:else}
                {$t("common.login_description")}
            {/if}
        </p>

        <form>
            <div class="inp">
                <input
                    bind:value={username}
                    placeholder={$t("common.username_placeholder")}
                    type="text"
                />
            </div>

            <div class="inp">
                <input
                    bind:value={password}
                    placeholder={$t("common.password_placeholder")}
                    type="password"
                />
            </div>

            <div class="button-holder">
                <Button on:click={accountActionButtonClick} args={"fill"}>
                    {$t("common.login_button")}
                </Button>
            </div>

            <h4 style="margin-top: 5px; margin-bottom: 5px;">
                <a href="/account/recover">{$t("common.password_forget_intro")}</a>
            </h4>

            <a href="#" on:click={() => (login_mode = false)}>
                {$t("common.signup_instead")}
            </a>
        </form>
    {:else if valid}
        <h1>{$t("common.signup_text")}</h1>
        <p>
            {#if warningText}
                {warningText}
            {:else}
                {$t("common.signup_description")}
            {/if}
        </p>

        <form>
            <div class="inp">
                <input bind:value={email} placeholder="email" type="email" />
            </div>

            <div class="inp">
                <input
                    bind:value={username}
                    placeholder={$t("common.username_placeholder")}
                    type="text"
                />
            </div>

            <div class="inp">
                <input
                    bind:value={password}
                    placeholder={$t("common.password_placeholder")}
                    type="password"
                />
            </div>

            <div class="inp">
                <input
                    bind:value={repeatPassword}
                    placeholder={$t("common.confirm_password_placeholder")}
                    type="password"
                />
            </div>

            <div class="button-holder">
                <Button on:click={accountActionButtonClick} args={"fill"}>
                    {$t("common.signup_button")}
                </Button>
            </div>

            <p>{@html $t("common.legal_text")}</p>

            <a href="#" on:click={() => (login_mode = true)}>
                {$t("common.login_instead")}
            </a>
        </form>
    {/if}

    {#if !login && !valid}
        <div style="display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 8em;" class="material-symbols-outlined">warning</span>
        </div>
        <h1>Account creation closed</h1>
        <p>
            Due to numerous people using frii.site for scamming people, so we switched over to an invite-based system. If you know someone who uses frii.site, you can ask them for an invite. 
        </p>
        <p>Thank you for your support.</p>

        <a href="#" on:click={() => (login_mode = true)}>Login to an existing account</a>
    {/if}
</Holder>


<Modal
    bind:this={modal}
    on:primary={() => modalClose()}
    on:secondary={() => modalSecondary()}
    overrideDefault={true}
    description=""
    title=""
    options={["Continue"]}
></Modal>


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
