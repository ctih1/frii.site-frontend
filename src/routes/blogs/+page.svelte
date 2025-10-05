<script lang="ts">
	import { error } from "@sveltejs/kit";
	import { onMount } from "svelte";
	import { m } from "../../paraglide/messages";
	import { serverURL } from "../../serverContactor";

	import Holder from "$lib/components/Holder.svelte";
	interface Iblog {
		url: string;
		date: number;
		body: string;
		title: string;
	}

	let blogs: Iblog[] = [];

	onMount(() => {
		async function getBlogs() {
			await fetch(`${serverURL}/blog/get/all?content=32&n=50`).then(response => {
				if (response.status !== 200) {
					error(500, {
						message: "Failed to retrieve blogs"
					});
				}
				response.json().then(data => {
					blogs = data as Iblog[];
				});
			});
		}
		getBlogs();
	});
</script>

<Holder>
	<h1>{m.blogs_title()}</h1>
	<p>{m.blogs_description()}</p>

	{#each blogs as blog}
		<a href={blog.url}>{blog.title} ({new Date(blog.date / 1000)})</a>
	{/each}
</Holder>

<style>
</style>
