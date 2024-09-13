<script lang="ts">
	import Placeholder from '$lib/components/Placeholder.svelte';
    import Holder from "$lib/components/Holder.svelte";
    import Tooltip from '$lib/components/Tooltip.svelte';
    import { t, locales } from '$lib/translations';
    import {getFlagEmoji} from "../../helperFuncs";
    import { getLanguagePercentages } from '../../serverContactor';

    let translationPercentages:Map<string,number> = new Map();
    let loaded:boolean = false;
    getLanguagePercentages().then(response=>response.json()).then(data=>{
        translationPercentages = new Map(Object.entries(data));
        loaded=true;
    });

</script>

<Holder>
    <h1>Languages</h1>

    {#if loaded}
        {#each $locales as loc,index}
            <div class="locale">
                <h3><a href={`/translations/${loc}`}>{$t(`lang.${loc}`)}</a> <span style="text-shadow: rgba(0,0,0,0.5) 0px 0px 3px">{getFlagEmoji(loc)}</span></h3>
                <span style="display: flex; align-items: center;"><p>Coverage: {Math.round((translationPercentages.get(loc)??1)*100)}%</p>{#if index===0}<Tooltip>How many sections are translated</Tooltip>{/if}</span>
            </div>
        {/each}
    {:else}
        {#each Array(4) as _}
            <div class="locale">
                <Placeholder/>
                <Placeholder/>
            </div>
        {/each}
    {/if}

</Holder>

<style>

    .locale * {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }
    .locale {
        border-radius: 0.5em;
        background-color: var(--offwhite-color);
        padding: 1em;
        margin: 1em 0em 0em 0em;
    }

</style>