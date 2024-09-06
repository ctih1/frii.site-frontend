<script lang="ts">
    import Spinner from "./Spinner.svelte";
    let progress: HTMLElement;
    let visible = true;
    let _title: string = "";
    let _description: string = "";

    export function show(title: string, description: string) {
        _title = title;
        _description = description;
        visible = true;
        
    }

    export function hide() {
        visible = false;
    }
</script>

{#if visible}
<div class="full-screen-overlay">
    <div class="modal-wrapper">
        <div class="modal">
            <h1>{_title}</h1>
            <p>{_description}</p>
            <div class="spinner-container">
                <Spinner />
            </div>
            <div class="bar-container">
                <div class="bar" bind:this={progress}></div>
            </div>
        </div>
    </div>
</div>
{/if}

<style>
    .full-screen-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10; 
    }
    .modal-wrapper {
        position: fixed;
        z-index: 50;
        display: flex;
        justify-content: center;
        width: 30vw;
        height: fit-content;
        min-height: 250px;
        margin: 0 auto;
        margin-left: calc(30vw / 2 * -1);
        margin-top: calc(30vh / 2 * -1);
        left: 50%;
        top: 50%;
    }
    .modal {
        background-color: #fff;
        height: fit-content;
        width: 100%;
        border-radius: 0.5em;
        padding: 1em;
    }

    .spinner-container {
        margin-left: auto;
        margin-right: auto;
        width: fit-content;
        margin-bottom: 1em;
    }
    .bar {
        animation: progress 4s cubic-bezier(0.31, 0.72, 0.64, 1);
        background-color: var(--primary);
        height: 0.5em;
        border-radius: 0.5em;
    }

    @keyframes progress {
        from {
            width: 0%;
        }
        to {
            width: 100%;
        }
    }
</style>