<script lang="ts">
    import { browser } from "$app/environment";
    import { login } from "$lib";
    import { Button } from "$lib/components/ui/button/index";
    import InlineAlert from "$lib/components/ui/inline-alert/inline-alert.svelte";
    import { Input } from "$lib/components/ui/input/index";
    import { Label } from "$lib/components/ui/label/index";
    import { fade } from "svelte/transition";

    let isLoggingIn: boolean = $state(true);
    let username: string = $state("");
    let email: string = $state("");
    let password: string = $state("");
    let repeatPassword: string = $state("");

    let actionButtonDisabled: boolean = $state(false);
    let buttonLoadingState: boolean = $state(false);

    let captchaToken: string = "";

    function resetTurnstile() {
        actionButtonDisabled = true;

        // @ts-ignore
        resetTurnstile.reset();
    }

    function logIn() {
        login(username,password, captchaToken).catch(error => {

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
					actionButtonDisabled = true;
                    captchaToken = token;
					console.log(`Challenge Success`);
				}
			});
		});
	}
</script>

<svelte:head>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
    <link rel="preload" href="/favicon.svg" as="image" type="image/svg+xml" />
</svelte:head>

<div class="login-holder bg-card w-[100vw] p-8 rounded-lg max-w-[500px] m-auto">
    <div class="flex flex-col">
        <img class="w-8" src="/favicon.svg" alt="logo">
        <div class="text-wrapper h-10">
            {#key isLoggingIn}
                <h1 transition:fade={{duration: 100}} class="text-3xl font-bold absolute">
                    {#if isLoggingIn} 
                        Log into your frii.site account
                    {:else}
                        Sign up for a frii.site account
                    {/if}
                </h1>
            {/key}
        </div>
    </div>
    <InlineAlert title="Error logging in" description="Login failed" variant={"error"} />
    <form class="mt-6">
        <div class="flex flex-col gap-6">
            <div class="grid gap-2">
                <Label for="username">Username</Label>
                <Input bind:value={username} id="username" type="text" placeholder="username" required />

                <Label for="email">Email</Label>
                <Input bind:value={email} id="email" type="email" placeholder="user@gmail.com" required />

                <div class="flex items-center h-4">
                    <Label for="password">Password</Label>
                    {#if isLoggingIn}
                    <a
                        transition:fade={{duration: 100}}
                        href="##"
                        class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                    Forgot your password?
                    </a>
                    {/if}
                </div>
                <Input bind:value={password} id="password" type="password" placeholder="*********" required />
                {#if !isLoggingIn}
                    <Label for="repeat-password">Repeat password</Label>
                    <Input aria-invalid={!!repeatPassword && repeatPassword !== password} bind:value={repeatPassword} id="repeat-password" type="password" placeholder="*********" required />
                {/if}
            </div>
        </div>
    </form>

    <Button onclick={() => {
        buttonLoadingState = true;
        isLoggingIn ? logIn() : signUp()
     }} loading={buttonLoadingState} disabled={!actionButtonDisabled} type="submit" class="w-full mt-4">Login</Button>  
    
    <a onclick={_ => isLoggingIn = !isLoggingIn} href="##" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
    Sign up instead
    </a>
</div>

<div class="m-auto mt-12 w-fit" data-sitekey="0x4AAAAAABiGbbOhSUc5vWl9" data-theme="dark" id="turnstile-container"></div>
