<script lang="ts">
    import Button from "./Button.svelte";
    import { createEventDispatcher } from "svelte";
    let dispatcher=createEventDispatcher();
    export let items:{displayText:string, valueText:string}[]
    
    export function addItem(item:{displayText:string,valueText:string}):void {
        items.push(item);
        items=[...items];
    }
    export function removeItem(target:{displayText:string,valueText:string}):void {
        items=items.filter(function(item) {
            return item!=target
        });
        dispatcher("remove",target);
    }
</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />


<div class="box">
    <div class="items">
        {#each items as item}
            <div class="item">
                <p>{item.displayText}</p>
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <span on:click={()=>removeItem(item)} class="material-symbols-outlined">cancel</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .box {
        transition: all 0.3s;
        border-width: 1px;
        border-radius: 0.5em;
        border-style: solid;
        border-color: var(--secondary-color);
        width: fit-content;
        height: fit-content;
    }
    .items {
        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: repeat(auto, auto);
        grid-gap: 0.5em;
        padding: 0.5em;
    }
    .item:hover {
        box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
    }
    .item span {
        transition: color 100ms ease-in-out;
    }
    .item {
        transition: box-shadow 0.3s;
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        border-width: 1px;
        border-radius: 0.5em;
        border-style:dotted;
        height: fit-content;
        width: fit-content;
        width: 100%;
        height: 100%;
        border-color: var(--secondary-color);
    }
    .item:hover {
        border-style: solid;
    }

    .item span:hover {
        cursor: pointer;
    }

</style>