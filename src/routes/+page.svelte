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

<BubbleBackground>
<div class="content">
    <div class="parent">
        <div class="div1"> 
            <div class="text-container">
                <h1><strong>frii.site</strong></h1>
                <p style="font-size: 1.5em;"><i>{ $t("common.index_description") }</i></p>
            </div>
        </div>

        <div class="div2"> 
            <div class="div2-content">
                <div class="button-holder">
                    <x class="bh"><Button on:click={()=>{window.location.href="/account";}} args={"fill"}><a style="color: #ffffff;" href="/account">{$t("common.index_register_account")}</a></Button></x>
                    <x class="bh"><Button on:click={()=>{window.location.href="/dashboard";}} args={"fill"}><a style="color: #ffffff;" href="/dashboard">{$t("common.index_goto_dashboard")}</a></Button></x>
                </div>  
            </div>  
        </div>

        <div class="div3">
    
        </div>

        <div class="div4">

        </div>
    </div>
</div>
<div class="content">
    <div class="parent">
        <div class="div1"> 
            <div class="text-container">
                <h2><strong>{$t("common.index_aboutus")}</strong></h2>
            </div>
        </div>

        <div class="div2"> 
            <div class="div2-content">
                <h3 style="height: fit-content; margin-right: 1em; margin-left: 1em;" class="info">{@html $t("common.index_aboutus_description")}</h3>
            </div>  
        </div>

    </div>
</div>
</BubbleBackground>
<style>
    .parent {
        display: grid;
        grid-template-columns: 3fr 2fr;
        grid-template-rows: 1fr 5fr 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        width: 100vw;
    }

    .div1 {
        grid-area: 2 / 1 / 3 / 2;
        text-align: center;
        display: flex;
        flex-direction: column;
    }
    
    .text-container {
        margin-top: auto;
        margin-bottom: auto;
    }
    .text-container * {
        height: fit-content;
        margin-top: 0px;
        margin-left: 0.5em;
    }
    .button-holder {
        display: flex;
        flex-direction: row;
        margin-right:auto;
        height: 15%;
        width: 60%;

    }
    .button-holder x {
        margin: 2px;
        display: flex;
        width: 45%;
        height: 100%;
        min-width: 80px;
        min-height: 50px;
    }
    .div2-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .div2 {
        display: flex;
        grid-area: 2 / 2 / 3 / 3; 
    }
    .div3 { grid-area: 1 / 1 / 2 / 3; }
    .div4 { grid-area: 3 / 1 / 4 / 3; }

    h1 {
        font-size: 10em;
        font-weight: 500;
        margin-bottom: 0px;
    }
    .content {
        display: flex;
        flex-direction: row;
        width: 100vw;
        min-height: 100vh;
        height: 100%;
    }

    @media(max-width: 1330px) {
        .text-container h1 strong, .text-container h1{
            margin-left: 20px;
        }
        .text-container {
            text-align: left;
        }
        .text-container p {
            margin-left: 30px;
        }

    } 
    @media(max-width: 1030px) {
        h1 {
            font-size: 7em;
        }
        h2 {
            font-size: 5em;
        }
        h3 {
            font-size: 1.5em;
        }
    }
    @media (orientation: portrait), (max-width: 745px) {
        .parent {
            margin-top: auto;
            margin-bottom: auto;
            grid-template-columns: 1fr;
            grid-template-rows: auto;
        } 
        .parent * {
            align-items: center;
            margin-right: auto;
            margin-left: auto;
        }
        .button-holder x {
            width: 40vw;
            height: 4em;
        }
        .parent div {
            grid-area: auto/auto/auto/auto;
            width: 100vw;
            height: fit-content;
        }
        .parent div * {
            margin-left: auto;
            margin-right: auto;
        }
        h1 {
            font-size: 12em;
        }
        .text-container {
            text-align: center;
        }
    }
    @media(max-width: 795px) {
        h1 {
            font-size: 10em;
        }
    }
    @media(max-width: 690px) {
        h1 {
            font-size: 8em;
        }
    }
    @media(max-width: 580px) {
        h1 {
            font-size: 6em;
        }
    }
    .info {
        font-weight: 500;
    }

    h2 {
        font-size: 6em;
        max-width: 90vw;
        overflow-wrap: break-word;
    }
    h3 {
        font-size: 2em;
    }
</style>
