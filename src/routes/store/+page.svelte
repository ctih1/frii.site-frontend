<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
	import Placeholder from '$lib/components/Placeholder.svelte';
	import { ServerContactor } from './../../serverContactor';
    import {redirectToLogin} from "../../helperFuncs";
    import ShopItem from "$lib/components/ShopItem.svelte";
    import {t} from "$lib/translations"
    import Holder from "$lib/components/Holder.svelte";
    import Cookies from 'js-cookie';
    import { getAuthToken } from "$lib";

    let credits:number = 0;
    let sc = new ServerContactor(getAuthToken());
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
        <h1>{$t("common.store_title")}</h1>
        <p>WARNING: This page is still in beta. The styling, way credits work, or item prices have not been determined yet.</p>
        <p style="display: flex; align-items: center;">{credits} <span style="color: var(--primary)" class="material-symbols-outlined">poker_chip</span></p>
        <div class="shop">
          <ShopItem on:buy={()=>convertCredits()} description={$t("common.store_extra_domains_description")} price={200}>{$t("common.store_extra_domains")}</ShopItem>
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

    @media(orientation:portrait) {
        .shop {
            grid-template-columns: repeat(1,1fr);
        }
    }
</style>
