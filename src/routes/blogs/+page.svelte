<script lang="ts">
	import { error } from "@sveltejs/kit";
	import { onMount } from "svelte";
	import { m } from "../../paraglide/messages";
	import { serverURL } from "../../serverContactor";

	import Holder from "$lib/components/Holder.svelte";
	import Loader from "$lib/components/ui/loader/loader.svelte";
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
	<h1 class="text-4xl font-bold">{m.blogs_title()}</h1>
	<p>{m.blogs_description()}</p>

	{#if blogs.length === 0}
		<Loader className="w-12" />
	{/if}
	<ul>
		{#each blogs as blog}
			<li>
				<a class="text-lg" href={blog.url}
					>{blog.title} ({new Date(blog.date * 1000).toLocaleDateString()})</a>
			</li>
		{/each}
	</ul>
</Holder>

<style>
</style>
