<script lang="ts">
	export let title: string;
	let toggled: boolean = false;
	function toggle() {
		toggled = !toggled;
	}
</script>

<div class="collapse">
	<div class="top">
		<p>{title}</p>
		<button
			on:click={() => {
				toggle();
			}}
			class="collapse-button"
			><span class="material-symbols-outlined"
				>{!toggled ? "keyboard_arrow_right" : "keyboard_arrow_down"}</span
			></button>
	</div>
	<div class="content">
		{#if toggled}
			<slot></slot>
		{/if}
	</div>
</div>

<style>
	.collapse {
		width: 100%;
	}
	.top {
		width: 100%;
		display: flex;
		flex-direction: row;
		height: fit-content;
	}
	.collapse-button {
		aspect-ratio: 1;
		background: none;
		border: none;
		margin-left: auto;
	}
	.collapse-button:hover {
		cursor: pointer;
	}
	.content {
		padding: 2%;
		padding-top: 0px;
	}
</style>
