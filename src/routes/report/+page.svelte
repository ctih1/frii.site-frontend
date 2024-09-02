<script lang="ts">
    import Holder from "$lib/components/Holder.svelte";
</script>

<Holder>
    <h1>What do you want to report?</h1>
    <div class="options">
        <a href="/report/security">Security vulnerability</a>
        <a href="https://github.com/ctih1/frii.site-frontend/issues/new">A bug</a>
        <a href="https://forms.gle/Ct7fLpkMHSk2zqJdA">Abuse</a>
    </div>

</Holder>

<style>
    .options {
        display: flex;
        flex-direction: column;
    }
    .options * {
        margin-top: 1em;
    }
</style>
