<script lang="ts">
	let { children } = $props();
</script>

<div class="card bg-card mt-8 mr-auto ml-auto w-11/12 max-w-4xl rounded-xl p-4">
	{@render children()}
</div>
