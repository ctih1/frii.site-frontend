<script lang="ts">
    import { ServerContactor } from "./../../../serverContactor";
    import Placeholder from "$lib/components/Placeholder.svelte";
    import Button from "$lib/components/Button.svelte";
    import Tooltip from "$lib/components/Tooltip.svelte";
    import Holder from "$lib/components/Holder.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { getTranslationKeys } from "../../../serverContactor";
    import { t } from "$lib/translations";
    import { getFlagEmoji } from "../../../helperFuncs";
    export let data;
    let loaded = false;
    let keys: Array<{ key: string; ref: string }> = new Array();
    let values: Array<string> = new Array(keys.length);
    let indexes: Array<string> = new Array(values.length); // internal names of translation keys (dashboard_delete_succes)
    let sc = new ServerContactor(localStorage.getItem("auth-token"));
    let modal: Modal;
    let modified: Array<{ key: string; val: string }> = new Array();
    console.log(values);

    getTranslationKeys(data.path)
        .then((response) => response.json())
        .then((data) => {
            keys = data;
            loaded = true;
        });

    $: keys, fillInKeys();

    function fillInKeys(): void {
        indexes = new Array(values.length);
        keys.forEach((element: { key: string; ref: string }) => {
            indexes.push(element.key);
        });
    }

    function handleClick() {
        values.forEach((element, index) => {
            if (
                !modified.includes({
                    key: indexes.at(index) as string,
                    val: element,
                })
            ) {
                modified.push({
                    key: indexes.at(index) as string,
                    val: element,
                });
            }
        });
        sc.submitLanguageContribution(data.path, modified).then((response) => {
            if (response.status !== 200) {
                modal.open(
                    "Failed to save translation",
                    "Your changes have been saved locally",
                );
            }
        });
    }
</script>

<Holder>
    <Modal
        bind:this={modal}
        title="Error submitting translations"
        description="An error occured while submitting translations"
        options={[$t("common.modal_ok")]}
    />
    <h1>
        {$t(`lang.${data.path}`)}
        <span style="text-shadow: rgba(0,0,0,0.5) 0px 0px 3px"
            >{getFlagEmoji(data.path)}</span
        >
    </h1>
    <p>{$t("common.translation_clarification")}</p>
    <div class="keys">
        {#if loaded}
            {#each keys as key, index}
                <div class="key">
                    <span style="display: flex; align-items: center;"
                        ><p class="reference" style="margin-right: 1em;">
                            {key.ref}
                        </p>
                        <Tooltip>{key.key}</Tooltip></span
                    >
                    <input
                        bind:value={values[index]}
                        type="text"
                        style="height: 2em;"
                        placeholder={$t("common.translation_input")}
                    />
                </div>
            {/each}
        {:else}
            {#each Array(16) as _}
                <div class="key">
                    <Placeholder />
                    <Placeholder />
                </div>
            {/each}
        {/if}
    </div>
    <Button on:click={() => handleClick()} args="fill padding argin-1em-top"
        >{$t("common.security_report_submit")}</Button
    >
</Holder>

<style>
    .key {
        background-color: var(--offwhite-color);
        border-radius: 0.5em;
        padding: 1em;
        margin: 1em 0em 0em 0em;
    }
    .reference::before {
        content: '"';
    }
    .reference::after {
        content: '"';
    }
</style>
