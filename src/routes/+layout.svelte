<script lang="ts">
    import Header from "$lib/components/Header.svelte";
</script>

<Header/>
<main>
    <slot/>
</main>


<style>
    :root {
        --primary: rgb(0, 123, 225);
    }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
    :global(*) {
        font-family: "Inter",sans-serif;
    }
    main {
        position: absolute;
        left: 0px;
        min-height: 100vh;
        min-width: 100vw;
        background-color: rgb(216, 216, 216);
    }
</style>
