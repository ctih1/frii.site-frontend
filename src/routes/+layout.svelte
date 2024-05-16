<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Analytics from "$lib/components/Analytics.svelte";
    import Ads from "$lib/components/Ads.svelte"
</script>

<Analytics/>
<Ads></Ads>
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
        outline-color: var(--primary);
    }
    :global(a) {
        text-decoration: none;
        color: var(--primary);
        font-size: inherit;
    }
    :global(.holder) {

    }
    

    @media (min-width:960px) {
        .holder {
            width: 100vw;
            margin-left: 2em;
            margin-right: 2em;
        }
    }
    main {
        position: absolute;
        left: 0px;
        min-height: 100vh;
        min-width: 100vw;
        background-color: rgb(216, 216, 216);
    }
</style>
