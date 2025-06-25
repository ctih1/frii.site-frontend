<script lang="ts">
	import { serverURL } from "../../serverContactor"
	import { t } from "$lib/translations"
	import Placeholder from "./Placeholder.svelte"
	import Markdown from "@magidoc/plugin-svelte-marked"

	export let title: string
	export let description: string
	export let date: number
	export let url: string
	export let inline: boolean = false
</script>

<div class={`wrapper ${!inline ? "border-shown" : "border-hidden"}`}>
	<h1>{title}</h1>
	<p>{new Date(date * 1000).toLocaleDateString()}</p>
	<div class="blogcard-body">
		<Markdown source={`${description}...`} />
	</div>
	<a href={`/blog/${url}`}>{$t("blog_read")}</a>
</div>

<style>
	:global(.blogcard-body *) {
		font-size: 1em;
	}
	.wrapper {
		border: 2px solid var(--offwhite-color);
		background-color: var(--offwhite-color);
		border-radius: 0.5em;
		padding: 1em;
		z-index: 15;
		border-left: 10px solid var(--primary);
	}
	.border-hidden {
		border: 0px !important;
		box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
		margin: 20px;
		background-color: var(--offwhite-color);
	}
</style>
