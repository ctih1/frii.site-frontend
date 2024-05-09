<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let options = ["A","CNAME","TXT"];
    let toggled:boolean=false;
    export let dropdown:HTMLDivElement;
    export let button:HTMLButtonElement;
    function toggleDropdown() {
        dispatch("click")
        if(!toggled) {
            dropdown.style.display="block";
        }
        else {
            dropdown.style.display="none";
        }
        toggled=!toggled;
    }   
    function onDropdownChange(element:string) { 
        dispatch("optionchange");
        button.innerHTML = element;
        toggleDropdown();
    }
</script>

<div class="dropdown">
    <button bind:this={button} on:click={()=>toggleDropdown()}>Title</button>
    <div class="dropdown-content" bind:this={dropdown}>
        <ul>
        {#each options as option}
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <button on:click={()=>onDropdownChange(option)}>{option}</button>
        {/each}
        </ul>
    </div>
</div>

<style>
    .dropdown {
        position: relative;
        display: inline-block;
    }
    .dropdown-content {
        display: none;
        position: absolute;
    }
    ul {
        
    }
    li {
        list-style: none;
    }
</style>