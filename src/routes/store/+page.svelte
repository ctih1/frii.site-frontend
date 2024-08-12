<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
	import Placeholder from '$lib/components/Placeholder.svelte';
	import { ServerContactor } from './../../serverContactor';
    import {redirectToLogin} from "../../helperFuncs";
    import Holder from "$lib/components/Holder.svelte";
    let credits:number = 0;

    let sc = new ServerContactor(localStorage.getItem("auth-token"));
    let modal:Modal;
    let loaded:boolean=false;

    sc.getCredits().then(response=>{
        if(response.status!==200) {
            redirectToLogin(response.status);
        }
        response.json().then(data=>{
            credits = data["credits"];
        })
    });

    function convertCredits() {
        sc.convertCredits().then(response=>{
            if(response.status!==200) {
                modal.open("Something went wrong","Something went wrong while converting domains!");
            } else {
                modal.open("Success!","Succesfully converted");
            }
        })
    }
</script>

{#if loaded}
    <Modal title="" description="" options={["OK"]} bind:this={modal}></Modal>
    <Holder>
        <p>WARNING: This page is still in beta. You are allowed to share screenshots or videos of this page :D.</p>
        <p>Your credits: {credits}</p>

        <Button on:click={()=>{}} args="fill padding">Convert 200 credits to one extra domain (check on frii.site/account/manage. It may take up to 30 seconds to invalidate the cache)</Button>
    </Holder>


{:else}
    <Holder>
        <Placeholder />
        <Placeholder />
    </Holder>
{/if}
