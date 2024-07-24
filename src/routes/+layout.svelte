<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Analytics from "$lib/components/Analytics.svelte";
    import Ads from "$lib/components/Ads.svelte"
</script>

<Analytics/>
<Ads></Ads>
<Header/>
<svelte:head>
    <meta content="frii.site" property="og:title" />
    <meta property="og:type" content="website">
    <meta content="A free domain hosting service. Sign up now for 100% free" property="og:description" />
    <meta content="A free domain hosting service. Sign up now for 100% free" name="description" />
    <meta content="https://frii.site" property="og:url" />
    <meta content="https://repository-images.githubusercontent.com/765252166/ea20ba11-9b83-457e-8db8-2481a83f5cb2" property="og:image" />
    <meta content="#007be1" data-react-helmet="true" name="theme-color" />

    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="frii.site">
    <meta property="twitter:url" content="https://frii.site">
    <meta name="twitter:title" content="frii.site">
    <meta name="twitter:description" content="A free domain hosting service. Sign up now for 100% free">
    <meta name="twitter:image" content="https://repository-images.githubusercontent.com/765252166/ea20ba11-9b83-457e-8db8-2481a83f5cb2">
</svelte:head>
<main>
    <slot/>
</main>

<style>
    :root {
        --primary: rgb(0, 123, 225);
        --border-color: rgba(0, 0, 0, 0.086);
        --border-color: rgba(0,0,0,0.05);
        --secondary-color: #bdbdbd;
        --offwhite-color: #eeeeee;
        --background-color: rgb(216, 216, 216);
        overflow-x: hidden; 
        
    }
    :root::-webkit-scrollbar{
        display: none;
    }
    :root{
        -ms-overflow-style: none;
        scrollbar-width: none;
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
    :global(textarea) {
        transition: all 0.1s;
        border-style: solid;
        border-color: var(--border-color);
        border-radius: 0.5em;
        width: 100%;
        height:100%;
        box-sizing: border-box;
        outline-color: var(--primary);
        resize: vertical;
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
