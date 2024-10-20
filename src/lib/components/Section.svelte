<script lang="ts">
    export let id:string;
    export let title:string;
</script>

<div id={id} class="section">
    <h1>{title}</h1>
    <slot/>
</div>

<style>
    .section {
        background-color: rgb(39, 27, 27);
        border-radius: 0.5em;
        padding: 0.5em;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }
</style>