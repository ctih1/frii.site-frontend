<script lang="ts">
    import Button from "./Button.svelte";
    import Dropdown from "./Dropdown.svelte";
    import Modal from "./Modal.svelte";
    import { t,addArguements } from '$lib/translations';
    import { createEventDispatcher } from "svelte";
    let deleting:boolean=false;
    let visible:Map<string,boolean> = new Map();
    interface key {
        key:string;
        comment:string;
        perms: string[];
        domains: string[];
    }
    function getEmoji(input:boolean): string {
        if(input) {
            return "<span class='material-symbols-outlined'>check</span>"
        }
        return "<span class='material-symbols-outlined'>close</span>"
    }
    export let keys:key[];
    console.log(keys);
    let dispatcher = createEventDispatcher();
    let modal:Modal;
    let keyTarget:string;

    function showKey():void {
        if(!deleting) {
          modal.open($t("common.api_dashboard_key_title"),addArguements($t("common.api_dashboard_key_description"),{"%key%":keyTarget}));
          keyTarget="";
        } else {

        }

    }

    function getPermName(permission:string):string {
      const  modifyPrefix:string[] = ["domain","type","content"]
      if(modifyPrefix.includes(permission)) {
        return "modify_"+permission
      } if(permission==="details") {return "view"}
      return permission;
    }

</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

<table>
    <thead>
        <tr>
            <th>Comment</th>
            <th>Permissions</th>
            <th>Domains</th>
            <th style="width: 20%; text-align: center;">Tools</th>
        </tr>
    </thead>
    <tbody>
        {#each keys as apiKey}
            <tr>
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <td>{apiKey.comment}</td>
                <td>
                    <div class="perms">
                        {#each apiKey.perms as permission}
                            <span>{$t(`common.api_dashboard_${getPermName(permission)}_perm`)}</span>
                        {/each}
                    </div>
                </td>

                <td>
                    <div class="domains">
                        {#each apiKey.domains as domain}
                            <span>{domain}.frii.site</span>
                        {/each}
                    </div>
                </td>
                <td style="width: fit-content; align-items: center; display:flex;">
                    <Button args="margin" on:click={()=>{deleting=false;keyTarget=apiKey.key;modal.open($t("common.api_dashboard_key_warning"),$t("common.api_dashboard_key_warning_description"),3,[$t("common.cancel_modal"),$t("common.continue_modal")])}}>
                        <span class="material-symbols-outlined">key</span>
                    </Button>
                    <Button args="danger margin" on:click={()=>{deleting=true;keyTarget=apiKey.key;modal.open(addArguements($t("common.api_dashboard_key_deletion"),{"%key_comment%":apiKey.comment}),$t("common.api_dashboard_key_deletion_description"),7,[$t("common.cancel_modal"),$t("common.continue_modal")])}}>
                        <span class="material-symbols-outlined">delete_forever</span>
                    </Button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>
<Modal bind:this={modal} options={["Cancel","Continue"]}  countdown={3} on:secondary={()=>{showKey()}} title="Are you sure you want to delete" description={""}></Modal>

<style>
    thead {
        background-color: rgba(0,0,0,0.05);
    }
    table {
        width: 100%;
        height: 100%;
        table-layout: fixed;
        background-color: rgb(255, 255, 255);
        border-collapse:collapse;
        padding: 1em;
    }
    th {
        text-align: left;
    }
    tr {
        background-color: rgba(0, 0, 0, 0.01);
    }

    td {
        min-width: 10vw;
        width: 100%;
        height: 2em;
        justify-content: center;
    }
    tr:not(:last-child) {
        border-bottom: 1px solid rgba(0,0,0,0.1);

    }

    span {
        display: flex;
        flex-direction: row;
    }
    span * {
        margin-left: 2px;
        margin-right: 2px ;
    }

    .row {
        margin: 0px;
        display: flex;
        flex-direction: row;
    }
    .container {
        display: flex;
        flex-direction: row;
        height: 100%;
    }
    .domains span:not(:last-child)::after {
        content:","
    }

    .perms span {
        width: fit-content;
    }
    .perms {
        display: grid;
        word-wrap: normal;
        overflow-wrap:normal;
    }
</style>
