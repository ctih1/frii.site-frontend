<script lang="ts">
	//@ts-ignore
	import BlogCard from "$lib/components/BlogCard.svelte";
	import BubbleBackground from "$lib/components/BubbleBackground.svelte";
	import Button from "$lib/components/Button.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Review from "$lib/components/Review.svelte";
	import { m } from "../paraglide/messages.js";
	import { localizeHref } from "../paraglide/runtime.js";

	let { data } = $props();

	let blogsShouldBeShown: boolean = $state(data.shouldBeShown);
	let blogs: Iblog[] = $state(data.blogs);

	interface Ireview {
		author: string;
		description: string;
		stars: number;
	}

	interface Iblog {
		url: string;
		date: number;
		body: string;
		title: string;
	}

	let reviews: Ireview[] = [
		{
			author: "Rage65",
			description:
				"I have been using (frii.site) to get a domain for my website for a while now and it's been great!",
			stars: 5
		},
		{
			author: "Luka Rantalainen",
			description: "frii.site has served me well for my domain registraation needs.",
			stars: 4
		},
		{
			author: "Planethac",
			description: "Good service for a good price!",
			stars: 4
		}
	];

	$effect(() => {
		console.log(data);
	});
</script>

<svelte:head>
	<title>frii.site - Register subdomains for free!</title>
</svelte:head>

<BubbleBackground>
	<div class="head">
		<h1 class="title" style="font-size: 10em">frii.site</h1>
		<p class="tagline">{m.index_tagline()}</p>
		<div class="buttons">
			<Button on:click={() => (window.location.href = "/account")} args="padding fill margin"
				><p class="button-text">{m.index_register_account()}</p></Button>
			<Button
				on:click={() => (window.location.href = "/dashboard")}
				args="padding fill margin secondary"
				><p class="button-text">{m.index_goto_dashboard()}</p></Button>
		</div>
	</div>
	<div class="introduction-wrapper">
		<div class="center">
			<h1 style="font-size: 5em; margin-bottom: 0px;">
				<strong>{m.index_aboutus()}</strong>
			</h1>
			<hr style="width: 50%;opacity: 0.1; height: 4px;" />
			<p class="description" style="margin-top: 10px;">
				{@html m.index_aboutus_description()}
			</p>
		</div>
		<div class="left">
			<h2>
				<span class="material-symbols-outlined">lock_open_right</span>{m.index_tp_freedom()}
			</h2>
			<p>{m.index_tp_freedom_desc()}</p>
		</div>
		<div class="right">
			<h2><span class="material-symbols-outlined">lock</span>{m.index_tp_security()}</h2>
			<p>{m.index_tp_security_desc()}</p>
		</div>
		<div class="bottom-left">
			<h2><span class="material-symbols-outlined">support</span>{m.index_tp_support()}</h2>
			<p>{m.index_tp_support_desc()}</p>
		</div>
		<div class="bottom-right">
			<h2>
				<span class="material-symbols-outlined">encrypted</span>{m.index_tp_privacy()}
			</h2>
			<p>{m.index_tp_privacy_desc()}</p>
		</div>
	</div>
	<div class="reviews">
		<h1 style="font-size: 3em;">{m.index_reviews()}</h1>
		<div class="review-cards">
			{#each reviews as review, index}
				<Review
					descrption={review.description}
					author={review.author}
					stars={review.stars}
					index={index} />
			{/each}
		</div>
	</div>
	{#if blogsShouldBeShown}
		<div class="blogs">
			<h3 style="font-size: 3em; width: fit-content; margin-left: auto; margin-right: auto;">
				Latest updates
			</h3>
			<div class="latest-releases">
				{#each blogs as blog}
					<BlogCard
						title={blog.title}
						description={blog.body}
						date={blog.date}
						url={blog.url} />
				{/each}
			</div>
		</div>
	{/if}
	<div class="bottom-hooker">
		<h1>{m.index_bottom_hook()}</h1>
		<p>{m.index_bottom_hook_desc()}</p>
		<div class="button-hook">
			<Button
				on:click={() => (window.location.href = localizeHref("/account"))}
				args="padding fill margin"
				><p class="button-text">{m.index_register_account()}</p></Button>
		</div>
	</div>
	<Footer />
</BubbleBackground>

<style>
	.head {
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		height: 100vh;
	}

	.title {
		margin-bottom: 0px;
	}
	.tagline {
		padding: 0px 2em 1em 2em;
		margin: 0px;
		font-size: 25px;
	}

	.buttons {
		display: flex;
		justify-content: space-evenly;
		width: 50%;
		height: 3em;
		margin-left: auto;
		margin-right: auto;
	}

	.button-text {
		font-size: 1.5em;
	}

	.introduction-wrapper {
		display: grid;
		min-width: 100vw;
		min-height: 100vh;
		grid-template-rows: repeat(3, 1fr);
		grid-template-columns: repeat(3, 1fr);
		margin-top: 2em;
	}
	.introduction-wrapper div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1em;
		text-align: center;
	}
	.introduction-wrapper div h2 {
		display: flex;
		align-items: center;
		font-size: 3em;
		margin-bottom: 0px;
	}
	.introduction-wrapper div * {
		-webkit-hyphens: auto;
		-moz-hyphens: auto;
		-ms-hyphens: auto;
		hyphens: auto;
		word-break: break-all;
	}
	.introduction-wrapper div h2 span {
		color: var(--primary);
		font-size: 1em;
	}
	.center {
		grid-area: 2 / 2 / 3 / 3;
		text-align: center;
		min-width: fit-content;
		grid-column: 1 / 4;
		background-color: initial !important;
	}
	.description {
		max-width: 80ch;
	}
	.left {
		grid-area: 1 / 1 / 2 / 2;
	}
	.bottom-left {
		grid-area: 3 / 1 / 4 / 2;
	}
	.bottom-right {
		grid-area: 3 / 3 / 4 / 4;
	}
	.right {
		grid-area: 1 / 3 / 2 / 4;
	}

	.blogs {
		margin-top: 25vh;
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.latest-releases {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(1, 1fr);
		margin-bottom: 25vh;
		gap: 20px;
		padding: 2em;
	}

	.reviews {
		margin-top: 25vh;
		height: fit-content;
		margin-bottom: 50vh;
	}

	.reviews h1 {
		text-align: center;
	}

	.review-cards {
		display: flex;
		justify-content: space-evenly;
		width: 100vw;
	}

	.bottom-hooker {
		width: 100vw;
		text-align: center;
		margin-bottom: 75vh;
	}
	.bottom-hooker * {
		margin: 10px;
	}
	.bottom-hooker h1 {
		font-size: 5em;
	}
	.bottom-hooker p {
		font-size: 1.75em;
	}

	.button-hook {
		width: 75%;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}

	@media (orientation: portrait) {
		.introduction-wrapper {
			display: flex !important;
			flex-direction: column;
		}
		.introduction-wrapper div {
			margin: 2em;
		}
		.buttons {
			width: 90vw;
		}
		.latest-releases {
			display: flex;
			flex-direction: column;
		}
		.review-cards {
			margin-left: auto;
			margin-right: auto;
			padding: 0px;
			flex-direction: column;
			justify-content: center;
			width: 100vw;
		}
		.bottom-hooker h1 {
			font-size: 3em;
		}
		.bottom-hooker p {
			font-size: 1.5em;
		}
		.title {
			font-size: 6em !important;
		}
	}

	@keyframes textChange {
		from {
			transform: translateX(0px);
			opcaity: 1;
		}
		to {
			transform: translateX(100px);
			opacity: 0;
		}
	}
</style>
