<script lang="ts">
    import { serverURL } from "../../serverContactor"
    import { onMount } from "svelte"
    import {t} from "$lib/translations"
    import Placeholder from "./Placeholder.svelte";
     import SvelteMarkdown from "svelte-markdown";
    export let urlTitle:string;

    interface article {
      date: number;
      title: string;
      body: string;
    };
    let post:article;
    let loaded:boolean=false;

    onMount(()=>{
      async function ö() { // why is it named ö? because it's what I thoguht when creating this method <3
        const dataRequest = fetch(`${serverURL}/blog/${urlTitle}`, {
          method: "GET",
        }).then(response=>{
          if(response.status!==200) {console.log("Failed to load blog "+urlTitle); return;}
          response.json().then(data=>{
              post = data as article;
              loaded = true;
          })
        })
        ;
      }
      ö();
    });
</script>

<div class="wrapper">
    {#if loaded}
        <h1>{post.title}</h1>
        {@const date = new Date(post.date * 1000)}
        <p>{date.toLocaleDateString()}</p>
        <div class="blogcard-body">
            <SvelteMarkdown source={post.body.substring(0,80)}.../>
        </div>
        <a href={`/blog/${urlTitle}`}>{$t("common.blog_read")}</a>
    {:else}
        <h1 style="height: 1.5em;"><Placeholder/></h1>
        <p><Placeholder/></p>
        <div class="blogcard-body" style="height: 3em;">
            <Placeholder/>
        </div>
    {/if}
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
    }
</style>
