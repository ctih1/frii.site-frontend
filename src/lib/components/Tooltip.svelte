<script lang="ts">

</script>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<div class="tooltip"><span class="material-symbols-outlined">info</span>
    <span class="tooltiptext"><slot/></span>
</div> 

<style>
    .tooltip {
        position: relative;
        display: inline-block;
    }

    .tooltip .tooltiptext {
        visibility: hidden;
        min-width: 120px;
        max-width: 400px;
        width: fit-content;
        background-color: var(--background-color);
        text-align: center;
        padding: 0.5em;
        border-radius: 0.5em;
        position: absolute;
        z-index: 10;
        bottom: 75%;
        left: 50%;
        margin-left: -60px;
        opacity: 0;
        transition: opacity 200ms;
    }


    .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
    }
</style>