<script lang="ts">
	import MaterialSymbolsCloseSmallRounded from "~icons/material-symbols/close-small-rounded";
	import MaterialSymbolsExclamationRounded from "~icons/material-symbols/exclamation-rounded";
	import MaterialSymbolsWarningOutlineRounded from "~icons/material-symbols/warning-outline-rounded";
	interface Props {
		variant: "error" | "note";
		title: string;
		description: string;
	}
	let { variant, title, description }: Props = $props();
	let closed: boolean = $state(true);

	$effect(() => {
		if (title && description) {
			closed = false;
		}
	});
</script>

{#if !closed}
	<div
		class={`alert mt-4 h-24 rounded-lg border-2 p-4 ${variant === "error" ? "bg-alert" : "bg-note"}`}>
		<div class="flex justify-between">
			<div class="text flex items-center">
				{#if variant === "error"}
					<MaterialSymbolsWarningOutlineRounded class="mr-2" />
				{:else}
					<MaterialSymbolsExclamationRounded class="mr-2" />
				{/if}
				<h2 class="text-xl font-semibold">{title}</h2>
			</div>
			<div>
				<a onclick={_ => (closed = true)} href="##"><MaterialSymbolsCloseSmallRounded /></a>
			</div>
		</div>

		<p>{description}</p>
	</div>
{/if}
