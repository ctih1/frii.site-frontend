<script lang="ts">
    interface Props {
        variant: "error" | "note",
        title: string,
        description: string
    }
    let { variant, title, description }: Props = $props();
</script>

<div class="alert h-24 mt-4 rounded-lg border-1 p-4">
    <h2 class="text-xl font-semibold">{title}</h2>
    <p>{description}</p>
</div>

<style>
    .alert {
        border-color: red;
        background-color: rgba(240,12,12, 0.2);
    }
</style>

