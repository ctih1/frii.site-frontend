<script lang="ts">
    import Button from "./Button.svelte";
    import { onMount } from "svelte";
    import Dropdown from "./Dropdown.svelte";
    import { ServerContactor } from "../../serverContactor";
    let authToken:string|null;
    let serverContactor:ServerContactor 
    onMount(()=>{
        authToken=window.localStorage.getItem("auth-token");
        serverContactor = new ServerContactor(authToken);
    })
    let domainInput:string;
    let selectedType:string;
</script>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

<form>
    <div class="container"><Dropdown on:optionchange={(event)=>selectedType=event.detail} disabled={false} args={"primary"} options={["A","CNAME","NS","TXT"]} defaultValue={"A"}></Dropdown></div>
    <input bind:value={domainInput} placeholder="domain">
    <div class="container"><Button on:click={()=>serverContactor.registerDomain(domainInput,"0.0.0.0",selectedType)} args={"fill"}><span class="material-symbols-outlined">search</span></Button></div>
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