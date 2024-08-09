<script lang="ts">
	import { prefLocale } from './../../routes/stores';
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
        prefLocale.set(value);
    };
    
    const mobile:boolean = window
</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

<header bind:this={header}>
    <a class="item" href="/">
        <span class="material-symbols-outlined">home</span>
        {$t("common.dashboard_home")}
    </a>

    <a class="item" href="/dashboard">
        <span class="material-symbols-outlined">apps</span>
        {$t("common.dashboard_navbar")}
    </a>

    <a class="item" href="/account/manage">
        <span class="material-symbols-outlined">person</span>
        {$t("common.dashboard_account")}
    </a>
    
    <a class="item" href="/report">
        <span class="material-symbols-outlined">flag</span>
        {$t("common.dashboard_abuse")}
    </a>

    <div class="item">
        <span class="material-symbols-outlined">language</span>
        <select style="color: var(--primary);" bind:value="{$locale}" on:change={handleChange}>
            {#each $locales as value}
                <option value={value} selected={$locale===value}>{$t(`lang.${value}`)} {getFlagEmoji(value)}</option>
            {/each}
        </select>
    </div>
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
    .item {
        display: flex;
        align-items: center;
        margin-left: 1em;
        margin-right: 1em;
    }
    .item * {   
        height: 100%;
        font-weight: 500;
    }

    @media(max-width: 550px) {
        header a {
            font-size: 0.7em;
        }
        .item {
            margin-left: 0.25em;
            margin-right: 0.25em;
        }
    }

    @media(orientation:portrait) {
        header a {
            font-size: 0.7em;
        }
        .item {
            margin-left: 0.25em;
            margin-right: 0.25em;
        }
    }
    select {
        border-style: none;
        background-color: none;
    }
    select * {
        color: var(--primary)
    }
    span {
        color: var(--primary)
    }
</style>