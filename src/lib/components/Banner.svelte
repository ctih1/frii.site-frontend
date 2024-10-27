<script lang="ts">
    import { get } from "svelte/store"
    import { getStatus } from "../../serverContactor";
    import { browser } from "$app/environment";
    let height:number;
    let loaded:boolean=false;
    let danger:boolean=false;

    let message:string;
    getStatus().then(response=> {
        if(response.status===204) {
            danger=false;
            loaded=true;
        } else if(response.status!==404) {
            response.text().then(data=>{
                console.log(data);
                danger=true;
                message=data;
                calcIsHidden();
                loaded=true;
            })
        }})
      loaded=true;

    let hidden:boolean = false;

    function calcIsHidden():boolean {
      if(!browser) { return false; }
      hidden = (localStorage.getItem("notification-hidden")??false) as boolean && localStorage.getItem("notification-hidden-message") === message;
      return hidden;
    }
</script>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
{#if loaded && danger && !hidden}
    <div bind:clientHeight={height} class="bar">
        <span style="margin-left: 1em;" class="material-symbols-outlined">warning</span>
        <p>{message}</p>

        <a on:click={()=>{
          localStorage.setItem("notification-hidden","true");
          localStorage.setItem("notification-hidden-message", message);
          hidden=true;
        }}>X</a>

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
    a {
        cursor: pointer;
        margin-left: auto;
        margin-right: 2em;
        font-size: 1em;
    }
</style>
