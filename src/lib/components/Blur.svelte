<script lang="ts">
    let blur:HTMLDivElement;
    function delay(time:number) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    export async function hide() {
        for(let i=100;i>0;i--) {
            blur.style.width = "0vw";
            await delay(5);
            blur.style.backdropFilter = `blur(${i/10}px)`;
        }
    }
    export async function show() {
        for(let i=0;i<100;i++) {
            await delay(10);
            blur.style.width = "100vw";
            blur.style.backdropFilter = `blur(${i/10}px)`;
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
    }
</style>