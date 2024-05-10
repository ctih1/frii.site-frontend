<script lang="ts">
    import Button from "./Button.svelte";
    import Dropdown from "./Dropdown.svelte";
    import Modal from "./Modal.svelte";
    import { createEventDispatcher } from "svelte";
    export let domains:Array<Array<string>>;
    let dispatcher = createEventDispatcher();
    let dropdown:Dropdown;
    let editing:boolean;
    let content:HTMLInputElement;
    let value:HTMLInputElement;
    let selectedDomain:string;
    let editButton:Button;
    let modal:Modal;
    let warningString:string = "This is a destructive action, which cannot be undone. You will immediately lose access to this domain, which means it will be available to register. Re-registering the domain will not revert the DNS settings back to normal.";
    let rowInputs:Array<Array<any>> = domains.map(() => []);

    export function updateDomains(ndomains:Array<Array<string>>):void {
        rowInputs=domains.map(() => []);
        domains=ndomains;
    }

    console.log(rowInputs);

    async function saveDomain(name:string, value:string, record:string) {
        dispatcher("save",{"name":name,"value":value,"type":record});
    }   


</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

<table>
    <thead>
        <tr>
            <th>Record Type</th>
            <th>Content</th>
            <th>Value</th>
            <th style="width:20%; min-width:160px;">Manage</th>
        </tr>
    </thead>
    <tbody>
        {#each domains as domain, index}
            <tr>
                <td><Dropdown bind:this={rowInputs[index][0]} on:optionchange={(event)=>domain[0]=event.detail} defaultValue={domain[0]} options={["A","CNAME","NS","TXT"]} disabled={true}/></td>
                <td><div class="container">
                    <input bind:this={rowInputs[index][1]} type="text" bind:value={domain[1]}>
                    <input style="width: 25%; min-width:50px;" disabled value=".frii.site">
                </div></td>
                <td><input bind:this={rowInputs[index][2]} type="text" bind:value={domain[2]}></td>
                <td data-index={index} style="display: flex; flex-direction: row;">
                    <Button on:click={()=>saveDomain(domain[1],domain[2],domain[0])} args={"fill three-quarters side-margin"}>Save</Button>
                    <Button on:click={()=>{modal.open("Are you sure you want to delete " + domain[1],warningString)}} args={"fill danger quarter side-margin"}><span class="material-symbols-outlined">delete</span></Button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<Modal bind:this={modal} options={["Continue","Cancel"]} countdown={10} title="Are you sure you want to delete" description={""}></Modal>

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

    .row {
        margin: 0px;
        display: flex;
        flex-direction: row;
    }
    .container {
        display: flex;
        flex-direction: row;
    }
</style>