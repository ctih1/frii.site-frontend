<script lang="ts">
	import Registrar from '$lib/components/Registrar.svelte';
    import DomainTable from "$lib/components/DomainTable.svelte";
    import Modal from "$lib/components/Modal.svelte";

</script>

<div class="holder">
    <h1>Your domains</h1>
    <DomainTable/>
</div>

<div class="holder">
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