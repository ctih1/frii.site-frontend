<script lang="ts">
	export let args: string = "";
</script>

<div class="card {args}"><slot /></div>

<style>
	.card {
		z-index: -2;
		width: 50vw;
		margin-left: auto;
		margin-right: auto;
		background-color: rgb(40, 40, 40);
		border-radius: 0.5em;
		padding: 2em;
		margin-top: 2em;
	}
	.fill.card {
		width: 90vw;
	}

	@media (max-width: 1200px) {
		.card {
			width: 60vw;
		}
	}
	@media (orientation: portrait), (max-width: 960px) {
		.card {
			width: 90vw;
			padding: 12px;
		}
	}
</style>
