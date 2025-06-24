<style>
	.tooltip {
		position: relative;
		display: inline-block;
	}

	.tooltip .tooltiptext {
		visibility: hidden;
		min-width: 140px;
		max-width: 400px;
		width: fit-content;
		background-color: var(--background-color);
		text-align: center;
		padding: 0.5em;
		border-radius: 0.5em;
		position: absolute;
		z-index: 10;
		bottom: 75%;
		left: 50%;
		margin-left: -60px;
		opacity: 0;
		transition: opacity 200ms;
	}

	.tooltip:hover .tooltiptext {
		visibility: visible;
		opacity: 1;
	}
</style>

<script lang="ts">
</script>

<div role="tooltip" class="tooltip">
	<span class="material-symbols-outlined">info</span>
	<span class="tooltiptext"><slot /></span>
</div>
