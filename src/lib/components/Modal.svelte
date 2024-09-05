<script lang="ts">
	import { resendEmail } from './../../serverContactor';
    import { onMount } from "svelte";
    import Button from "./Button.svelte";
    import {t} from "$lib/translations";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let countdown:number|undefined=undefined;
    export let description:string;
    export let title:string;
    export let options:Array<string>;
    export let overrideDefault:boolean=false;
    let button:Button;
    let _isLogin:boolean=false;
    let _html:string|undefined=undefined;
    let timeLeft:number;
    let onscreen:boolean=false;
    let timer:any;

    export function open(text:string,desc:string,time:number|undefined=undefined, buttons:Array<string>|undefined=undefined, isLogin:boolean=false) {
        _isLogin=isLogin;
        title=text;
        description = desc;
        onscreen=true;
        startTimer();
        if(buttons) {
            options = buttons;
        } else {
            options = [$t("common.continue_modal")];
        }
        if(time!==undefined) {
            countdown=time;
            startTimer();
        } else {
            countdown=undefined;
        }
    }
    function primaryButton() {
        if(overrideDefault) {
            dispatch("primary");
        }
        else {
            close();
        }
    }
    export function close() {
        if(countdown!==undefined) {
            timeLeft = countdown;
        }
        onscreen=false;
    }
    export function secondaryButton() {
        dispatch("secondary");
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
                    button?.enable();
                }
            }
        }
    }

</script>

{#if onscreen}
    <div class="background">
        <div class="prompt">
            <h1>{title}</h1>
            <p>{@html description}</p>
            {#if countdown!==undefined}
                <h3>{timeLeft}</h3>
            {/if}
            <div class="html">
                {#if _isLogin}
                    <a class="msx" on:click={()=>{resendEmail(localStorage.getItem("verif-token")).then(response=>{console.log("Resend code status:"+ response.status.toString())})}}>Resend verification code</a>
                {/if}
            </div>
            <div class="buttons">
                {#if options.length!==1}
                    <Button on:click={()=>secondaryButton()} bind:this={button} args={"danger fill margin quarter"} startDisabled={countdown!==undefined}>{options[1]}</Button>
                {/if}
                <Button on:click={()=>{primaryButton()}} args={"fill margin three-quarter"}>{options[0]}</Button>
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
    .html {
        margin-top: 0px;
    }
    .html * {
        margin-top: 0.2em;
    }
    .prompt {
        padding: 2em;
        width: 50vw;
        background-color: grey;
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

    .msx:hover{
        cursor:pointer;
    }


</style>
