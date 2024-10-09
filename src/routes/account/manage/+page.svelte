<script lang="ts">
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Button from '$lib/components/Button.svelte';
    import Holder from "$lib/components/Holder.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Placeholder from '$lib/components/Placeholder.svelte';
    import { UAParser } from 'ua-parser-js';
    import { redirectToLogin,createFile } from '../../../helperFuncs';
    import { ServerContactor } from '../../../serverContactor';
    import Section from '$lib/components/Section.svelte';
    import Blur from '$lib/components/Blur.svelte';
    import { t, locale, locales, addArguements } from '$lib/translations';
    import Switch from '$lib/components/Switch.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import Loader from "$lib/components/Loader.svelte";
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    interface Session {
      hash: string,
      user_agent:string,
      ip: string,
      expire: number
    }
    let loader:Loader;
    let serverContactor:ServerContactor;
    let modal:Modal;
    let noConfirm:boolean=true;
    let sessions:Session[] = []
    let blurElement:Blur;
    let emailE:string;
    let usernameE:string;
    let loaded:boolean=false;
    let verified:boolean=false;
    let maxDomains = 0;
    let wildcards=false;
    let admin=false;
    let vuln=false;
    let monitoring=false;

    if(browser) {
      if(!localStorage.getItem("logged-in")) {
        redirectToLogin(-1);
      }
    }
    onMount(()=>{
        async function __GetData() {
          await getData();
          await serverContactor.getSessions().then(response=>response.json()).then(json=>{
              sessions = json as Session[];
          })
        }
        serverContactor=new ServerContactor(localStorage.getItem("auth-token"),localStorage.getItem("server_url"));
        __GetData();
    })

    async function getData() {
        await serverContactor.getAccountDetails().then(response=>{
          if(response.status === 460) {
            redirectToLogin(460)
          }
          response.json().then(data=>{
            emailE=addArguements($t("common.account_email"),{"%email%":data["email"]});
            usernameE=addArguements($t("common.account_username"),{"%username%":data["username"]});
            loaded=true;
            verified=data["verified"];
            maxDomains=data["permissions"]["max-domains"]??4;
            wildcards=data["permissions"]["wildcards"]??false;
            admin=data["permissions"]["admin"]??false;
            vuln=data["permissions"]["reports"]??false;
            monitoring=data["permissions"]["userdetails"]??false;
        })
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
    function handleBeta(mode:boolean) {
        if(mode) {
            serverContactor.joinBeta()
        } else {
            serverContactor.leaveBeta()
        }
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
    function deleteSession(sessionHash:string) {
      loader.show(undefined, $t("common.account_manage_sessions_delete_loader"))
      serverContactor.deleteSession(sessionHash).then(response=>{
        if(response.ok) {
          loader.hide();
          sessions = sessions.filter((object:Session)=>{
            object.hash === sessionHash
          });
          sessions = [...sessions]; // to get svelte to update the component
        }
      })


    }
</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
<Blur bind:this={blurElement}/>
<Loader bind:this={loader}/>
<Holder>
    <h1>{$t("common.account_management")}</h1>
    <Section title={$t("common.account_details")} id="details">
        <div class="details">
            {#if loaded}
                <h3 style="display: flex; align-items:center; width: fit-content;">{emailE}{#if verified}<verified style="margin-left: 0.5em;"><span  class="material-symbols-outlined">check</span></verified>{/if}</h3>
                <h3 id="username">{usernameE} <Tooltip>{$t("common.account_username_tooltip")}</Tooltip></h3>
                <div class="permission">
                    <span class="material-symbols-outlined">lock</span><p>{$t("common.dashboard_permission_domains")}:  <strong>{maxDomains}</strong></p>
                </div>
                {#if wildcards}
                    <div class="permission">
                        <span class="material-symbols-outlined">asterisk</span><p>{$t("common.dashboard_permission_wildcards")}:  <strong>{wildcards}</strong></p>
                    </div>
                {/if}
                {#if admin}
                    <div class="permission">
                        <span class="material-symbols-outlined">shield_person</span><p>{$t("common.dashboard_permission_admin")}:  <strong>{admin}</strong></p>
                    </div>
                {/if}
                {#if vuln}
                <div class="permission">
                    <span class="material-symbols-outlined">handyman</span><p>{$t("common.dashboard_permission_vulnerabilities")}:  <strong>{vuln}</strong></p>
                </div>
                {/if}
                {#if monitoring}
                <div class="permission">
                    <span class="material-symbols-outlined">groups</span><p>{$t("common.dashboard_permission_monitoring")}:  <strong>{monitoring}</strong></p>
                </div>
                {/if}

            {:else}
                <h3 style="height: 1em; width:20vw;"><Placeholder/></h3>
                <h3 style="height: 1em; width:20vw;"><Placeholder/></h3>
            {/if}
        </div>
    </Section>
    <h1>{$t("common.account_manage_account")}</h1>
    <Section title={$t("common.account_manage")} id="manage">
        {#if browser}
            <div class="switch">
                <p>{$t("common.account_domain_del_cooldown")}</p>
                <Switch initial={(localStorage.getItem("del-count")??"false")=="true"} on:change={(event)=>{localStorage.setItem("del-count",event.detail)}}/>
            </div>
            <div class="switch">
                <p>{$t("common.account_version_testing")}</p>
                <Switch initial={(localStorage.getItem("allow-testing")??"false")=="true"} on:change={(event)=>{localStorage.setItem("allow-testing",event.detail);handleBeta(event.detail);}}/>
            </div>
            <div class="buttons">
                <div><Button on:click={()=>gpdrData()} args={"padding"}>{$t("common.account_download_data")}</Button></div>
                <div><Button on:click={()=>logOut()} args={"padding danger"}>{$t("common.account_log_out")}</Button></div>
                <div class="danger">
                    <Button args={"danger padding"} on:click={()=>handleDelete()}>{$t("common.account_delete_account")}</Button>
                </div>
            </div>
        {/if}
    </Section>
    <Section title={$t("common.account_manage_sessions")} id="sessions">
        {#each sessions as session}
            {@const parser = new UAParser(session.user_agent)}
            <div class="session">
                <h3 class="session-header">
                        <span class="material-symbols-outlined">
                            {#if (parser.getDevice().type === "mobile")}
                                smartphone
                            {:else}
                                desktop_windows
                            {/if}
                        </span>
                    {parser.getOS().name??"Unknown OS"} {parser.getOS().version??""} - {parser.getBrowser().name??"Unknown browser"} {parser.getBrowser().version??""}
                </h3>
                <p class="ip">{session.ip}</p>
                <p style="display: flex; align-items: center;"><span class="material-symbols-outlined">update</span>Expires: {new Date(session.expire*1000).toUTCString()}</p>
                <Button args="danger" on:click={()=>deleteSession(session.hash)}>Remove</Button>
            </div>
        {/each}
    </Section>
</Holder>

<Modal bind:this={modal} on:secondary={()=>handleDelete()} options={[$t("common.continue_modal")]} title={""} description={""}></Modal>

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
        background-color: var(--background-color);
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
</style>
