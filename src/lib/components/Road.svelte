<script lang="ts">
    export let points:Array<string>;
    let margin:number=10;
    let buttonHeight:number;
    let compartmentWidth:number;
    export let completed;
    let pointsDiv:HTMLDivElement;
    let offset:number=0;
    export let color: string;
    $:if(pointsDiv) {
        offset = pointsDiv.getBoundingClientRect().x;
    }
    
</script>

<div class="points" bind:this={pointsDiv}>
    {#if completed>0}
        <div style="transform: translateY({buttonHeight/2}px); left: {(compartmentWidth/2)+offset}px; width:{compartmentWidth*(completed-1)}px;" class="line"></div>
        {#if completed<points.length}
            <div style="transform: translateY({buttonHeight/2}px); left: {((compartmentWidth*completed)-compartmentWidth/2)+offset}px; width:{compartmentWidth}px;" class="line progress-line"></div>
        {/if}
    {/if}
    {#each points as point, index}
        <div bind:clientWidth={compartmentWidth} class="point">
                <div bind:clientHeight={buttonHeight} style="width: {(100/points.length)-margin+8}vw; transform: translateX({(compartmentWidth/2)-buttonHeight/2}px) scale(1.2); background-color: {color};" class="ball ball-clone"></div>
                <div bind:clientHeight={buttonHeight} style="width: {(100/points.length)-margin}vw;" class="ball {(index<completed)?("checked"):("")}"></div>
            <p>{point}</p>
        </div>
    {/each}
</div>
 
<style>
    .points {
        display: flex;
        width: 100%;
        justify-content: space-evenly;
    }
    .point {
        flex-basis: 100%;
        align-items: center;
        text-align: center;
    }
    .ball {
        max-width: 10vh;
        aspect-ratio: 1;
        border-radius: 100%;
        background-color: var(--background-color);
        margin-left: auto;
        margin-right: auto;
        opacity: 1;
    }
    .ball-clone {
        position: absolute;
        top: 0px;
        left: 0px;
        background-color: inherit;
    }
    .checked {
        background-color: var(--primary);
    }
    .line {
        transition: width 0.3s;
        position: absolute;
        height: 3px;
        background-color: black;
        opacity: 0.5;
    }
    .progress-line {
        opacity: 0.1;
    }   
</style>