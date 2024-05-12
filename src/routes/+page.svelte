<script lang="ts">
    import { onMount } from "svelte";
    import Holder from "$lib/components/Holder.svelte";
    let videoContainer:HTMLDivElement;

</script>
<svelte:head>
    <title>frii.site</title>
</svelte:head>

<div class="content">
    <div bind:this={videoContainer} class="video-container" >
        <video class="foreground"
            poster="https://s4hype.xyz/assets/thumbnail_fs.webp"
            autoplay
            loop
            preload="metadata"
            muted
            src="/fsstory4.mp4"
            type="video/mp4"
        />
    </div>
</div>

<Holder>
    <h1p>Get started!</h1p>
    <h2>To get started, please <a href="/login">make an account</a>.</h2>
    
    <div id="how-it-works">
        <h1>How it works</h1>
        <ul>
            <li>You <a href="/login">register</a> an account</li>
            <li>You <a href="/dashboard">register a domain</a></li>
            <li>Our servers register the domain as yours, which means you are the only one that can access it</li>
            <li>You have full access to the domain in <a href="/dashboard">the dashboard</a></li>
        </ul>
    </div>
</Holder>


<style>
    h1p {
        font-size: 3em;
        font-weight: 600;
    }
    .content {
        display: flex;
        flex-direction: row;
        width: 100vw;
        height: 100vh ;
    }
    .right {
        width: 40vw;
    }
    .video-container {
        aspect-ratio: 1;
        width: 100vw;
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow:hidden;
    }
    .foreground {
        object-fit: cover;
        z-index: 3;
        width: 100vw;
        height: 120vh;
        margin-left: auto;
        margin-right: auto;
    }
    li {
        font-size: 1.25em;
    }
</style>
