<script>
    import Registrar from '$lib/components/Registrar.svelte';
    import DomainTable from "$lib/components/DomainTable.svelte";
    import Holder from '$lib/components/Holder.svelte';
    import Button from '$lib/components/Button.svelte';
    import BubbleBackground from "$lib/components/BubbleBackground.svelte";
    import { t, l, locale, addArguements } from '$lib/translations';
    import { onMount } from 'svelte';
    

    let domains = [];
    let newWord = '';

    onMount(async () => {
        await fetchDomains();
    });

    async function fetchDomains() {
        try {
            const response = await fetch('https://hell.whatdidyouexpect.eu/data');
            if (response.ok) {
                domains = await response.json();
            } else {
                console.error('Failed to fetch domains');
            }
        } catch (error) {
            console.error('Error fetching domains:', error);
        }
    }

    async function submitWord() {
        if (newWord.trim() === '') {
            alert('Please enter a subdomain');
            return;
        }

        try {
            const response = await fetch('https://hell.whatdidyouexpect.eu/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ word: newWord })
            });

            if (response.ok) {
                await fetchDomains(); 
                newWord = ''; 
            } else {
                console.error('Failed to submit word');
            }
        } catch (error) {
            console.error('Error submitting word:', error);
        }
    }
</script>

<Holder>
    <h1>User Sites</h1>

    <div>
        <input type="text" bind:value={newWord} placeholder="Enter a Subdomain (Just the subdomain not .frii.site!)" />
        <div class="buttons">
            <div><Button on:click={submitWord} args={"padding"}>Send!</Button></div>
        </div>
    </div>

    {#if domains.length > 0}
        <div>
            {#each domains as domain}
                <p><a href={`https://${domain}`} target="_blank" rel="noopener noreferrer">{domain}</a></p>
            {/each}
        </div>
    {:else}
        <p>No domains available</p>
    {/if}
    
</Holder>
