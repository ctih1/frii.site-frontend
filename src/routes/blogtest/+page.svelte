<script lang="ts">
    //@ts-ignore
    import { t } from '$lib/translations';
    import BlogCard from "$lib/components/BlogCard.svelte";
    import UpdateCard from "$lib/components/UpdateCard.svelte";
    import { onMount } from 'svelte';
  
    interface Iblog {
      url: string,
      created: number,
    }
  
    let blogs: Iblog[] = [];
    let blogs2: Iblog[] = [];
  

    onMount(() => {
        async function load() {
            await fetch(`https://devserver.frii.site/blog/get/all?n=6`).then(response => {
                if (response.status !== 200) { 
                    console.log("Failed to load blogs"); 
                    return; 
                }
                response.json().then(data => {
                    blogs = data as Iblog[]; 
                });
            });
        }
        load();
    });
  
    
    onMount(() => {
        async function load2() {
            await fetch(`http://localhost/blog/get/all?n=6`).then(response => {
                if (response.status !== 200) { 
                    console.log("Failed to load updates"); 
                    return; 
                }
                response.json().then(data => {
                    blogs2 = data as Iblog[];  
                });
            });
        }
        load2();
    });
  </script>
  
  <div class="blogs">
    <h3 style="font-size: 3em; width: fit-content; margin-left: auto; margin-right: auto; color: white;">Latest updates</h3>
    <div class="latest-releases">
        {#each blogs as blog}
            <BlogCard urlTitle={blog.url}/>
        {:else}
            <p style="color: white;">Failed to load blogs 😔, Please try again later.</p>
        {/each}
    </div>
  </div>
  
  <div class="blogs">
    <h3 style="font-size: 3em; width: fit-content; margin-left: auto; margin-right: auto; color: white;">Site Updates</h3>
    <div class="latest-releases">
        {#each blogs2 as blog}
            <UpdateCard urlTitle={blog.url}/>
        {:else}
            <p style="color: white;">Failed to load site updates 😔, Please try again later.</p>
        {/each}
    </div>
  </div>
  