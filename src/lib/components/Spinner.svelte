<div class="spinner"></div>

<style>
    .spinner {
        border: 0.5em solid var(--secondary-color);
        border-top: 0.5em solid var(--primary);
        border-radius: 50%;
        aspect-ratio: 1;
        width: 50px;
        animation: spin 1.5s linear infinite forwards;
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        45% {
            transform: rotate(360deg);
        }
        80% {
            transform: rotate(900deg);
        }
        100% {
            transform: rotate(1080deg);
        }
    }
</style>
