<script lang="ts">
	import Holder from "$lib/components/Holder.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import Markdown from "@magidoc/plugin-svelte-marked";
	import MaterialSymbolsEditCalendar from "~icons/material-symbols/edit-calendar";
	import MaterialSymbolsScheduleOutline from "~icons/material-symbols/schedule-outline";
	interface article {
		date: number;
		title: string;
		body: string;
	}
	export let data: article;
	let source = data.body;
	const time = new Date(0);
	time.setSeconds(data.date);

	function calculateReadTime(): string {
		let guess1 = Math.round(data.body.length / 500);
		let guess2 = Math.round(data.body.length / 1000);

		if (guess2 === guess1) {
			return `~ ${guess1} minute read`;
		} else {
			return `~ ${guess2} to ${guess1} minute read`;
		}
	}
</script>

<svelte:head>
	<title>{`${data.title} - frii.site`}</title>
	<meta content={`${data.title} - frii.site`} name="title" />
	<meta content={`${data.title} - frii.site`} name="og:title" />
	<meta content={`${data.body.substring(0, 32)}...`} name="og:description" />
	<meta content={`${data.body.substring(0, 32)}...`} name="description" />
</svelte:head>

<Holder>
	<h1 class="text-4xl font-bold">{data.title}</h1>
	<Separator />
	<div class="data mt-2">
		<p style="opacity: 0.5;">
			<MaterialSymbolsEditCalendar class="mr-2" />
			{time}
		</p>
		<p><MaterialSymbolsScheduleOutline class="mr-2" />{calculateReadTime()}</p>
	</div>
	<Separator class="mt-2 mb-4" />
	<div class="md">
		<Markdown source={source} />
	</div>
</Holder>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap");
	p {
		display: flex;
		align-items: center;
	}
	.data * {
		margin-bottom: 0px;
		margin-top: 0px;
	}
	.md :global(em) {
		background-color: var(--offwhite-color);
	}
	.md :global(code) {
		background-color: var(--offwhite-color);
		font-family: "Fira Code", monospace;
		font-weight: 500;
	}

	.md :global(h1) {
		font-size: 24px;
		font-weight: bold;
	}

	.md :global(h2) {
		font-size: 18px;
		font-weight: bold;
	}

	.md :global(h3) {
		font-size: 16px;
		font-weight: 600;
	}

	.md :global(p:has(em)) {
		padding-left: 1em;
		opacity: 0.9;
	}

	.md :global(thead) {
		background-color: var(--background);
	}

	.md :global(thead tr th) {
		padding-left: 4px;
		padding-right: 4px;
	}
	.md :global(td) {
		padding-left: 4px;
		padding-right: 4px;
	}
</style>
