<script lang="ts">
    import { onMount } from "svelte";
    import { AuthError, ServerContactor } from "./../../../serverContactor";
    import { getAuthToken } from "$lib";
    import Placeholder from "$lib/components/Placeholder.svelte";
    import Button from "$lib/components/Button.svelte";
    import Tooltip from "$lib/components/Tooltip.svelte";
    import Holder from "$lib/components/Holder.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { getTranslationKeys } from "../../../serverContactor";
    import { t } from "$lib/translations";
    import { getFlagEmoji, redirectToLogin } from "../../../helperFuncs";
    import Cookies from 'js-cookie';
    
    let { data } = $props();

    let loaded = $state(false);
    let keys: Array<{ key: string; ref: string }> = $state(new Array());
    let values: Array<string> = new Array(keys.length);
    let indexes: Array<string> = new Array(values.length); // internal names of translation keys (dashboard_delete_succes)

    let sc:ServerContactor;
    let modal: Modal;
    let modified: Array<{ key: string; val: string }> = new Array();
    console.log(values);

    onMount(()=>{
        sc = new ServerContactor(getAuthToken());
    })

    getTranslationKeys(data.path)
        .then((data) => {
            keys = data;
            loaded = true;
        });

    $effect(()=>{
        keys;
        fillInKeys();
    })

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
        sc.contributeLanguageKeys(data.path, modified)
            .catch(err=>{
                if(err instanceof AuthError) redirectToLogin(460)
                if(err instanceof Error) modal.open($t("unhandled_error"),"")
            })
            .then((response) => {
                modal.open($t("translation_submit_succeed"),$t("translation_consideration"));
            });
    }
</script>

<Holder>
    <Modal
        bind:this={modal}
        title="Error submitting translations"
        description="An error occured while submitting translations"
        options={[$t("modal_ok")]}
    />
    <h1>
        {$t(`lang.${data.path}`)}
        <span style="text-shadow: rgba(0,0,0,0.5) 0px 0px 3px"
            >{getFlagEmoji(data.path)}</span
        >
    </h1>
    <p>{$t("translation_clarification")}</p>
    <div class="keys">
        {#if loaded}
            {#each keys as key, index}
                <div class="key">
                    <span
                        style="display: flex; align-items: center; width: fit-content;"
                        ><p class="reference" style="margin-right: 1em;">
                            {key.ref}
                        </p>
                        <Tooltip>{key.key}</Tooltip></span
                    >
                    <input
                        bind:value={values[index]}
                        type="text"
                        style="height: 2em;"
                        placeholder={$t("translation_input")}
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
        >{$t("security_report_submit")}</Button
    >
</Holder>

<style>
    .keys {
        display: grid;
        gap: 1em;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 1fr auto;
        grid-auto-rows: auto;
    }
    .key {
        background-color: var(--offwhite-color);
        border-radius: 0.5em;
        padding: 1em;
        margin: 1em 0em 0em 0em;
        opacity: 0.7;
    }
    .key:hover {
        opacity: 1;
    }
    .reference::before {
        content: '"';
    }
    .reference::after {
        content: '"';
    }
</style>
