<script lang="ts">
	import { browser } from "$app/environment";
	let balls = $state(randomLocations());

	function randomLocations() {
		return Array.from({ length: 20 }, () => ({
			x: Math.round(Math.random() * 100) + "%",
			y: Math.round(Math.random() * 100) + "%"
		}));
	}
	balls = randomLocations();

	if (browser && localStorage.getItem("toaster-mode") != "true") {
		setTimeout(() => (balls = randomLocations()), 100);
		setInterval(() => (balls = randomLocations()), 15000);
	}
</script>

<div class="balls">
	<div class="circles">
		{#each balls as { x, y }}
			<div
				class="bubble"
				style="width: {Math.max(Math.random(), 0.3) * 25}vw; opacity: {Math.random() *
					0.1}; top:{y}; left:{x};">
			</div>
		{/each}
	</div>
	<div class="main">
		<slot></slot>
	</div>
</div>

<style>
	.bubble {
		transition: all 15s linear;
		aspect-ratio: 1;
		position: absolute;
		width: 100%;
		background-color: var(--primary);
		border-radius: 100%;
		opacity: 0.02;
		z-index: 0;
	}
	.circles {
		pointer-events: none;
		position: absolute;
		top: 0px;
		left: 0px;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.balls {
		min-height: 100vh;
		width: 100vw;
		height: 100%;
	}
</style>
