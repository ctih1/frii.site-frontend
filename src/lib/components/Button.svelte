<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let button:HTMLButtonElement;
    let disabled:boolean=false;
    export let startDisabled:boolean=false;
    function click() {
        if(!disabled) {
            dispatch("click");
        }
    }
    export function disable() {
        button.disabled = true;
        disabled=true;
    }
    export function enable() {
        button.disabled = false;
        disabled=false;
    }
    export function toggleDisable() {
        disabled=!disabled;
        button.disabled=disabled;
    }
    export function changeText(text:string) {
        button.innerHTML=text;
    }
    export let args:string|null = null;
</script>

<button disabled={startDisabled} bind:this={button} on:click={()=>click()} class="{args}">
    <slot></slot>
</button>

<style>
    button:disabled {
        opacity: 0.5;
    }
    button {
        display: flex;
        height: 100%;
        transition: scale 50ms;
        background-color: rgb(146, 195, 119);
        color: white;
        -webkit-box-shadow: 0px 10px 105px -50px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 10px 105px -50px rgba(0,0,0,0.75);
        box-shadow: 0px 10px 105px -50px rgba(146,195,119,0.75);
        text-align: center;
        justify-content: center;
        align-items: center;
    }
    button:active:enabled {
        scale: 0.95;
    }
    button:hover:enabled  {
        cursor: pointer;
    }
    .scale:active {
        scale: 0.85;
    }
    .warning {
        background-color: rgb(200, 123, 55);
    }
    .danger {
        background-color: rgb(230,15,0);
    }
    .fill {
        padding: 0px;
        width: 100%;
        height: 100%;
    }
    .three-quarters {
        width: 75%;
    }
    .half {
        width: 50%;
    }
    .quarter {
        width: 25%;
    }

    .margin {
        margin: 0.5em;
    }
    .square {
        aspect-ratio: 1;
    }
    .borked-square {
        aspect-ratio: 3/2;
    }

    .side-margin {
        margin-left: 0.25em;
        margin-right: 0.25em;
    }

    .margin-center {
        margin-left: auto;
        margin-right: auto;
    }

    .margin-1em-top {
        margin-top: 1em;
    }

    .padding {
        padding: 0.5em;
    }

    .scale {
        scale: 0.9;
    }
    .no-margin {
        margin: 0px;
    }
    .height-unset {
        height: unset;
    }
</style>
