<script lang="ts">
    import Button from "./Button.svelte";
    import Dropdown from "./Dropdown.svelte";
    let domains = [["A","markus","192.168.100.1","No"]];

    function dropdownChange(event:any) {
        console.log(event.detail);
    }

</script>

<table>
    <tr>
        <th>Record Type</th>
        <th>Content</th>
        <th>Value</th>
        <th>Manage</th>
    </tr>
    {#each domains as domain}
        <tr>
            <td><Dropdown on:optionchange={dropdownChange} options={["A","CNAME","NS","TXT"]}/></td>
            <td><input value={domain[1]}></td>
            <td><input value={domain[2]}></td>
            <td><Button args={"fill danger"} >Delete</Button></td>
        </tr>
    {/each}
</table>

<style>
    tr {
        background-color: rgba(0, 0, 0, 0.1);
    }
    td {
        min-width: 10vw;
    }
</style>