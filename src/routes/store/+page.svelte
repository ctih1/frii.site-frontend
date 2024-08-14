<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
	import Placeholder from '$lib/components/Placeholder.svelte';
	import { ServerContactor } from './../../serverContactor';
    import {redirectToLogin} from "../../helperFuncs";
    import Holder from "$lib/components/Holder.svelte";
    let credits:number = 0;
    let sc = new ServerContactor(localStorage.getItem("auth-token"));
    let modal:Modal;
    let loaded:boolean=false;

    sc.getCredits().then(response=>{
        if(response.status!==200) {
            redirectToLogin(response.status);
        }
        response.json().then(data=>{
            credits = data["credits"];
            loaded=true;
        })
    });

    function convertCredits() {
        sc.convertCredits().then(response=>{
            if(response.status!==200) {
                modal.open("Something went wrong","Something went wrong while converting domains!");
            } else {
                modal.open("Success!","Succesfully converted");
                credits-=200;
            }
        })
    }
</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
{#if loaded}
    <Modal title="" description="" options={["OK"]} bind:this={modal}></Modal>
    <Holder>
        <h1>Store</h1>
        <p>WARNING: This page is still in beta. The styling, way credits work, or item prices have not been determined yet.</p>
        <p style="display: flex; align-items: center;">{credits} <span style="color: var(--primary)" class="material-symbols-outlined">poker_chip</span></p>
        <div class="shop">
            <div class="shop-item">
                <h3>Extra domain</h3>
                <p style="display: flex; align-items: center;">Price: 200 <span style="color: var(--primary)" class="material-symbols-outlined">poker_chip</span></p>
                <Button on:click={()=>{convertCredits();}} args="padding fill height-unset">Purchase</Button>
            </div>
        </div>
    </Holder>


{:else}
    <Holder>
        <Placeholder />
        <Placeholder /> 
    </Holder>
{/if}

<style>
    .shop {
        display: grid;
        grid-template-columns: repeat(2,1fr);
        grid-template-rows: repeat(auto,auto);
    }
    .shop-item {
        background-color: var(--offwhite-color);
        padding: 20px;
        border-radius: 0.5em;
    }
    @media(orientation:portrait) {
        .shop {
            grid-template-columns: repeat(1,1fr);
        }
    }
</style>