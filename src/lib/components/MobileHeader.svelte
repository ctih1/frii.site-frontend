<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { prefLocale } from "../../routes/stores";
    import Modal from "./Modal.svelte";
    import { t, locale, locales } from "$lib/translations";
    import { getFlagEmoji } from "../../helperFuncs";
    import { serverURL } from "../../serverContactor";

    let header: HTMLElement;
    let modal: Modal;
    let serverUrl = "";
    let inputBuffer = "";
    let dropdownOpen = false;

    //thanks to someone on stackoverflow for this cant remember who you were though :(
    onMount(() => {
        serverUrl =
            localStorage.getItem("server_url") || "https://api.frii.site";
    });
    onDestroy(() => {});

    const handleChange = ({ currentTarget }) => {
        const { value } = currentTarget;
        prefLocale.set(value);
    };

    const toggleDropdown = () => {
        dropdownOpen = !dropdownOpen;
    };
</script>

<link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/>

<header bind:this={header}>
    <div class="dropdown">
        <button class="dropbtn" on:click={toggleDropdown}>
            <span class="material-symbols-outlined">menu</span>
            <p>Menu </p>
        </button>
        <div class="dropdown-content">
            <a href="/">{$t("common.dashboard_home")}</a>
            <a href="/dashboard">{$t("common.dashboard_navbar")}</a>
            <a href="/account/manage">{$t("common.dashboard_account")}</a>
            <a href="/tokenLogin">Login With Token</a>
            <a href="/serverURL">Set Server url</a>
        </div>
    </div>

    <div class="item">
        <span class="material-symbols-outlined">language</span>
        <select bind:value={$locale} on:change={handleChange}>
            {#each $locales as value}
                <option {value} selected={$locale === value}
                    >{$t(`lang.${value}`)} {getFlagEmoji(value)}</option
                >
            {/each}
        </select>
    </div>
</header>

<style>
    #hatred {
        white-space: pre;
    }
    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropbtn {
        background-color: transparent;
        color: var(--primary);
 
        font-size: 16px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        border-radius: 20px;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: rgb(56, 39, 39);
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        border-radius: 20px;
        transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
        transform: translateY(-10px);
    }

    .dropdown-content a {
        display: block;
        padding: 12px 16px;
        text-decoration: none;
        color: var(--primary);
        border-radius: 20px;
        padding-right: 10px;
    }


    .dropdown-content a:hover {
        background-color: #3a1c1c;
        color: rgb(255, 255, 255);
        
        border-radius: 20px;
    }

    .dropdown:hover .dropdown-content {
        display: block;
        transform: translateY(0);
        animation: slideOut 0.3s ease-out;
        font-size: 25px;
    }

    .dropdown:hover .dropbtn {
        background-color: rgb(29, 20, 20);
    }

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

    @keyframes slideOut {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}


    @media (max-width: 550px) {
        header a {
            font-size: 0.7em;
        }
        .item {
            margin-left: 0.25em;
            margin-right: 0.25em;
        }
    }

    @media (orientation: portrait) {
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
        background-color:  rgb(56, 39, 39);
        border-style: none;
        background-color: none;
        color: var(--primary);
    }
    span {
        color: var(--primary);
    }
</style>
