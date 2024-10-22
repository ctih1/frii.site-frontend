<script>
    import { onMount } from 'svelte';
    import { marked } from 'marked';
    import Holder from "$lib/components/Holder.svelte";
    
    let content = '';
    const url = 'https://raw.githubusercontent.com/ctih1/frii.site-frontend/refs/heads/dark/README.md'; //gasp
  
    onMount(async () => {
      const response = await fetch(url);
      if (response.ok) {
        const text = await response.text();
        content = marked(text);
      } else {
        content = 'Error loading markdown file';
      }
    });
  </script>
  <Holder>
    <div class="markdown">{@html content}</div>
  </Holder>
  <style>
    .markdown {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      width: 100%; 
    }
    .markdown img {
        max-width: 100%;            
        height: auto;               
        max-height: 400px;         
        display: block;             
        margin: 0 auto;    
    }
  </style>
  