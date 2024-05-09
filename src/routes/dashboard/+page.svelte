<script lang="ts">
	import Registrar from '$lib/components/Registrar.svelte';
    import DomainTable from "$lib/components/DomainTable.svelte";
    import Modal from "$lib/components/Modal.svelte";

</script>

<div class="holder">
    <h1>Your domains</h1>
    <p>These are all the domains you own. You can modify each parameter of them by simply clicking on their respective input field.</p>
    <DomainTable/>
</div>

<div class="holder">
    <h2>Register a new domain</h2>
    <p>Registering a new domain is just a few clicks away! You can always get help from our <a href="wikipedia.com">Wiki</a></p>

    <Registrar/>
</div>

<style>
    .holder {
        width: 50vw;
        margin-left: auto;
        margin-right: auto;
        background-color: white;
        border-radius: 0.5em;
        padding: 2em;
        margin-top: 2em;
    }
</style>