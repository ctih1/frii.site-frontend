<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let options:Array<String>;
    let toggled:boolean=false;
    let dropdown:HTMLDivElement;
    let button:HTMLButtonElement;
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
    function onDropdownChange(element:String) { 
        dispatch("optionchange",element);
        button.innerHTML = element.toString();
        toggleDropdown();
    }
</script>

<div class="dropdown">
    <button class="dropdown-button" type="button" bind:this={button} on:click={()=>toggleDropdown()}>Title</button>
    <div class="dropdown-content" bind:this={dropdown}>
        <ul>
        {#each options as option}
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li on:click={()=>onDropdownChange(option)}>{option}</li>
        {/each}
        </ul>
    </div>
</div>

<style>
    li:not(:hover) {
        transition: 100ms ease-in-out;
    }
    .dropdown {
        width: 10em;
        position: relative;
        display: inline-block;
    }
    .dropdown-button {
        border-style: none;
        width: 100%;
    }

    .dropdown-content {
        width: 100%;
        display: none;
        position: absolute;
        border-style: none;
    }
    ul {
        width: 100%;
        margin: 0px;
        padding: 0px;
        background-color: #fff;
        border-bottom-left-radius: 0.5em;
        border-bottom-right-radius: 0.5em;
    }
    li {
        list-style: none;
        background-color: rgba(0,0,0,0);
        border-style: none;
        padding-top: 0.25em;
        padding-bottom: 0.25em;
        width: 100%;
    }
    li:hover{
        cursor: pointer;
        background-color: var(--primary);
    }
</style>