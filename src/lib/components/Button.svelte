<script lang="ts">
    export let args:string;
</script>

<button class="{args}">
    <slot></slot>
</button>

<style>
    button {
        transition: scale 50ms;
        background-color: rgb(0, 123, 255);
        border-radius: 0.5em;
        border-style: none;
        color: white;
        -webkit-box-shadow: 0px 10px 105px -50px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 10px 105px -50px rgba(0,0,0,0.75);
        box-shadow: 0px 10px 105px -50px rgba(0,0,0,0.75);
    }
    button:active {
        scale: 0.95;
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
    .no-margin {
        margin: 0px;
    }
</style>