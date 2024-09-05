<script lang="ts">
    export let args:string="";
</script>

<div class="card {args}"><slot/></div>

<style>
    .card {
        width: 50vw;
        margin-left: auto;
        margin-right: auto;
        background-color: grey;
        padding: 2em;
        margin-top: 2em;
    }
    .fill.card{
        width: 90vw;
    }
    @media(max-width: 960px) {
        .card {
            width: 80vw;
        }
    }
    @media(orientation:portrait) {
        .card {
            width: 80vw;
        }
    }
</style>
