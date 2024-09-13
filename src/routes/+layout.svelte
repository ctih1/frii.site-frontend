<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Analytics from "$lib/components/Analytics.svelte";
    import Banner from "$lib/components/Banner.svelte";
    import Ads from "$lib/components/Ads.svelte";
</script>

<Banner />
<Header />
<Analytics />
<Ads></Ads>
<svelte:head></svelte:head>
<main>
    <slot />
</main>

<style>
    :root {
        --primary: rgb(146, 195, 119);
        --secondary-color: #000000;
        --offwhite-color: #000000;
        --background-color: grey;
        color: green;
        background: black;
        overflow-x: hidden;
    }

    :root::-webkit-scrollbar {
        display: none;
    }
    :root {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    :global(*) {
        font-family: "Comic Sans MS", sans-serif;
        font-weight: 400;
        font-style: normal;
    }
    :global(input) {
        transition: all 0.1s;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        outline-color: var(--primary);
        background-color: rgb(146, 195, 119);
    }
    :global(input[type="checkbox"]) {
        transition: all 0.3s;
        width: 100%;
        max-width: 2em;
        aspect-ratio: 1;
        accent-color: var(--primary);
        background-color: black;
    }
    :global(textarea) {
        transition: all 0.1s;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        outline-color: rgb(146, 195, 119);
        resize: vertical;
        background-color: rgb(146, 195, 119);
    }
    :global(a) {
        text-decoration: none;
        font-size: inherit;
        color: #92c377;

    }
    :global(.holder) {
    }

    @media (min-width: 960px) {
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
        color: lightblue;
    }
	
</style>
