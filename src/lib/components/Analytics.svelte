<script lang="ts">
      import { page } from '$app/stores'

      
    $: {    
    // @ts-ignore
    if (typeof gtag !== 'undefined') {
        // @ts-ignore   
        gtag('config', 'G-PHP66YQSWC', {
        page_title: document.title,
        page_path: $page.url.pathname,
        })
    }
    }
</script>

<svelte:head>
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-PHP66YQSWC">
  </script>
  <script>
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', 'G-PHP66YQSWC')
  </script>
</svelte:head>