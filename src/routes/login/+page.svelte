<script lang="ts">
    import { updated } from "$app/stores";
    import Button from "$lib/components/Button.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Blur from "$lib/components/Blur.svelte";
    import { ServerContactor } from "../../serverContactor";
    import Modal from "$lib/components/Modal.svelte";
    import Holder from "$lib/components/Holder.svelte";
    let serverContactor: ServerContactor|undefined = undefined;
    
    let username: string;
    let password: string;
    let repeatPassword:string;
    let email:string
    let modal:Modal;
    let redirectURL:string|null; 
    let blur:Blur;
    
    function modalClose() {
        modal.close();
        blur.hide();
    }
    function modalSecondary() {

    }

    onMount(()=>{
        serverContactor = new ServerContactor(localStorage.getItem("auth-token"));
        redirectURL=$page.url.searchParams.get("r");
    });
    let login:boolean=true;

    function accountActionButtonClick() {
        blur.show();
        if(serverContactor===undefined) { return };
        if(login) { 
            serverContactor.login(username,password).then(response=>{
                switch(response) {
                    case 404: 
                        modal.open("Login failed (404)","There was an error while logging in. If this keeps happening, please contact support.");
                        break;
                    case 401:
                        modal.open("Login failed (401)","There was an error while logging in. If this keeps happening, please contact support.");
                        break;
                    case 417:
                        modal.open("Please verify your account","A verification code has been sent to your email. Please check your spam folder.");
                        break;
                    case 200:
                        localStorage.setItem("auth-token",localStorage.getItem("temp-token")); // this should **never** break
                        localStorage.removeItem("temp-token");
                        modal.open("Succesfully signed in","You will be redirected soon...");
                        if(redirectURL===null) {
                            redirectURL = "/";
                        }
                        window.location.href=redirectURL;
                        break;
                }
            });
        }
        if(!login) {
            if(password!==repeatPassword) {modal.open("Passwords don't match!","Please confirm that your passwords match.")}
            serverContactor.register(username,password,email).then(response=>{
                switch(response.status){
                    case 200: 
                        modal.open("Succesfully registered!","Please log in.");
                        login=true;
                        break;
                    case 409:
                        modal.open("Sign up failed (409)","Username is taken!");
                        break;
                }
            })
        }
    }
</script>

<svelte:head>
    <title>Log in</title>
</svelte:head>

<Holder>
    
        <h1 >
            {#if login}
                Login
            {:else}
                Sign up
            {/if}
        </h1>
        <p >
            {#if login} 
             Please sign into your frii.site account.
            {:else} 
                Now is the perfect time to sign up for a frii.site account!
            {/if}
        </p>
    

    <form>
        {#if !login} 
            <div class="inp"><input bind:value={email} placeholder="email" type="email"></div>
        {/if}
        <div class="inp"><input bind:value={username} placeholder="username" type="username"></div>
        <div class="inp"><input bind:value={password} placeholder="password" type="password"></div>
        {#if !login}
            <div class="inp"><input bind:value={repeatPassword} placeholder="confirm password" type="password"></div>
        {/if}
        <div class="button-holder">
            <Button on:click={()=>accountActionButtonClick()} args={"fill"}>
                {#if login}
                    Sign in
                {:else}
                    Sign up
                {/if}
            </Button>
        </div>
        <a on:click={()=>login=!login}>
            {#if login}
                Sign up instead
            {:else}
                Log in instead
            {/if}</a>
    </form>
</Holder>

<Blur bind:this={blur}/>

<Modal bind:this={modal} on:primary={()=>modalClose()} on:secondary={()=>modalSecondary()} overrideDefault={true} description="" title="" options={["Continue"]}></Modal>

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