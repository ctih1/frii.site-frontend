<script lang="ts">
    import Holder from '$lib/components/Holder.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import Button from '$lib/components/Button.svelte';
    import { onMount } from 'svelte';
    import Modal from "$lib/components/Modal.svelte";
    import { text } from '@sveltejs/kit';

    let progress: HTMLElement;
    let visible = false;
    let _title: string = "";
    let _description: string = "";
    let loader;
    let modal: Modal | undefined; 
    let description: string = "This is a page to test the Loader.svelte component and should be treated as such!";
    let title: string = "This isnt finished!";
    let options: string[] = ["Continue"];

    function openModal() {
     if (modal) {
        modal.open(title, description);
      }
    }
    function modalClose() {
      if (modal) {
        modal.close();
      }
    }
    function openLoader() {
        if (loader) {
            loader.show('Loading', 'Please wait while we process your request...');
        }
    }

    function closeLoader() {
        if (loader) {
            loader.hide();
        }
    }
    onMount(() => {
        openModal();
        closeLoader()
    });
</script>
<Holder>
<center>
<h1>Loader Test</h1>
<Button on:click={openLoader} args={"padding"}>
    Show Loader
  </Button>
  <Button on:click={closeLoader} args={"padding"}>
    Close Loader
  </Button>

</center>
</Holder>


<Loader bind:this={loader} />
<Modal bind:this={modal} on:primary={()=>modalClose()} on:secondary={()=>modalSecondary()} overrideDefault={true} title={title} description={description} options={["Continue"]}></Modal>
