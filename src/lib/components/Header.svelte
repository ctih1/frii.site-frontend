<script lang="ts">
    import Dropdown from "./Dropdown.svelte";
    let header:HTMLElement
    
    export function getHeight():number {
        return Number(header.style.height.substring(0,header.style.height.length-2));
    }
</script>
<header bind:this={header}>
    <a href="/">Home</a>
    <a href="/dashboard">Dashboard</a>
    <a href="/account">Account</a>
    <a href="/account/manage">Settings</a>
    <a href="/report">Report abuse or vulnerabilities</a>
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
    header a {
        margin-left: 1em;
        margin-right: 1em;
    }
    
    @media(max-width: 550px) {
        header a {
            font-size: 0.7em;
        }
    }
</style>