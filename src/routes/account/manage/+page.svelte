<script lang="ts">
	import Button from '$lib/components/Button.svelte';
    import Holder from "$lib/components/Holder.svelte";
    import Modal from "$lib/components/Modal.svelte";
    
    let modal:Modal;
    function handleDelete() {
        modal.open("Are you sure you want to delete your account?","This is a destructive action which cannot be undone. Are you sure you want to continue?",15,["Cancel","Continue"]);
    }
</script>

<Holder>
    <h1>Manage your account</h1>
    <div class="danger">
        <Button args={"danger padding"} on:click={()=>handleDelete()}>Delete your account</Button>
    </div>
</Holder>

<Modal bind:this={modal} options={["Continue"]} title={""} description={""}></Modal>
