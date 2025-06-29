<script lang="ts">
    import MaterialSymbolsCloseSmallRounded from '~icons/material-symbols/close-small-rounded';
    import MaterialSymbolsWarningOutlineRounded from '~icons/material-symbols/warning-outline-rounded';

    interface Props {
        variant: "error" | "note",
        title: string,
        description: string
    }
    let { variant, title, description }: Props = $props();
    let closed: boolean = $state(true);

    $effect(() => {
        if(title && description) {
            closed = false;
        }
    })
</script>

{#if !closed}
<div class={`alert h-24 mt-4 rounded-lg border-2 p-4 ${variant==="error" ? "bg-alert" : ""}`}>
    <div class="flex justify-between">
        <div class="text items-center flex">
            {#if variant === "error"}
            <MaterialSymbolsWarningOutlineRounded class="mr-2"/>
            {/if}
            <h2 class="text-xl font-semibold">{title}</h2>
        </div>
        <div>
            <a onclick={_ => closed=true} href="##"><MaterialSymbolsCloseSmallRounded /></a>
        </div>

    </div>

    <p>{description}</p>
</div>
{/if}