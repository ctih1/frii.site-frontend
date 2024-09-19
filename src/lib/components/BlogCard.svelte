<script lang="ts">
    import { serverURL } from "../../serverContactor"
    import { onMount } from "svelte"
    import {t} from "$lib/translations"
    import Placeholder from "./Placeholder.svelte";
     import SvelteMarkdown from "svelte-markdown";
     export let title:string;
     export let description:string;
     export let date:number;
     export let url:string;

</script>

<div class="wrapper">
    <h1>{title}</h1>
    <p>{new Date(date*1000).toLocaleDateString()}</p>
    <div class="blogcard-body">
        <SvelteMarkdown source={description}/>
    </div>
    <a href={`/blog/${url}`}>{$t("common.blog_read")}</a>
</div>

<style>
    :global(.blogcard-body *) {
        font-size: 1em;
    }
    .wrapper {
        border: 2px solid var(--offwhite-color);
        background-color: var(--background-color);
        border-radius: 0.5em;
        padding: 1em;
        z-index: 15;
        border-left: 10px solid var(--primary);
    }
</style>
