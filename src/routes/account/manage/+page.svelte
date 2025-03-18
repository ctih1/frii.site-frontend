<script lang="ts">
    import Cookies from "js-cookie";
    import copy from "clipboard-copy";
    import { getAuthToken } from "$lib";
    import { dev } from "$app/environment";
    import QR from "@svelte-put/qr/svg/QR.svelte";

    import Dropdown from "$lib/components/Dropdown.svelte";
    import Button from "$lib/components/Button.svelte";
    import Holder from "$lib/components/Holder.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Placeholder from "$lib/components/Placeholder.svelte";
    import { UAParser } from "ua-parser-js";
    import { redirectToLogin, createFile } from "../../../helperFuncs";
    import {
        ServerContactor,
        AuthError,
        ConflictError,
        UserError,
        PermissionError,
    } from "../../../serverContactor";
    import Section from "$lib/components/Section.svelte";
    import Blur from "$lib/components/Blur.svelte";
    import { t, locale, locales, addArguements } from "$lib/translations";
    import Switch from "$lib/components/Switch.svelte";
    import Tooltip from "$lib/components/Tooltip.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import Ads from "$lib/components/Ads.svelte";
    import { redirect } from "@sveltejs/kit";
    import { page } from "$app/state";

    interface Session {
        hash: string;
        user_agent: string;
        ip: string;
        expire: number;
    }

    interface invite {
        code: string;
        used: boolean;
        used_by: string | null;
        shown: boolean;
    }

    let loader: Loader;
    let serverContactor: ServerContactor;
    let modal: Modal;
    let noConfirm: boolean = true;
    let sessions: Session[] = [];
    let blurElement: Blur;
    let emailE: string;
    let usernameE: string;
    let loaded: boolean = false;
    let verified: boolean = false;
    let maxDomains = 0;
    let wildcards = false;
    let admin = false;
    let vuln = false;
    let monitoring = false;
    let invites: invite[] = [];

    let allowBetaTesting: boolean = false;
    if (browser) {
        if (!localStorage.getItem("logged-in")) {
            redirectToLogin(-1);
        }
        allowBetaTesting =
            Boolean(localStorage.getItem("allow-testing")) ?? false;
    }
    onMount(() => {
        serverContactor = new ServerContactor(
            getAuthToken(),
            localStorage.getItem("server_url"),
        );

        serverContactor
            .getAccountSettings()
            .catch((error) => {
                if (error instanceof AuthError) {
                    redirectToLogin(460);
                }
            })
            .then((data) => {
                if (!data) {
                    throw Error("Data is not defined");
                }
                emailE = addArguements($t("account_email"), {
                    "%email%": data["email"],
                });
                usernameE = addArguements($t("account_username"), {
                    "%username%": data["username"],
                });
                loaded = true;
                verified = data["verified"];
                //@ts-ignore
                maxDomains = data["permissions"]["max-domains"] ?? 4;
                wildcards = data["permissions"]["wildcards"] ?? false;
                admin = data["permissions"]["admin"] ?? false;
                vuln = data["permissions"]["reports"] ?? false;
                monitoring = data["permissions"]["userdetails"] ?? false;

                let inviteObject = data["invites"];
                let sessionObject = data["sessions"];

                for (let i = 0; i < Object.entries(inviteObject).length; i++) {
                    let name: string = Object.keys(inviteObject)[i] || "undefined";
                    invites.push({
                        code: name,
                        used: inviteObject[name]["used"],
                        used_by: inviteObject[name]["used_by"],
                        shown: false,
                    });
                }
                invites = [...invites];

                sessionObject.forEach((element) => {
                    sessions.push({
                        expire: element["expire"],
                        hash: element["_id"],
                        ip: element["ip"],
                        user_agent: element["user-agent"],
                    });
                });

                sessions = [...sessions];
            });
    });

    function createInvite() {
        loader.show("Creating invite...", "This shouldn't take long");
        serverContactor
            .createInvite()
            .catch((err) => {
                loader.hide();
                if (err instanceof AuthError) {
                    redirectToLogin(460);
                }
                if (err instanceof ConflictError) {
                    modal.open(
                        $t("account_invite_fail"),
                        $t("account_invite_fail_usage_description"),
                    );
                } else {
                }
                throw new Error("Failed to create invite");
            })
            .then((response) => {
                loader.hide();
                modal.open(
                    $t("account_invite_success"),
                    addArguements(
                        $t("account_invite_success_desc"),
                        {
                            "%link%": `https://www.frii.site/sign-up?invite=${response["code"]}`,
                        },
                    ),
                );
                invites.push({
                    code: response["code"],
                    used: false,
                    used_by: null,
                    shown: false,
                });
                invites = [...invites];
            });
    }

    function handleDelete() {
        if (noConfirm) {
            modal.open(
                $t("account_delete_confirm"),
                $t("acount_delete_confirm_description"),
                10,
                [$t("cancel_modal"), $t("continue_modal")],
            );
            noConfirm = false;
            return;
        }
        serverContactor.deleteAccount()
            .catch(err => {
                if(err instanceof AuthError) redirectToLogin(460);
                modal.open(
                        $t("account_deletion_fail"),
                        $t("account_deletion_fail_description"),
                    );
                throw new Error("Failed to delete account");
            })
            .then(_ => {
                modal.open(
                    $t("account_check_email"),
                    $t("account_check_email_description"),
                );
            });
    }
    function gpdrData() {
        serverContactor
            .getGDPR()
            .then((response) => response.json())
            .then((data) => {
                createFile("data.json", JSON.stringify(data));
            });
    }
    function logOut() {
        serverContactor.logOut()
            .catch(err=>{
                throw new Error("Failed to delete session. Please file an issue report over on our github (ctih1/frii.site-frontend)");
            }).then(_=>{
                Cookies.remove("auth-token", { secure: !dev });
                localStorage.removeItem("logged-in");
                localStorage.removeItem("auth-token");
                redirectToLogin(200);
            })
    }

    function deleteSession(sessionHash: string) {
        loader.show(
            undefined,
            $t("account_manage_sessions_delete_loader"),
        );
        serverContactor.logOut(sessionHash)
            .catch((err) => {
                if (err instanceof UserError)
                    console.error("Session with that ID does not exist");
                if (err instanceof AuthError) redirectToLogin(460);
                throw Error("Failed to delete session");
            })
            .then(_ => {
                loader.hide();
                sessions = sessions.filter(el => {return el.hash !== sessionHash});
                sessions = [...sessions];
            })

    }
</script>

<link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/>
<Blur bind:this={blurElement} />
<Loader bind:this={loader} />
<Holder>
    <h1>{$t("account_management")}</h1>
    <Section title={$t("account_details")} id="details">
        <div class="details">
            {#if loaded}
                <h3
                    style="display: flex; align-items:center; width: fit-content;"
                >
                    {emailE}{#if verified}<verified style="margin-left: 0.5em;"
                            ><span class="material-symbols-outlined">check</span
                            ></verified
                        >{/if}
                </h3>
                <h3 id="username">
                    {usernameE}
                    <Tooltip>{$t("account_username_tooltip")}</Tooltip>
                </h3>
                <div class="permission">
                    <span class="material-symbols-outlined">lock</span>
                    <p>
                        {$t("dashboard_permission_domains")}:
                        <strong>{maxDomains}</strong>
                    </p>
                </div>
                {#if wildcards}
                    <div class="permission">
                        <span class="material-symbols-outlined">asterisk</span>
                        <p>
                            {$t("dashboard_permission_wildcards")}:
                            <strong>{wildcards}</strong>
                        </p>
                    </div>
                {/if}
                {#if admin}
                    <div class="permission">
                        <span class="material-symbols-outlined"
                            >shield_person</span
                        >
                        <p>
                            {$t("dashboard_permission_admin")}:
                            <strong>{admin}</strong>
                        </p>
                    </div>
                {/if}
                {#if vuln}
                    <div class="permission">
                        <span class="material-symbols-outlined">handyman</span>
                        <p>
                            {$t("dashboard_permission_vulnerabilities")}:
                            <strong>{vuln}</strong>
                        </p>
                    </div>
                {/if}
                {#if monitoring}
                    <div class="permission">
                        <span class="material-symbols-outlined">groups</span>
                        <p>
                            {$t("dashboard_permission_monitoring")}:
                            <strong>{monitoring}</strong>
                        </p>
                    </div>
                {/if}
            {:else}
                <h3 style="height: 1em; width:20vw;"><Placeholder /></h3>
                <h3 style="height: 1em; width:20vw;"><Placeholder /></h3>
            {/if}
        </div>
    </Section>
    <h1>{$t("account_manage_account")}</h1>
    <Section title={$t("account_manage")} id="manage">
        {#if browser}
            <div class="switch">
                <p>{$t("account_domain_del_cooldown")}</p>
                <Switch
                    initial={(localStorage.getItem("del-count") ?? "false") ==
                        "true"}
                    on:change={(event) => {
                        localStorage.setItem("del-count", event.detail);
                    }}
                />
            </div>
            <div class="buttons">
                <div>
                    <Button on:click={() => createInvite()} args={"padding"}
                        >{$t("account_invite")}</Button
                    >
                </div>
                <div>
                    <Button on:click={() => gpdrData()} args={"padding"}
                        >{$t("account_download_data")}</Button
                    >
                </div>
                <div>
                    <Button on:click={() => logOut()} args={"padding danger"}
                        >{$t("account_log_out")}</Button
                    >
                </div>

                <div class="danger">
                    <Button
                        args={"danger padding"}
                        on:click={() => handleDelete()}
                        >{$t("account_delete_account")}</Button
                    >
                </div>
            </div>
        {/if}
    </Section>

    <Section title="Invites" id="invites">
        {#if browser}
            {#each invites as invite,index}
                {@const minres =
                    Math.min(window.innerHeight, window.innerWidth) /
                    (window.innerHeight > window.innerWidth ? 1.5 : 3)}
                {@const showQRCode = false}
                <div class="session invite">
                    <h3>
                        <a
                            href="https://www.frii.site/account?invite={invite.code}"
                            >Invite #{index+1}</a
                        >
                    </h3>

                    <Button args="padding" on:click={_=>copy(`https://www.frii.site/account?invite=${invite.code}`)}>Copy to clipboard</Button>

                    <p>Used: <b>{invite.used ? "Yes" : "No"}</b></p>
                    {#if invite.used}
                        <p style="word-break: break-all; width: {minres}px">
                            Used by: <b>{invite.used_by}</b>
                        </p>
                    {/if}
                    <Button
                        args="padding"
                        on:click={() => (invite.shown = !invite.shown)}
                        >{$t("account_show_invite_qr")}</Button
                    >
                    {#if invite.shown}
                        <div
                            class="h"
                            style="display: flex; width: 100%; justify-content:center"
                        >
                            <QR
                                data="https://www.frii.site/account?invite={invite.code}"
                                shape="circle"
                                logo="https://www.frii.site/favicon.svg"
                                width={minres}
                                height={minres}
                            />
                        </div>
                    {/if}
                </div>
            {/each}
        {/if}
    </Section>

    <Section title={$t("account_manage_sessions")} id="sessions">
        {#each sessions as session}
            {@const parser = new UAParser(session.user_agent)}
            <div class="session">
                <h3 class="session-header">
                    <span class="material-symbols-outlined">
                        {#if parser.getDevice().type === "mobile"}
                            smartphone
                        {:else}
                            desktop_windows
                        {/if}
                    </span>
                    {parser.getOS().name ?? "Unknown OS"}
                    {parser.getOS().version ?? ""} - {parser.getBrowser()
                        .name ?? "Unknown browser"}
                    {parser.getBrowser().version ?? ""}
                </h3>
                <p class="ip">{session.ip}</p>
                <p style="display: flex; align-items: center;">
                    <span class="material-symbols-outlined">update</span
                    >Expires: {new Date(session.expire * 1000).toUTCString()}
                </p>
                <p>{session.hash}</p>
                <Button
                    args="danger"
                    on:click={() => deleteSession(session.hash)}>Remove</Button
                >
            </div>
        {/each}
    </Section>
</Holder>

<Modal
    bind:this={modal}
    on:secondary={() => handleDelete()}
    options={[$t("continue_modal")]}
    title={""}
    description={""}
></Modal>

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
    #username {
        overflow-wrap: break-word;
        word-break: break-all;
    }
    .permission {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .session {
        width: fit-content;
        border-radius: 0.5em;
        padding: 0.5em;
        margin-top: 1em;
        margin-bottom: 1em;
        background-color: var(--secondary-color);
    }
    .session-header {
        display: flex;
        align-items: center;
        margin-top: 0px;
        margin-bottom: 0px;
    }
    .ip {
        margin-top: 0px;
    }

    @media (orientation: portrait) {
        .invite {
            margin-left: auto;
            margin-right: auto;
            width: 90%;
        }
    }
</style>
