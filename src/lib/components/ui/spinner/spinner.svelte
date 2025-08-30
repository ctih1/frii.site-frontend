<div class="spinner"></div>

<style>
	.spinner {
		border: 4px solid var(--color-secondary);
		border-top: 4px solid rgba(0,0,0,0);
		border-radius: 50%;
		aspect-ratio: 1;
		width: 2rem;
		animation: spin 1s linear infinite forwards;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
        to {
            transform: rotate(360deg);
        }
	}
</style>
