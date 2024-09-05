<script lang="ts">
    import { createEventDispatcher } from "svelte";
    let checked:boolean;
    export let initial:boolean;
    checked = initial
    const dispatch = createEventDispatcher();

    function change() {
        dispatch("change",!checked);
    } 

</script>

<label class="switch">
    <input on:change={change} bind:checked={checked} type="checkbox">
    <span class="slider round"></span>
</label>

<style>
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: 200ms;
        transition: 200ms
    }

    input:checked + .slider {
        background-color: var(--primary);
    }

    input:focus + .slider {
        box-shadow: 0 0 1px var(--primary);
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }

    .slider.round {
    }

    .slider.round:before {
    } 
</style>
