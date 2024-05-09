<script lang="ts">
    import { updated } from "$app/stores";
import Button from "$lib/components/Button.svelte";
    import { blur } from "svelte/transition";
    
    let login:boolean=true;
</script>

<div class="holder">
    
        <h1 transition:blur>
            {#if login===true}
                Login
            {:else}
                Sign updated
            {/if}
        </h1>
        <p transition:blur>Please sign into your frii.site account.</p>
    

    <form>
        {#if login===false} 
            <div class="inp"><input placeholder="username" type="username"></div>
        {/if}
        <div class="inp"><input placeholder="email" type="email"></div>
        <div class="inp"><input placeholder="password" type="password"></div>
        {#if login===false}
            <div class="inp"><input placeholder="confirm password" type="password"></div>
        {/if}
        <div class="button-holder">
            <Button args={"fill"}>Sign in</Button>
        </div>
        <a on:click={()=>login=!login}>
            {#if login==true}
                Sign up instead
            {:else}
                Log in instead
            {/if}</a>
    </form>
</div>

<style>
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