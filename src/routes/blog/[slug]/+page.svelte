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
	.material-symbols-outlined {
		margin-right: 10px;
	}

	.md :global(em) {
		background-color: var(--offwhite-color);
	}
	.md :global(code) {
		background-color: var(--offwhite-color);
		font-family: "Fira Code", monospace;
		font-weight: 500;
	}
</style>

<script lang="ts">
	import Markdown from "@magidoc/plugin-svelte-marked"

	import Holder from "$lib/components/Holder.svelte"
	interface article {
		date: number
		title: string
		body: string
	}
	export let data: article
	let source = data.body
	const time = new Date(0)
	time.setSeconds(data.date)

	function calculateReadTime(): string {
		let guess1 = Math.round(data.body.length / 500)
		let guess2 = Math.round(data.body.length / 1000)

		if (guess2 === guess1) {
			return `~ ${guess1} minute read`
		} else {
			return `~ ${guess2} to ${guess1} minute read`
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

<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<Holder>
	<h1>{data.title}</h1>
	<div class="data">
		<p style="opacity: 0.5;">
			<span class="material-symbols-outlined">edit_calendar</span>
			{time}
		</p>
		<p><span class="material-symbols-outlined">schedule</span>{calculateReadTime()}</p>
	</div>
	<hr style="opacity: 0.1" />
	<div class="md">
		<Markdown source={source} />
	</div>
</Holder>
