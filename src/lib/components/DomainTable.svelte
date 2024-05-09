<script lang="ts">
    import Button from "./Button.svelte";
    import Dropdown from "./Dropdown.svelte";
    import Modal from "./Modal.svelte";
    let domains = [["A","markus","192.168.100.1","No"],["A","Gorjs","192.168.100.1","No"]];
    let dropdown:Dropdown;
    let editing:boolean;
    let content:HTMLInputElement;
    let value:HTMLInputElement;
    let selectedDomain:string;
    let editButton:Button;
    let modal:Modal;
    let warningString:string = "This is a destructive action, which cannot be undone. You will immediately lose access to this domain, which means it will be available to register. Re-registering the domain will not revert the DNS settings back to normal.";
    let rowInputs:Array<Array<any>> = domains.map(() => []);


    console.log(rowInputs);

    async function saveDomain(name:string, value:string, record:string) {
        console.log(name,value,record);
    }   

    function toggleEdit() {
        for(let i=0;i<rowInputs.length;i++) {
            console.log(rowInputs);
            rowInputs[i][0].toggleDisable();
            rowInputs[i][1].disabled=!rowInputs[i][1].disabled;
            rowInputs[i][2].disabled=!rowInputs[i][2].disabled;
        }
        
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
            <th style="width:20%; min-width:160px;"><a>Manage</a></th>
            <Button bind:this={editButton} on:click={()=>toggleEdit()} args={"fill scale"}>Unlock</Button>
        </tr>
    </thead>
    <tbody>
        {#each domains as domain, index}
            <tr>
                <td><Dropdown bind:this={rowInputs[index][0]} on:optionchange={(event)=>domain[0]=event.detail} defaultValue={domain[0]} options={["A","CNAME","NS","TXT"]} disabled={true}/></td>
                <td><input bind:this={rowInputs[index][1]} type="text" bind:value={domain[1]} disabled ></td>
                <td><input bind:this={rowInputs[index][2]} type="text" bind:value={domain[2]} disabled ></td>
                <td data-index={index} style="display: flex; flex-direction: row;">
                    <Button on:click={()=>console.log(domain)} args={"fill three-quarters side-margin"}>Save</Button>
                    <Button on:click={()=>{modal.open("Are you sure you want to delete " + domain[1],warningString)}} args={"fill danger quarter side-margin"}><span class="material-symbols-outlined">delete</span></Button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<Modal bind:this={modal} countdown={15} title="Are you sure you want to delete" description={""}></Modal>

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

    .row {
        margin: 0px;
        display: flex;
        flex-direction: row;
    }
</style>