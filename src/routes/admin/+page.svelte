<script>
    import { writable } from 'svelte/store';
    import Holder from '$lib/components/Holder.svelte';
    import { onMount } from 'svelte';
    import Button from "$lib/components/Button.svelte";

    let token = writable('');
    let id = writable('');
    let responseData = writable(null);
    let errorMessage = writable(null);

    onMount(() => {
        const savedToken = localStorage.getItem('auth-token');
        if (savedToken) {
            token.set(savedToken);
        }
    });

    const handleSubmit = async (event) => {
    event.preventDefault();

    const tokenValue = $token;
    const idValue = $id;

    if (!tokenValue || !idValue) {
        $errorMessage = "Token and ID are required!";
        return;
    }

    try {
        const response = await fetch(`https://devserver.frii.site/admin/get-email?id=${idValue}`, {
            method: 'GET',
            headers: {
                'X-Auth-Token': tokenValue
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data) {
            throw new Error("Server returned no data");
        }

        $responseData = data;
        $errorMessage = null;
    } catch (error) {
        $errorMessage = error.message;
    }
};


    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    };
    // im going to shit my pants!! 11
</script>

<style>
    .error {
        color: red;
    }
    .inp {
        height: 2em;
    }
    .response {
        margin-top: 1rem;
        padding: 1rem;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
    }
    footerino {
        color: grey;
        font-size: 10px;
    }
    .button-holder {
        height: 2em;
    }
</style>

<Holder>
    <main>
        <h1>hell on fucking earth</h1>

        <form on:submit={handleSubmit}>
            <label read-only for="token">X-Auth-Token:</label>
            <div class="inp">
            <input 
                id="token"
                type="text"
                bind:value={$token}
                placeholder="Enter your token"
            />
            </div>
            <br>
            <label for="id">Account ID:</label>
            <div class="inp">
            <input
                id="id"
                type="text"
                bind:value={$id}
                placeholder="Enter ID"
                required
            />
           </div>
           <div class="button-holder">
            <Button type="submit" args={"padding"}>
                Get Email
            </Button>
            </div>
        </form>

        {#if $errorMessage}
            <p class="error">Error: {$errorMessage}</p>
        {/if}
        {#if $responseData}
        <div class="response">
            <h2>Response Data:</h2>
            {#if !$responseData.Error && $responseData.username && $responseData.email && $responseData.permissions}
                <p><strong>Username:</strong> {$responseData.username}</p>
                <p><strong>Email:</strong> {$responseData.email}</p>
                <p><strong>Created:</strong> {formatTimestamp($responseData.created)}</p>
                <p><strong>Last Login:</strong> {formatTimestamp($responseData['last-login'])}</p>
                <p><strong>Max Domains:</strong> {$responseData.permissions['max-domains']}</p>
            {:else}
                <p>Error: Incomplete or incorrect data received from the server.</p>
            {/if}
        </div>
    {/if}
    
    
    </main>
</Holder>