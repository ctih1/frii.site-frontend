<script lang="ts">
	export let descrption: string;
	export let author: string;
	export let stars: number;
	export let index: number; // how many nth is the card? meant for rotation

	function calculateRotation(): number {
		return (index + 1) * 3 * (index % 2 ? -1 : 1); // aw man
	}
</script>

<div style={`transform: rotate(${calculateRotation()}deg)`} class="wrapper">
	<h1>{author}</h1>
	<p class="description"><i>{descrption}</i></p>
	<div class="stars">
		{#each Array(5) as _, index}
			<span class={`material-symbols-outlined ${index < stars ? "starred" : "not-active"} `}
				>star</span>
		{/each}
	</div>
</div>

<style>
	.description::before {
		content: "“";
	}
	.description::after {
		content: "”";
	}
	.starred {
		color: rgb(255, 220, 20);
		background-clip: text;
		background-color: yellow;
	}
	.stars {
		width: fit-content;
	}
	.stars:hover {
		background-color: rgba(255, 220, 20, 0.1);
		border-radius: 0.5em;
	}
	.not-active {
		color: var(--secondary-color);
	}
	.wrapper {
		transition: all 0.3s;
		box-shadow: 1px 6px 20px rgba(0, 0, 0, 0.2);
		background-color: var(--offwhite-color);
		width: fit-content;
		padding: 1em;
		max-width: 20em;
		border-radius: 0.5em;
	}
	.wrapper:hover {
		transform: rotate(0deg) !important;
		box-shadow: 1px 6px 20px rgba(0, 0, 0, 0.4);
	}

	@media (orientation: portrait) {
		.wrapper {
			transform: rotate(0deg) !important;
			max-width: none;
			margin-left: auto;
			margin-right: auto;
			margin-top: 0.25em;
			margin-bottom: 0.5em;
			width: 90%;
		}
	}
</style>
