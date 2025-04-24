<script lang="ts">
  import { onMount } from "svelte";
  import { error } from "@sveltejs/kit";
  import { serverURL } from "../../serverContactor";
  import { t } from "$lib/translations";
  import BlogCard from "$lib/components/BlogCard.svelte";

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
    <h1>{$t("blogs_title")}</h1>
    <p>{$t("blogs_description")}</p>
    {#each blogs as blog}
        <BlogCard inline={true} title={blog.title} description={blog.body} date={blog.created} url={blog.url} />
    {/each}
</Holder>

<style>
</style>
