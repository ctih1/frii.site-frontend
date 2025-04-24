<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import {t,addArguements} from "$lib/translations"
    import Button from "./Button.svelte"
    let dispatch = createEventDispatcher();

    export let price:number;
    export let description:string;
    function onItemPurchase() {
      dispatch("buy");
    }
</script>

<div class="shop-item">
    <h3><slot/></h3>
    <p>{description}</p>
    <p style="display: flex; align-items: center;">{addArguements($t("shop_buy"),{"%price%":price})} <span style="color: var(--primary)" class="material-symbols-outlined">poker_chip</span></p>
    <Button on:click={()=>onItemPurchase()} args="padding fill height-unset">Purchase</Button>
</div>

<style>
    .shop-item {
        background-color: var(--offwhite-color);
        padding: 20px;
        border-radius: 0.5em;
    }
</style>
