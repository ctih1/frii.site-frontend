<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let button:HTMLButtonElement;
    function click() {
        dispatch("click");
    }
    export function changeText(text:string) {
        button.innerHTML=text;
    }
    export let args:string;
    


</script>

<button bind:this={button} on:click={()=>click()} class="{args}">
    <slot></slot>
</button>

<style>
    button {
        display: flex;
        height: 100%;
        transition: scale 50ms;
        background-color: rgb(0, 123, 255);
        border-radius: 0.5em;
        border-style: none;
        color: white;
        -webkit-box-shadow: 0px 10px 105px -50px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 10px 105px -50px rgba(0,0,0,0.75);
        box-shadow: 0px 10px 105px -50px rgba(0,0,0,0.75);
        text-align: center;
        justify-content: center;
        align-items: center;
    }
    button:active {
        scale: 0.95;
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
    .half {
        width: 50%;
    }
    .margin {
        margin: 0.5em;
    }

    .scale {
        scale: 0.9;
    }
    .no-margin {
        margin: 0px;
    }


</style>