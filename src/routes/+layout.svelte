<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import MobileHeader from "$lib/components/MobileHeader.svelte";
    import Analytics from "$lib/components/Analytics.svelte";
    import Banner from "$lib/components/Banner.svelte";
    import Ads from "$lib/components/Ads.svelte";
    import { onMount } from "svelte";

    let isMobile = false;

    onMount(() => {
        const checkIfMobile = () => {
            const userAgent =
                navigator.userAgent || navigator.vendor || window.opera;
            isMobile =
                /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
                    userAgent.toLowerCase(),
                );
        };

        checkIfMobile();

        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    });
</script>

<Banner />
{#if isMobile}
    <MobileHeader />
{:else}
    <Header />
{/if}

<Analytics />
<Ads></Ads>
<svelte:head></svelte:head>
<main>
    <slot />
</main>

<style>
    :root {
        --primary: rgb(255, 0, 0);
        --border-color: rgba(0, 0, 0, 0.086);
        --border-color: rgba(0, 0, 0, 0.05);
        --secondary-color: #000000;
        --offwhite-color: #000000;
        background-color: black;
        --background-color: rgb(0, 0, 0);

        overflow-x: hidden;
    }
    :root::-webkit-scrollbar {
        display: none;
    }
    :root {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");
    :global(*) {
        font-family: "Inter", sans-serif;
    }
    :global(input) {
        transition: all 0.1s;
        border-style: solid;
        border-color: var(--border-color);
        border-radius: 0.5em;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        outline-color: var(--primary);
    }
    :global(input[type="checkbox"]) {
        transition: all 0.3s;
        width: 100%;
        max-width: 2em;
        aspect-ratio: 1;
        accent-color: var(--primary);
    }
    :global(textarea) {
        transition: all 0.1s;
        border-style: solid;
        border-color: var(--border-color);
        border-radius: 0.5em;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        outline-color: var(--primary);
        resize: vertical;
    }
    :global(input) {
        color: black;
    }
    :global(li) {
        color: black;
    }
    :global(a) {
        text-decoration: none;
        color: var(--primary);
        font-size: inherit;
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
        height: fit-content;
        background-color: rgb(0, 0, 0);
    }
</style>
