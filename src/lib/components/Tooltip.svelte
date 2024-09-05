<script lang="ts">

</script>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<div role="tooltip" class="tooltip"><span class="material-symbols-outlined">info</span>
    <span class="tooltiptext"><slot/></span>
</div> 

<style>
    .tooltip {
        position: relative;
        display: inline-block;
    }

    .tooltip .tooltiptext {
        visibility: hidden;
        min-width: 140px;
        max-width: 400px;
        width: fit-content;
        background-color: black;
        text-align: center;
        padding: 0.5em;
        position: absolute;
        z-index: 10;
        bottom: 75%;
        left: 50%;
        margin-left: -60px;
        opacity: 50;
        transition: opacity 200ms;
    }


    .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
    }
</style>
