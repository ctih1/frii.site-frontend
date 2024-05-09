<script lang="ts">
    import Button from "./Button.svelte";
    import Dropdown from "./Dropdown.svelte";

</script>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

<form>
    <div class="container"><Dropdown disabled={false} args={"primary"} options={["A","CNAME","NS","TXT"]} defaultValue={"A"}></Dropdown></div>

    <input placeholder="domain">
    <div class="container"><Button args={"fill"}><span class="material-symbols-outlined">search</span></Button></div>
    
</form>

<style>
    form {
        display: flex;
        flex-direction: row;
        height: 2em;
    }
    form * {
        margin-left: 0.25em;
        margin-right: 0.25em;
    }
    .container {
        width: 5em;
    }

</style>