<script lang="ts">
    import { onMount } from "svelte";
    import Button from "./Button.svelte";
    export let countdown:number|undefined;
    export let description:string;
    export let title:string;
    let button:Button;
    let timeLeft:number;
    let onscreen:boolean=false;
    let timer:any;
    export function open(text:string,desc:string) {
        title=text;
        description = desc;
        onscreen=true;
        startTimer();
    }
    export function close() {
        if(countdown!==undefined) {
            timeLeft = countdown;
        }
        onscreen=false;
    }

    onMount(()=>{
        button?.disable()
        startTimer()
    });

    function startTimer() {
        if(timer!==undefined) {
            clearInterval(timer);
        }
        if(countdown!==undefined) {
            button?.disable()
            timeLeft = countdown;
            timer = setInterval(timerFunction,1000);
            function timerFunction() {

                if(onscreen) {
                    button?.disable()
                    timeLeft-=1;
                }
                if(timeLeft<=0) {
                    clearInterval(timer);
                    button.enable();
                }
            }
        }
    }

</script>

{#if onscreen}
    <div class="background">
        <div class="prompt">
            <h1>{title}</h1>
            <p>{description}</p>
            {#if countdown!==undefined}
                <h3>{timeLeft}</h3>
            {/if}
            <div class="buttons">
                <Button bind:this={button} args={"danger fill margin quarter"}>Continue</Button>
                <Button on:click={()=>{close()}} args={"fill margin three-quarter"}>Cancel</Button>
            </div>
        </div>
    </div>
{/if}

<style>
    .background {
        backdrop-filter:blur(4px);
        position:fixed;
        display: flex;
        align-items: center;
        top:0px;
        left:0px;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,0.75);
        z-index: 15;
        overflow: hidden;
    }
    .prompt {
        padding: 2em;
        width: 50vw;
        border-radius: 0.5em;
        background-color: white;
        margin-left: auto;
        margin-right: auto;
    }
    .buttons {
        margin-top: auto;
        margin-bottom: 0px;
        display: flex;
        flex-direction: row;
        height: 5vh;
    }


</style>