<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
    import { prefLocale } from './../../routes/stores';
    import Modal  from './Modal.svelte';
    import { t, locale, locales } from '$lib/translations';
    import { getFlagEmoji } from "../../helperFuncs";
    import { serverURL } from '../../serverContactor';

    let header: HTMLElement;
    let modal: Modal;
    let serverUrl = '';
    let inputBuffer = '';
    //thanks to someone on stackoverflow for this cant remember who you were though :(
    onMount(() => {
        serverUrl = localStorage.getItem('server_url') || "https://api.frii.site";

        document.addEventListener('keypress', handleKeyPress);
        header.addEventListener('mouseover', handleMouseOver);
    });
    onDestroy(() => {
        document.removeEventListener('keypress', handleKeyPress);
        header.removeEventListener('mouseover', handleMouseOver);
    });
    const handleKeyPress = (event: KeyboardEvent) => {
        inputBuffer += event.key;
        if (inputBuffer.includes('expect')) {
            window.location.href = 'https://www.whatdidyouexpect.eu';
        }
    };
    const handleMouseOver = () => {
        inputBuffer = '';
    };
    const handleChange = ({ currentTarget }) => {
        const { value } = currentTarget;
        prefLocale.set(value);
    };

</script>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

<header bind:this={header}>
    <a class="item" href="/">
        <span class="material-symbols-outlined">home</span>
        <p>{$t("common.dashboard_home")}</p>
    </a>

    <a class="item" href="/dashboard">
        <span class="material-symbols-outlined">apps</span>
        <p>{$t("common.dashboard_navbar")}</p>
    </a>

    <a class="item" href="/account/manage">
        <span class="material-symbols-outlined">person</span>
        <p>{$t("common.dashboard_account")}</p>
    </a>
    
    <a class="item" href="/report">
        <span class="material-symbols-outlined">flag</span>
        <p>{$t("common.dashboard_abuse")}</p>
    </a>
    <a class="item" href="/aboutus">
        <span class="material-symbols-outlined">book</span>
        <p>{$t("common.dashboard_aboutus")}</p>
    </a>
    <a class="item" href="/ugc">
        <span class="material-symbols-outlined">person</span>
        <p>User Sites</p>
    </a>
    <a class="item" href="#">
        <span class="material-symbols-outlined">computer</span>
        <p>{serverUrl}</p>
    </a>

    <div class="item">
        <span class="material-symbols-outlined">language</span>
        <select style="color: var(--primary);" bind:value="{$locale}" on:change={handleChange}>
            {#each $locales as value}
                <option style="color: black;" value={value} selected={$locale===value}>{$t(`lang.${value}`)} {getFlagEmoji(value)}</option>
            {/each}
        </select>
    </div>

</header>

<style>
    header {
        position: absolute;
        display: flex;
        align-items: center;
        top: 0px;
        left: 0px;
        background-color: rgb(56, 39, 39);
        min-height: 50px;
        width: 100vw;
        z-index: 10;
        border-radius: 20px;
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
        .item p {
            display: none;
        }
        .material-symbols-outlined {
            font-size: 40px;
        }
        header {
            display: flex;
            justify-content: space-around;
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
