<script lang="ts">
	import Placeholder from '$lib/components/Placeholder.svelte';
	import Button from '$lib/components/Button.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import Holder from '$lib/components/Holder.svelte';
    import { getTranslationKeys } from '../../../serverContactor';
    import { t, locales } from '$lib/translations';
    import {getFlagEmoji} from "../../../helperFuncs";
    export let data;
    let loaded = false;
    let keys: Array<{key:string,ref:string}> = new Array();
    getTranslationKeys(data.path).then(response=>response.json()).then(data=>{
        keys = data;
        loaded=true;
    });

</script>

<Holder>
    <h1>{$t(`lang.${data.path}`)} <span style="text-shadow: rgba(0,0,0,0.5) 0px 0px 3px">{getFlagEmoji(data.path)}</span></h1>
    <p>{$t("common.translation_clarification")}</p>
    <div class="keys">
        {#if loaded}
            {#each keys as key, index}
                <div class="key">
                    <span style="display: flex; align-items: center;"><p class="reference" style="margin-right: 1em;">{key.ref}</p> <Tooltip>{key.key}</Tooltip></span>
                    <input type="text" style="height: 2em;" placeholder={$t("common.translation_input")}>
                </div>
            {/each}
        {:else}
            {#each Array(16) as _}
                <div class="key">
                    <Placeholder/>
                    <Placeholder/>
                </div>
            {/each}
        {/if}
    </div>
    <Button args="fill padding argin-1em-top">{$t("common.security_report_submit")}</Button>
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