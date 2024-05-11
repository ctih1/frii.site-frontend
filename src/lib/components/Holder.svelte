<script lang="ts">
    
</script>

<div class="card"><slot/></div>

<style>
    .card {
        width: 50vw;
        margin-left: auto;
        margin-right: auto;
        background-color: white;
        border-radius: 0.5em;
        padding: 2em;
        margin-top: 2em;
    }
    @media(max-width: 960px) {
        .card {
            width: 80vw;
        }
    }
</style>