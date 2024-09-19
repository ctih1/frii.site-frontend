<script lang="ts">
  import { onMount } from "svelte";
  import { error } from "@sveltejs/kit";
  import { serverURL } from "../../serverContactor";
  import SvelteMarkdown from "svelte-markdown";
  import Holder from "$lib/components/Holder.svelte";
  interface Iblog {
    url:string,
    created:number,
    body:string,
    title:string
  }

  let blogs:Iblog[] = []

  onMount(()=>{
    async function getBlogs() {
        await fetch(`${serverURL}/blog/get/all?content=32&n=50`).then(response=>{
          if(response.status!==200) {error(500,
            {
            message: "Failed to retrieve blogs"
            }
          )};
          response.json().then(data=>{
              blogs = data as Iblog[];
          })
        })
    }
    getBlogs();
  })
</script>

<Holder>
    {#each blogs as blog}
        <div class="blog-holder">
            <h1><a href={`https://www.frii.site/blog/${blog.url}`}>{blog.title}</a></h1>
            <p>{new Date(blog.created*1000).toDateString()}</p>
            <p><SvelteMarkdown source={blog.body+"..."}/></p>
        </div>
    {/each}
</Holder>

<style>
</style>
