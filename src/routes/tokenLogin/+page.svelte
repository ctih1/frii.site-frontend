<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Holder from "$lib/components/Holder.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { t } from '$lib/translations';
    import { onMount } from "svelte";
  
    let authToken: string = '';
    let modal: Modal | undefined; 
    let description: string = "You've been logged in with your token!";
    let title: string = "Token Saved Successfully!";
    let options: string[] = ["Continue"];
  
    function storeToken(): void {
        if (modal) {
            localStorage.setItem("auth-token", authToken);
            modal.open(title, description);
        }


    }
  
    function modalClose(): void {
      if (modal) {
        modal.close();
        window.location.href = "/dashboard";
      }
    }
  
    onMount(() => {
      if (localStorage.getItem("logged-in") === "y") {
        window.location.href = "/account/manage";
        return;
      }
    });
  </script>
  
<Holder>
<h1>{$t("common.index_token_login")}</h1>
<p>{$t("common.login_description")}</p>
<div class="inp">
    <input 
        placeholder="Token" 
        type="text" 
        bind:value={authToken} 
    />
</div>
<sbr>
<div class="buttons"> 
    <Button on:click={storeToken} args={"padding fill"}>
        Sign in
    </Button>
</div>
<Modal 
    bind:this={modal} 
    on:primary={() => modalClose()} 
    on:secondary={() => modalSecondary()} 
    overrideDefault={true} 
    title={title} 
    description={description} 
    options={["Continue"]}
/>

</Holder>
<style>
    .buttons{
        height: 2em;
        margin-top: 0.25em;
        margin-bottom: 0.25em;
        padding-top: 5px;
    }
    .parent {
        display: grid;
        grid-template-columns: 3fr 2fr;
        grid-template-rows: 1fr 5fr 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        width: 100vw;
    }

    .div1 {
        grid-area: 2 / 1 / 3 / 2;
        text-align: center;
        display: flex;
        flex-direction: column;
    }
    
    .text-container {
        margin-top: auto;
        margin-bottom: auto;
    }
    .text-container * {
        height: fit-content;
        margin-top: 0px;
        margin-left: 0.5em;
    }
    .button-holder {
        display: flex;
        flex-direction: row;
        margin-right:auto;
        height: 15%;
        width: 60%;
        
    }
    .button-holder x {
        margin: 2px;
        display: flex;
        width: 45%;
        height: 100%;
        min-width: 80px;
        
        min-height: 50px;
    }
    .div2-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .div2 {
        display: flex;
        grid-area: 2 / 2 / 3 / 3; 
    }
    .div3 { grid-area: 1 / 1 / 2 / 3; }
    .div4 { grid-area: 3 / 1 / 4 / 3; }

    .content {
        display: flex;
        flex-direction: row;
        width: 100vw;
        min-height: 100vh;
        height: 100%;
        color: white;
    }



    .parent {
        display: grid;
        grid-template-columns: 3fr 2fr;
        grid-template-rows: 1fr 5fr 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        width: 100vw;
    }

    .div1 {
        grid-area: 2 / 1 / 3 / 2;
        text-align: center;
        display: flex;
        flex-direction: column;
    }
    
    .text-container {
        margin-top: auto;
        margin-bottom: auto;
    }
    .text-container * {
        height: fit-content;
        margin-top: 0px;
        margin-left: 0.5em;
    }
    .button-holder {
        display: flex;
        flex-direction: row;
        margin-right:auto;
        height: 15%;
        width: 60%;
    }
    .button-holder x {
        margin: 2px;
        display: flex;
        width: 45%;
        height: 100%;
        min-width: 80px;
        min-height: 50px;
    }
    .div2-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .div2 {
        display: flex;
        grid-area: 2 / 2 / 3 / 3; 
    }
    .div3 { grid-area: 1 / 1 / 2 / 3; }
    .div4 { grid-area: 3 / 1 / 4 / 3; }


    .content {
        display: flex;
        flex-direction: row;
        width: 100vw;
        min-height: 100vh;
        height: 100%;
        color: white;
    }
        form {
        display: flex;
        flex-direction: column;
        height: fit-content;
    }
    form div {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
    }
    .inp {
        height: 2em;
        margin-top: 0.25em;
        margin-bottom: 0.25em;
    }
    .button-holder {
        height: 2em;
    }
    a {
        font-size: 0.75em;
    }
    a:hover {
        cursor:pointer;
    }
</style>