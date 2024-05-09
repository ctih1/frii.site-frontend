<script lang="ts">
    import Button from "./Button.svelte";
    import Dropdown from "./Dropdown.svelte";
    let domains = [["A","markus","192.168.100.1","No"],["A","Gorjs","192.168.100.1","No"]];
    let dropdown:Dropdown;
    let editing:boolean;
    let content:HTMLInputElement;
    let value:HTMLInputElement;
    let editButton:Button;

    function dropdownChange(event:any) {
        console.log(event.detail);
    }
    function toggleEdit() {
        dropdown.toggleDisable()
        content.disabled = !content.disabled;
        value.disabled = !value.disabled;
        if(!editing) {
            editButton.changeText("Lock & Save");
        }else {
            editButton.changeText("Unlock");
        }
        editing=!editing;
    }


</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

<table>
    <thead>
        <tr>
            <th>Record Type</th>
            <th>Content</th>
            <th>Value</th>
            <th style="width:10%;"><a>Manage</a></th>
            <Button bind:this={editButton} on:click={()=>toggleEdit()} args={"fill scale"}>Unlock</Button>
        </tr>
    </thead>

    <tbody>
        {#each domains as domain}
            <tr>
                <td><Dropdown bind:this={dropdown} on:optionchange={dropdownChange} defaultValue={domain[0]} options={["A","CNAME","NS","TXT"]} disabled={true}/></td>
                <td><input bind:this={content} type="text" value={domain[1]} disabled ></td>
                <td><input bind:this={value} type="text" value={domain[2]} disabled ></td>
                <td><Button args={"fill danger"}><span class="material-symbols-outlined">delete</span>Delete</Button></td>
            </tr>
        {/each}
    </tbody>
</table>

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

    input {
        border-style: none;
        width: 100%;
        height:100%;
        box-sizing: border-box;
    }
    input:focus {
        outline-color: var(--primary);
    }
    .row {
        margin: 0px;
        display: flex;
        flex-direction: row;
    }
</style>