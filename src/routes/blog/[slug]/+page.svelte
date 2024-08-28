<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    import Holder from "$lib/components/Holder.svelte";
    interface article {
        date: number;
        title: string;
        body: string;
    }
    export let data: article;
    let source = data.body;
    const time = new Date(0);
    time.setSeconds(data.date);
</script>

<link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
/>
<Holder>
    <h1>{data.title}</h1>
    <p style="display: flex; align-items:center; opacity: 0.5;">
        <span class="material-symbols-outlined">schedule</span>
        {time}
    </p>
    <SvelteMarkdown {source} />
</Holder>

<style>
</style>
