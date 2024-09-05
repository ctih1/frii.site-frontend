<script lang="ts">
    import { fade } from "svelte/transition";
    import Button from "./Button.svelte";
    import Dropdown from "./Dropdown.svelte";
    import Modal from "./Modal.svelte";
    import Placeholder from "./Placeholder.svelte";
    import { createEventDispatcher } from "svelte";
    import { t } from "$lib/translations";
    export let domains: Array<Array<string>>;

    let dispatcher = createEventDispatcher();
    let dropdown: Dropdown;
    let editing: boolean;
    let content: HTMLInputElement;
    let value: HTMLInputElement;
    let selectedDomain: string;
    let editButton: Button;
    let loaded: boolean = false;
    let modal: Modal;
    let rowInputs: Array<Array<any>> = domains.map(() => []);

    export function updateDomains(ndomains: Array<Array<string>>): void {
        loaded = true;
        rowInputs = domains.map(() => []);
        domains = ndomains;
    }
    async function saveDomain(name: string, value: string, record: string) {
        dispatcher("save", { name: name, value: value, type: record });
    }
</script>

<link
    rel="preload"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/>

<table>
    <thead>
        <tr>
            <th style="width: 15%; min-width: 90px;"
                >{$t("common.dashboardt_record")}</th
            >
            <th>{$t("common.dashboardt_content")}</th>
            <th style="width: 25%;">{$t("common.dashboardt_value")}</th>
            <th style="width:20%; min-width:160px;"
                >{$t("common.dashboardt_manage")}</th
            >
        </tr>
    </thead>
    <tbody>
        {#if !loaded}
            {#each Array(Number(3)) as _, i}
                <tr>
                    <td><Placeholder /></td>
                    <td
                        ><div class="container">
                            <div style="width: 75%" class="container">
                                <Placeholder />
                            </div>
                            <div style="width: 25%; min-width:55px;">
                                <Placeholder />
                            </div>
                        </div></td
                    >
                    <td><Placeholder /></td>
                    <td style="display: flex; flex-direction: row;">
                        <Placeholder />
                        <Placeholder />
                    </td>
                </tr>
            {/each}
        {/if}
        {#each domains as domain, index}
            <tr>
                <td
                    ><Dropdown
                        bind:this={rowInputs[index][0]}
                        on:optionchange={(event) => (domain[0] = event.detail)}
                        defaultValue={domain[0]}
                        options={["A", "CNAME", "NS", "TXT"]}
                        disabled={true}
                    /></td
                >
                <td
                    ><div class="container">
                        {#if domain[0] !== "TXT"}
                            <div style="width: 75%" class="container">
                                <input
                                    disabled
                                    bind:this={rowInputs[index][1]}
                                    type="text"
                                    bind:value={domain[1]}
                                />
                            </div>
                            <div style="width: 25%; min-width:55px;">
                                <input
                                    disabled
                                    style="width: 100%; min-width:55px;"
                                    value=".frii.site"
                                />
                            </div>
                        {:else}
                            <div style="width: 100%" class="container">
                                <input
                                    disabled
                                    bind:this={rowInputs[index][1]}
                                    type="text"
                                    bind:value={domain[1]}
                                />
                            </div>
                        {/if}
                    </div></td
                >
                <td
                    ><input
                        bind:this={rowInputs[index][2]}
                        type="text"
                        bind:value={domain[2]}
                    /></td
                >
                <td
                    data-index={index}
                    style="display: flex; flex-direction: row;"
                >
                    <Button
                        on:click={() =>
                            saveDomain(domain[1], domain[2], domain[0])}
                        args={"fill three-quarters side-margin"}>Save</Button
                    >
                    <Button
                        on:click={() =>
                            dispatcher("delete", { domain: domain[1] })}
                        args={"fill danger quarter side-margin"}
                        ><span class="material-symbols-outlined">delete</span
                        ></Button
                    >
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<Modal
    bind:this={modal}
    options={["Cancel", "Continue"]}
    countdown={15}
    title="Are you sure you want to delete"
    description={""}
></Modal>

<style>
    thead {
        background-color: grey;
    }
    table {
        width: 100%;
        height: 100%;
        table-layout: fixed;
        background-color: grey;
        padding: 1em;
    }
    th {
        text-align: left;
    }
    tr {
        background-color: grey;
    }

    td {
        min-width: 10vw;
        width: 100%;
        height: 2em;
        justify-content: center;
    }
    tr:not(:last-child) {
    }

    .row {
        margin: 0px;
        display: flex;
        flex-direction: row;
    }
    .container {
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    input:focus {
        transform: scale(1.05);
        z-index: 11;
    }
    @media (orientation: portrait) {
        input:focus {
            transform: scale(1.3);
            font-size: 0.6em;
            z-index: 11;
        }
    }
</style>
