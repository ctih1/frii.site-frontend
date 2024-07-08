<script lang="ts">
    export let value:number|undefined;
    export let max:number;
    export let trueColor:string|undefined;
    if(trueColor===undefined) {trueColor="var(--primary)";}
    if(value===undefined) {value=-1;}
</script>

<div class="scale">
    {#each Array(max) as _, index} 
        <div style="width: {100/max}%; background-color: {(value>index)?(trueColor) : ("var(--background-color)")};" class="block"></div>
    {/each}
</div>

<style>
    .scale {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    .block {
        height: 100%;
        min-height: 5px;
        border-radius: 1em;
        margin-left: 0.25%;
        margin-right: 0.25%;
    }
</style>