<script lang="ts">
    let blur:HTMLDivElement;
    export let reverse:boolean=false;
    export let startingPoint:number=50;
    function delay(time:number) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    export async function hide() {
        for(let i=100;i>0;i--) {
            blur.style.width = "0vw";
            await delay(5);
            blur.style.animation = "";
            blur.style.backdropFilter = `blur(${i/10}px)`;
            blur.style["-webkit-backdrop-filter"]=`blur(${i/10}px)`;

        }
    }
    export async function show() {
        if(blur===undefined) { return; }
        if(!reverse) {
            for(let i=0;i<100;i++) {
                await delay(10);
                blur.style.width = "100vw";
                blur.style.animation = "";
                blur.style.backdropFilter = `blur(${i/10}px)`;
                blur.style["-webkit-backdrop-filter"]=`blur(${i/10}px)`;
            }
        } else {
            for(let i=100; i>startingPoint;i--) {
                await delay(10);
                blur.style.width = "100vw";
                blur.style.animation = "";
                blur.style.backdropFilter = `blur(${i/10}px)`;
                blur.style["-webkit-backdrop-filter"]=`blur(${i/10}px)`;
            }
        }

    }
</script>

<div bind:this={blur} class="blur"></div>

<style>
    .blur {
        position: absolute;
        top:0px;
        left:0px;
        height: 100vh;
        width: 0vw;
        z-index: 9;
        color: rgb(146, 195, 119);
    }
    @keyframes pulse {
        0% {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
        50% {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
        }
        100% {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
    }
</style>
