<script lang="ts">
    import { browser } from "$app/environment";
    import { getAuthToken } from "$lib";
    import Button from "$lib/components/Button.svelte";
    import Holder from "$lib/components/Holder.svelte";
    import { t, addArguements } from "$lib/translations";

    let value = $state("");
    let json = $state("");
    let currentPosition: number = $state(-1);
    let userHasConencted: boolean = $state(false);
    let userWasVerified: boolean = $state(false);

    function connectToWs() {
        userHasConencted = true;
        const sock = new WebSocket("ws://localhost:8000/domain/ws/vercel");
        sock.onopen = () => {
            sock.send(JSON.stringify({
                "session": getAuthToken()??"",
                "value": value
            }));
        }

        sock.onmessage = (event) => {
            json = JSON.parse(event.data);
            // @ts-ignore
            currentPosition = json["position"] 
        }

        sock.onclose = (event) => {
            userWasVerified = true;
            userHasConencted = false;
        }
    }
</script>

<Holder>
    <h1>Vercel verification</h1>
    {#if userHasConencted}
        {#if currentPosition === -1}
            <p>{$t("vercel_verification_queue_join")}</p>
        {:else if currentPosition === 0}
            <p>{$t("vercel_verification_generic")}</p>
        {:else}
            <p>{addArguements($t("vercel_verification_queue"), {"%position%": currentPosition})}</p>
        {/if}
    {:else if userWasVerified}
        <p>{$t("vercel_verification_queue_over")}</p>
    {:else}
        <input bind:value={value} placeholder="vc-domain-verify=***.frii.site,********************">
        <Button args="padding margin-1em-top" on:click={() => connectToWs()}>{$t("vercel_verification_queue_join_action_button")}</Button>
    {/if}
</Holder>

<style>
    input {
        height: 4em;
    }
</style>