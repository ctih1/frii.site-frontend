<script lang="ts">
    export let value:number|undefined;
    export let max:number;
    let colors:Map<string,string> = new Map(Object.entries({
        1:"var(--primary)",
        2:"rgb(84,221,101)",
        3:"rgb(237,220,52)",
        4:"rgb(237,139,52)",
        5:"rgb(237,52,52)"
    }));
    if(value===undefined) {value=-1;}
</script>

<div class="scale">
    {#each Array(max) as _, index} 
        <div style="width: {100/max}%; background-color: {(value>index)?(colors.get(value.toString())) : ("var(--background-color)")};" class="block"></div>
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