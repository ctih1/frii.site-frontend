<script lang="ts">
    import { onMount } from 'svelte'
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let options:Array<String>;
    export let defaultValue:string;
    export let disabled:boolean;
    let toggled:boolean=false;
    let dropdown:HTMLDivElement;
    let button:HTMLButtonElement;
    let value:string = defaultValue;
    let selected:String;
    export let args:string | null = null;
    onMount(()=> {
        if(disabled) {
            button.onclick=(null);
        }
    })

    export function toggleDisable() {
        if(!disabled) {
            button.onclick=toggleDropdown;
            dropdown.style.display="none";
            toggled=false;
        }else {
            button.onclick=(null);
        }
        disabled=!disabled;
    }

    function toggleDropdown():void {
        dispatch("click");
        if(!toggled) {
            dropdown.style.display="block";
        }else {
            dropdown.style.display="none";
        }toggled=!toggled;
    }   
    function onDropdownChange(element:String):void { 
        dispatch("optionchange",element);
        selected=element;
        value = element.toString();
        toggleDropdown();
    }
    export function getValue():string {
        return selected.toString();
    }
</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

<div class="dropdown">
    <button  class="dropdown-button {args}" type="button" bind:this={button} on:click={()=>toggleDropdown()}>{value}<span class="material-symbols-outlined">arrow_drop_up</span></button>
    <div on:blur={()=>toggleDropdown()} class="dropdown-content" bind:this={dropdown}>
        <ul>
        {#each options as option}
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li on:click={()=>onDropdownChange(option)}>{@html option}</li>
        {/each}
        </ul>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
    li:not(:hover) {
        transition: 100ms ease-in-out;
    }
    .dropdown {
        width: 100%;
        height: 100%;
        position: relative;
        display: inline-block;
    }
    .dropdown-button {
        display: flex;
        transition: background-color 100ms;
        background-color: rgb(146, 195, 119);
        align-items: center;
        width: 100%;
        height: 100%;
    }
    .dropdown-button span {
        margin-left: auto;
        background-color: rgb(146, 195, 119)
    }
    .dropdown-button:active {
        color:grey;
    }
    .dropdown-button:hover {
        color: green;
        background-color: grey;
    }

    .dropdown-content {
        width: 100%;
        display: none;
        position: absolute;
        z-index: 4;
        color: rgb(0, 0, 0);
    }

    ul {
        width: 100%;
        margin: 0px;
        padding: 0px;
        background-color: rgb(146, 195, 119);
        box-shadow: 0px 0px 73px -20px rgba(0,0,0,0.75);

    }
    li {
        list-style: none;
        background-color: rgba(0,0,0,0);
        padding-top: 0.25em;
        padding-bottom: 0.25em;
        width: 100%;
    }
    li:hover{
        cursor: pointer;
        background-color: var(--primary);
    }
    .primary {
        background-color: var(--primary);
        color: black;
    }
</style>
