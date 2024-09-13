<script lang="ts">
    //@ts-ignore
    import { t } from '$lib/translations';
    import Holder from '$lib/components/Holder.svelte';
    import BubbleBackground from "$lib/components/BubbleBackground.svelte";
    import Button from "$lib/components/Button.svelte";
</script>
<svelte:head>
    <title>frii.site</title>
</svelte:head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<BubbleBackground>
    <h1 class="title" style="font-size: 10em;">frii.site</h1>
    <div class="introduction-wrapper">
        <div class="center">
            <h1 style="font-size: 5em; margin-bottom: 0px;"><strong>{$t("common.index_aboutus")}</strong></h1>
            <hr style="width: 100%; opacity: 0.1; height: 4px;"/>
            <p style="margin-top: 10px;">{@html $t("common.index_aboutus_description")}
        </div>
        <div class="left">
            <h2><span class="material-symbols-outlined">lock</span>Security</h2>
        </div>
        <div class="right">
            <h2><span class="material-symbols-outlined">raven</span>Freedom</h2>
        </div>
        <div class="bottom-left">
            <h2><span class="material-symbols-outlined">support</span>Support</h2>
        </div>
        <div class="bottom-right">
            <h2><span class="material-symbols-outlined">encrypted</span>Privacy</h2>
        </div>
    </div>
</BubbleBackground>

<style>
    .title {
        padding: 10px;
        transition: all 0.3s;
        background: radial-gradient(circle, rgb(80,120,225), rgb(100,120,225));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: textHue 7s linear infinite forwards;
        background-size: 400% 100%;
    }
    .title:hover {

    }
    .introduction-wrapper {
        display: grid;
        width: 100vw;
        height: 100vh;
        grid-template-rows: repeat(3,1fr);
        grid-template-columns: repeat(3,1fr);
    }
    .introduction-wrapper div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .introduction-wrapper div h2 {
      display: flex;
      align-items: center;
    }
    .center {
      grid-area: 2 / 2 / 3 / 3;
      text-align: center;
      min-width: fit-content;
    }
    .left {
        grid-area: 1 / 1 / 2 / 2;
    }
    .bottom-left {
        grid-area: 3 / 1 / 4 / 2;
    }
    .bottom-right {
        grid-area: 3 / 3 / 4 / 4;
    }
    .right {
        grid-area: 1 / 3 / 2 / 4;
    }

    @media(orientation:portrait) {
      .introduction-wrapper {
        display:flex !important;
        flex-direction: column;
      }
      .introduction-wrapper div {
        margin: 2em;
      }
    }

    @keyframes textHue {
        0% {
            background-position: 0 50%;
        } 50% {
            background-position: 100% 0;
        } 100% {
            background-position: 0 -50%;
        }
    }
</style>
