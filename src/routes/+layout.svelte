<script lang="ts">
    import {navigating} from '$app/stores'
    import Holder from '$lib/components/Holder.svelte';
    import Ads from "$lib/components/Ads.svelte";
    import NProgress from 'nprogress'
    import Header from "$lib/components/Header.svelte";
    import Button from "$lib/components/Button.svelte";
    import Analytics from "$lib/components/Analytics.svelte";
    import '$lib/nprogress.css'
    import { UserError } from '$lib';
    import { browser } from '$app/environment';
    import Error from './+error.svelte';
    import { onMount } from 'svelte';

    let { children } = $props();

    let userRespectsPrivacyInsane = $state(false);
    let userDoesntCareAndWantsAdblock = $state(false);

    NProgress.configure({
      minimum: 0.6,
      trickle: true,
      trickleSpeed: 200
    });

    $effect(() => {
        if ($navigating) {
          NProgress.start();
        }
        if (!$navigating) {
          NProgress.done();
          localStorage.setItem("views", (Number(localStorage.getItem("views")) + 1).toString());
        }

        console.log(userRespectsPrivacyInsane);
    });    

    onMount(() => {
        userDoesntCareAndWantsAdblock = localStorage.getItem("adblock-warn-surpress") !== null;

        if(!userDoesntCareAndWantsAdblock) {
            fetch("https://mc.yandex.ru/metrika/tag.js")
            .then(()=>{
                userRespectsPrivacyInsane = false;
            })
            .catch(() => {
                userRespectsPrivacyInsane = true;
            })
        }
    })

    function userDoesntWantToSupportUs() {
        // :(
        localStorage.setItem("adblock-warn-surpress","yes");
        userDoesntCareAndWantsAdblock = true;
    }

</script>

{#if userRespectsPrivacyInsane && !userDoesntCareAndWantsAdblock}
<Holder>
    <h1>Hello dear Adblock enthusiast</h1>
    <p>Looks like you're using an adblocker. That's okay. Press 'Ignore' if you don't want to support us.</p>
    <div class="holder" style="height: 2em;">
        <Button args="padding" on:click={()=>userDoesntWantToSupportUs()}>Ignore</Button>
    </div>
</Holder>
{/if}
<Header />
<Analytics />
<Ads></Ads>
<svelte:head></svelte:head>
<main>
    {@render children()}
    {@render children()}
</main>

<style>
    :root {
        --primary: rgb(0, 123, 255);
        --border-color: rgba(0, 0, 0, 0.086);
        --border-color: rgba(0, 0, 0, 0.05);
        --secondary-color: #424242;
        --offwhite-color: #303030;
        --background-color: rgb(216, 216, 216);
        background-color: var(--offwhite-color);
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
    :global(#nprogress .bar) {
        color: var(--primary)
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
        background-color: var(--offwhite-color);
        color: white;
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
    :global(a) {
        text-decoration: none;
        color: var(--primary);
        font-size: inherit;
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
        background-color: rgb(25, 25, 25);
    }

    * {
        color: white;
    }

    .adblock-annoyer {
        width: 100vw;
        height: 100vh;
        background-color: var(--offwhite-color);
    }
</style>
