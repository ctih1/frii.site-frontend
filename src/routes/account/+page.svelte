<script lang="ts">
    import { t } from "$lib/translations";
    import Button from "$lib/components/Button.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Blur from "$lib/components/Blur.svelte";
    import { createToken, ServerContactor } from "../../serverContactor";
    import Modal from "$lib/components/Modal.svelte";
    import Holder from "$lib/components/Holder.svelte";
    let serverContactor: ServerContactor | undefined = undefined;

    let username: string;
    let password: string;
    let repeatPassword: string;
    let email: string;
    let modal: Modal;
    let redirectURL: string | null;
    let blur: Blur;

    function modalClose() {
        modal.close();
        blur.hide();
    }
    function modalSecondary() {}

    onMount(() => {
        serverContactor = new ServerContactor(
            localStorage.getItem("auth-token"),
            localStorage.getItem("server_url"),
        );
        redirectURL = $page.url.searchParams.get("r");
        if (localStorage.getItem("logged-in") === "y") {
            window.location.href = "/account/manage";
            return;
        }
    });
    let login: boolean = true;

    function accountActionButtonClick() {
        blur.show();
        if (serverContactor === undefined) {
            return;
        }
        if (login) {
            serverContactor.login(username, password).then((response) => {
                switch (response) {
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
                    case 417:
                        createToken(username, password).then((token) => {
                            localStorage.setItem("verif-token", token);
                            modal.open(
                                $t("common.login_failed_verify"),
                                $t("common.login_failed_verify_description"),
                                undefined,
                                undefined,
                                true,
                            );
                        });
                        break;
                    case 200:
                        //@ts-ignore
                        localStorage.setItem(
                            "auth-token",
                            localStorage.getItem("temp-token"),
                        ); // this should **never** break
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

<Holder>
    <h1>
        {#if login}
            {$t("common.login_text")}
        {:else}
            {$t("common.signup_text")}
        {/if}
    </h1>
    <p>
        {#if login}
            {$t("common.login_description")}
        {:else}
            {$t("common.signup_description")}
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

        <a on:click={() => (login = !login)}>
            {#if login}
                {$t("common.signup_instead")}
            {:else}
                {$t("common.login_instead")}
            {/if}</a
        >
    </form>
</Holder>

<Blur bind:this={blur} />

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
