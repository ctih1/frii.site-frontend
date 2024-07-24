<script lang="ts">
	import Modal  from './Modal.svelte';
    import { t, locale, locales } from '$lib/translations';
    import {getFlagEmoji} from "../../helperFuncs";
    let header:HTMLElement
    let modal:Modal;
    export function getHeight():number {
        return Number(header.style.height.substring(0,header.style.height.length-2));
    }

    const handleChange = ({ currentTarget }) => {
        const { value } = currentTarget;
        document.cookie = `lang=${value} ;`;
    };
</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
<header bind:this={header}>
    <div class="item">
        <a href="/">{$t("common.dashboard_home")}</a>
    </div>

    <div class="item">
        <a href="/dashboard">{$t("common.dashboard_navbar")}</a>
    </div>

    <div class="item">
        <a href="/account">{$t("common.dashboard_account")}</a>
    </div>

    <div class="item">
        <a href="/report">{$t("common.dashboard_abuse")}</a>
    </div>

    <select bind:value="{$locale}" on:change={handleChange}>
        {#each $locales as value}
            <option value={value} selected={$locale===value}>{$t(`lang.${value}`)} {getFlagEmoji(value)}</option>
        {/each}
    </select>
</header>

<style>
    header {
        position: asbolute;
        display: flex;
        align-items: center;
        top: 0px;
        left: 0px;
        background-color: rgb(255, 255, 255);
        min-height: 50px;
        width: 100vw;
        z-index: 10;
    }
    header * {
        align-items: center;
        text-align: center;
    }
    
    @media(max-width: 550px) {
        header a {
            font-size: 0.7em;
        }
    }
    select {
        border-style: none;
        background-color: none;
    }
    select * {
        color: var(--primary)
    }
    .item {
        display: flex;
        align-items: center;
        margin-left: 1em;
        margin-right: 1em;
    }
    .item * {   
        height: 100%;
    }
    span {
        color: var(--primary)
    }
</style>