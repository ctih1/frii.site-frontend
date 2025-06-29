<script lang="ts">
    import { browser } from "$app/environment";
    import { AuthError, CaptchaError, login, MFAError, PermissionError, UserError } from "$lib";
    import { Button } from "$lib/components/ui/button/index";
    import InlineAlert from "$lib/components/ui/inline-alert/inline-alert.svelte";
    import { Input } from "$lib/components/ui/input/index";
    import { Label } from "$lib/components/ui/label/index";
    import { fade } from "svelte/transition";
    import { m } from "../../paraglide/messages";

    let isLoggingIn: boolean = $state(true);
    let username: string = $state("");
    let email: string = $state("");
    let password: string = $state("");
    let repeatPassword: string = $state("");

    let emailInvalid: boolean = $derived(validateEmail(email));
    let actionButtonDisabled: boolean = $state(false);
    let buttonLoadingState: boolean = $state(false);

    let errorTitle: string = $state("");
    let errorDescription: string = $state("");

    let requiresMfa: boolean = $state(false)

    let captchaToken: string = "";
    let captchaDone: boolean = $state(false);

    function validateEmail(email: string) {
        return !String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };

    function resetTurnstile() {
        captchaDone = false;
        // @ts-ignore
        resetTurnstile.reset();
    }

    function logIn() {
        login(username,password, captchaToken).catch(error => {
            buttonLoadingState = false;
            errorTitle = m.login_failed();
            if(error instanceof AuthError || error instanceof UserError) errorDescription = m.login_failed_description();
            else if(error instanceof PermissionError) errorDescription = m.login_failed_verify();
            else if(error instanceof MFAError) requiresMfa = true;
            else if(error instanceof CaptchaError) errorDescription = m.captcha_fail();
            else errorDescription = m.login_generic_error();

            resetTurnstile();
        })
    }

    function signUp() {
        
    }

    if (browser) {
		// if using synchronous loading, will be called once the DOM is ready
		//@ts-ignore
		turnstile.ready(function () {
			// @ts-ignore
			turnstile.render("#turnstile-container", {
				sitekey: "0x4AAAAAABiGbbOhSUc5vWl9",
				callback: function (token: string) {
                    captchaToken = token;
                    captchaDone = true;

					console.log(`Challenge Success`);
				}
			});
		});
	}
    
    $effect(() => {
        if(!captchaDone) {
            console.log("Captcha not done...");
            actionButtonDisabled = true;
            return
        }
        console.log("captcha done");

        if(isLoggingIn) {
            console.log(username, password);
            if(!username || !password) actionButtonDisabled = true;
            else actionButtonDisabled = false;

            console.log(`Checking login... ${actionButtonDisabled}`);
        } else {
            if(repeatPassword !== password || !username || !email || emailInvalid) actionButtonDisabled = true;
            else actionButtonDisabled = false;
        }

    })
</script>

<svelte:head>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
    <link rel="preload" href="/favicon.svg" as="image" type="image/svg+xml" />
</svelte:head>

<div class="login-holder bg-card w-[100vw] p-8 rounded-lg max-w-[500px] m-auto">
    <div class="flex flex-col">
        <img class="w-8" src="/favicon.svg" alt="logo">
        <h1 class="text-3xl font-bold">
            {#if isLoggingIn} 
                {m.login_prompt()}
            {:else}
                {m.signup_prompt()}
            {/if}
        </h1>
    </div>
    <InlineAlert title={errorTitle} description={errorDescription} variant={"error"} />
    {#if }
    <form class="mt-6">
        <div class="flex flex-col gap-6">
            <div class="grid gap-2">
                <Label for="username">{m.username_placeholder()}</Label>
                <Input bind:value={username} id="username" type="text" placeholder="username" required />
                
                {#if !isLoggingIn}
                    <Label for="email">Email</Label>
                    <Input aria-invalid={emailInvalid} bind:value={email} id="email" type="email" placeholder="user@gmail.com" required />
                {/if}
                <div class="flex items-center h-4">
                    <Label for="password">{m.password_placeholder()}</Label>
                    {#if isLoggingIn}
                    <a
                        transition:fade={{duration: 100}}
                        href="##"
                        class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                    {m.password_forget_intro()}
                    </a>
                    {/if}
                </div>
                <Input bind:value={password} id="password" type="password" placeholder="*********" required />
                {#if !isLoggingIn}
                    <Label for="repeat-password">{m.confirm_password_placeholder()}</Label>
                    <Input aria-invalid={!!repeatPassword && repeatPassword !== password} bind:value={repeatPassword} id="repeat-password" type="password" placeholder="*********" required />
                {/if}
            </div>
        </div>
    </form>

    <Button onclick={() => {
        buttonLoadingState = true;
        isLoggingIn ? logIn() : signUp()
     }} loading={buttonLoadingState} disabled={actionButtonDisabled} type="submit" class="w-full mt-4">{isLoggingIn ? m.login_button() : m.signup_button()}</Button>  
    
    <a onclick={_ => isLoggingIn = !isLoggingIn} href="##" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
        {isLoggingIn ? m.signup_instead() : m.login_instead()}
    </a>
</div>

<div class="m-auto mt-12 w-fit" data-sitekey="0x4AAAAAABiGbbOhSUc5vWl9" data-theme="dark" id="turnstile-container"></div>
