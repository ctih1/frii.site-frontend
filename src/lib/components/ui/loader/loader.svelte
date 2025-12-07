<script lang="ts">
	let { asForeground = false, className }: { asForeground?: boolean; className?: string } =
		$props();
</script>

<div class={`dot-flashing-wrapper ${asForeground ? "fg" : ""} ${className}`}>
	<div class="dot-flashing"></div>
	<div class="dot-flashing"></div>
	<div class="dot-flashing"></div>
</div>

<style>
	.dot-flashing-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		height: 1.25rem;
	}

	.fg .dot-flashing {
		background-color: var(--color-secondary-foreground);
	}

	.dot-flashing {
		width: 8px;
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: var(--color-primary-foreground);
		animation: dot-flashing 0.6s infinite linear alternate;
	}

	.dot-flashing:nth-child(2) {
		animation-delay: 0.15s;
	}

	.dot-flashing:nth-child(3) {
		animation-delay: 0.3s;
	}

	@keyframes dot-flashing {
		0% {
			opacity: 0.2;
		}
		100% {
			opacity: 0.8;
		}
	}
</style>
