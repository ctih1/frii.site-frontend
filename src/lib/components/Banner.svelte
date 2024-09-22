<script lang="ts">
    import { get } from "svelte/store"
    import { getStatus } from "../../serverContactor";
    import { warnCheck } from "../../routes/stores";
    let height:number;
    let loaded:boolean=false;
    let danger:boolean=false;
    let message:string;
    if(Number(get(warnCheck)) < Date.now()) {
        getStatus().then(response=> {
            if(response.status===204) {
                danger=false;
                loaded=true;
            } else if(response.status!==404) {
                response.text().then(data=>{
                    console.log(data);
                    danger=true;
                    message=data;
                    loaded=true;
                })
            }
        });
        warnCheck.set(Date.now().toString());
        loaded=true;
    } else {
        message = localStorage.getItem("notification-message") as string;
        loaded=true;
    }
    let hidden:boolean=(localStorage.getItem("notification-hidden")??false) as boolean;
</script>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
{#if loaded && danger}
    <div bind:clientHeight={height} class="bar">
        <span style="margin-left: 1em;" class="material-symbols-outlined">warning</span>
        <p>{message}</p>
    </div>
    <div style="height: {height}px" class="pusher"></div>
{/if}
<style>
    .bar {
        position: absolute;
        display: flex;
        align-items: center;
        background-color: var(--primary);
        min-width: 100vw;
        width: 100%;
        top: 0px;
        left: 0px;
    }
    .bar * {
        color: white;
    }
</style>
