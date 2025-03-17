<script lang="ts">
    import Spinner from "./Spinner.svelte";
     import { t } from '$lib/translations';
    let progress: HTMLElement;
    let visible = false;
    let _title: string = "";
    let _description: string = "";

    export function show(title: string = $t("loading"), description: string = $t("loader_description")) {
        visible = true;
        _title = title;
        _description = description;
        progress?.offsetHeight; // resets animation (aka puts the width to 0%) might be undefined if its the first time loading, since its defined in an #if statement
    }

    export function hide() {
      visible = false;
    }
</script>

{#if visible}
  <div class="wrapper"></div> <!-- So svelte doesn't disregard class open styles for not being used -->
    <div class="modal-wrapper open">
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
{/if}

<style>
    .wrapper {
        position: fixed;
        top: 0px;
        left:0px;
        width:100%;
        height:100%;
        min-width: 100vw;
        background-color: rgba(0,0,0);
        opacity: 0.5;
        z-index: 15;
        min-height:100vh;
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
        background-color: rgb(40, 40, 40);
        height: fit-content;
        width: 100%;
        border-radius: 0.5em;
        padding: 1em;
    }

    .open {
        animation: open 0.2s ease-in;
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

    @keyframes open {
        from {
            transform: scale(0);
        } to {
            transform: scale(1);
        }
    }

    @media(max-width: 960px) {
        .modal-wrapper {
            margin-left: calc(80vw / 2 * -1);
            margin-top: calc(80vw / 2 * -1);
            width: 80vw;
        }
    }
    @media(orientation:portrait) {
        .modal-wrapper {
            margin-left: calc(80vw / 2 * -1);
            margin-top: calc(80vw / 2 * -1);
            width: 80vw;
        }
    }
</style>
