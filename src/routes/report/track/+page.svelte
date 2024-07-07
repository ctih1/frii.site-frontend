<script lang="ts">
    import Road from '$lib/components/Road.svelte';
    import Holder from '$lib/components/Holder.svelte';
    export let data;
    console.log(data);
</script>

<Holder args="fill">
    <Road points={["First stage","Second stage","Third stage","Forth stage","Fifth stage"]} color={"#FFF"} completed={2}></Road>
</Holder>

<style>

</style>