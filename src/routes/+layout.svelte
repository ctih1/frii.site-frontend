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
        --border-color: rgba(0,0,0,0.05);
        overflow-x: hidden;
    }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
    :global(*) {
        font-family: "Inter",sans-serif;
    }
    :global(input) {
        transition: all 0.1s;
        border-style: solid;
        border-color: var(--border-color);
        border-radius: 0.5em;
        width: 100%;
        height:100%;
        box-sizing: border-box;
    }
    :global(input:hover) {
        outline-color: var(--primary);
    }

    :global(a) {
        text-decoration: none;
        color: var(--primary);
    }
    :global(.holder) {
        width: 50vw;
        margin-left: auto;
        margin-right: auto;
        background-color: white;
        border-radius: 0.5em;
        padding: 2em;
        margin-top: 2em;
    }
    main {
        position: absolute;
        left: 0px;
        min-height: 100vh;
        min-width: 100vw;
        background-color: rgb(216, 216, 216);
    }
</style>
