<script lang="ts">
	import { goto } from "$app/navigation";
	import { domainAvailable } from "$lib";
	import Github from "$lib/assets/github.svg";
	import Footer from "$lib/components/Footer.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import Loader from "$lib/components/ui/loader/loader.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { fade } from "svelte/transition";
	import MaterialSymbolsCheckCircleRounded from "~icons/material-symbols/check-circle-rounded";
	import MaterialSymbolsKeyboardArrowDownRounded from "~icons/material-symbols/keyboard-arrow-down-rounded";
	import { m } from "../paraglide/messages.js";
	import { localizeHref } from "../paraglide/runtime.js";

	let placeholderMessages = ["project", "username", "something-cool", "important", "personal"];

	let testDomain: string = $state("");
	let placeholderInputFocused: boolean = $state(false);
	let testPlaceholder: string = $state(placeholderMessages[0]!);
	let placeholderIndex = 1;
	let timeoutId: ReturnType<typeof setTimeout>;
	let isTestAvailable: boolean = $state(false);
	let checkingDomainAvailability: boolean = $state(false);
	let latestCheckedDomain = $state("");

	let { data } = $props();

	let scrollY: number = $state(0);

	setInterval(() => {
		if (placeholderIndex > placeholderMessages.length - 1) {
			placeholderIndex = 0;
		}
		testPlaceholder = placeholderMessages[placeholderIndex]!;

		placeholderIndex++;
	}, 1500);

	function getDomainAvailability() {
		if (latestCheckedDomain === testDomain || !testDomain) return;
		checkingDomainAvailability = true;

		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(async () => {
			isTestAvailable = await domainAvailable(testDomain + ".frii.site");
			checkingDomainAvailability = false;
			latestCheckedDomain = testDomain;
		}, 600);
	}
</script>

<svelte:head>
	<title>frii.site - Register subdomains for free!</title>
</svelte:head>

<svelte:window bind:scrollY={scrollY} />

<div class="content pb-44">
	<div class="introduction flex min-h-screen w-screen items-center p-10">
		<div class="description w-3/5">
			<h1 class="ml-8 w-fit text-9xl font-bold">frii.site</h1>
		</div>
		<div class="right-side mr-8 h-fit w-2/5 items-center">
			<p class="about-us text-3xl leading-10 font-semibold">
				{m.home_description()}
			</p>

			<div
				class="details mt-12 mb-12 flex w-full justify-between text-3xl [&>div]:items-center">
				<div class="item flex">
					<MaterialSymbolsCheckCircleRounded class=" h-8 text-blue-600" />
					<Label class="text-lg">{m.home_talking_point_1()}</Label>
				</div>
				<div class="item flex">
					<MaterialSymbolsCheckCircleRounded class="h-8 text-blue-600" />
					<Label class="text-lg">{m.home_talking_point_2()}</Label>
				</div>
				<div class="item flex">
					<MaterialSymbolsCheckCircleRounded class="h-8 text-blue-600" />
					<Label class="text-lg">{m.home_talking_point_3()}</Label>
				</div>
			</div>
			<div class="actions mt-auto mb-0 flex justify-between">
				<Button onclick={_ => goto(localizeHref("/login?register=true"))} class="w-[49%]"
					>{m.home_signup_action()}</Button>
				<Button
					variant={"secondary"}
					onclick={_ => goto(localizeHref("/dashboard"))}
					class="w-[49%]">{m.index_goto_dashboard()}</Button>
			</div>
		</div>
	</div>

	<div class="selling-points mt-16">
		<div class="services flex">
			<div class="visual ml-32 w-2/5"></div>
			<div class="text mr-32 w-3/5 rounded-2xl border-2 bg-white/5 p-4">
				<h1 class="mb-2 text-5xl font-semibold">{m.index_test_header()}</h1>
				<p class="text-lg">{@html m.index_test_description()}</p>

				<div class="flex items-center pt-2 pb-2">
					<div class="absolute">
						<Input
							onkeyup={_ => getDomainAvailability()}
							onfocus={_ => (placeholderInputFocused = true)}
							onfocusout={_ => (placeholderInputFocused = false)}
							bind:value={testDomain}
							type="text"
							class="w-48" />
					</div>
					{#if !testDomain && !placeholderInputFocused}
						{#key testPlaceholder}
							<span
								transition:fade={{ duration: 150 }}
								class="pointer-events-none absolute ml-4 w-48 opacity-90">
								{testPlaceholder}
							</span>
						{/key}
					{/if}
					<span class="ml-48 text-lg">.frii.site</span>
				</div>

				{#if checkingDomainAvailability}
					<Loader className="w-8" asForeground={true} />
				{:else if testDomain && latestCheckedDomain === testDomain}
					<div class="domain-results">
						{#if isTestAvailable}
							<h1 class="mt-4 text-2xl font-semibold">
								{@html m.index_test_result_positive({ domain: testDomain })}
							</h1>
							<Button
								class="mt-2 w-full"
								onclick={_ => goto(localizeHref("/login?register=true"))}
								>{m.home_signup_action()}</Button>
						{:else}
							<h1>
								{@html m.index_test_result_negative({ domain: testDomain })}
							</h1>
							<p class="text-lg">{m.index_test_try_else()}</p>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="selling-points mt-64">
		<div class="free flex">
			<div class="text ml-32 w-3/5">
				<h2 class="w-fit text-5xl font-semibold">{m.home_selling_point_always_free()}</h2>
				<p class="mt-4 text-xl">{m.home_selling_point_always_free_description()}</p>
			</div>
			<div class="visual w-2/5"></div>
		</div>
	</div>

	<div class="selling-points mt-64">
		<div class="services flex">
			<div class="visual ml-32 w-2/5"></div>
			<div class="text mr-32 w-3/5">
				<h2 class="w-fit text-5xl font-semibold">{m.home_selling_point_support()}</h2>
				<p class="mt-4 text-xl">{m.home_selling_point_support_description()}</p>

				<Separator class="mt-4 mb-4" />
				<p>{m.home_related()}</p>
				<Button href="https://guides.frii.site/guides/vercel.html" variant={"ghost"}
					>{m.home_setup_vercel_link()}</Button>
			</div>
		</div>
	</div>

	<div class="selling-points mt-64">
		<div class="management flex">
			<div class="text ml-32 w-3/5">
				<h2 class="w-fit text-5xl font-semibold">{m.home_selling_point_independent()}</h2>
				<p class="mt-4 text-xl">
					{m.home_selling_point_independent_description()}
				</p>
			</div>
			<div class="visual mr-32 w-2/5"></div>
		</div>
	</div>

	<div class="selling-points mt-64">
		<div class="support flex">
			<div class="visual ml-32 w-2/5">
				<img class="w-3/5" alt="github logo" src={Github} />
			</div>
			<div class="text mr-32 w-3/5">
				<h2 class="w-fit text-5xl font-semibold">{m.home_selling_point_open_source()}</h2>
				<p class="mt-4 text-xl">{m.home_selling_point_open_source_description()}</p>

				<Separator class="mt-4 mb-4" />
				<p>{m.home_see_more()}</p>
				<Button
					href="https://guides.frii.site/translation/getting_started.html"
					variant={"secondary"}>{m.home_translate_contribute()}</Button>
				<Button href="https://github.com/ctih1/frii.site-frontend" variant={"ghost"}
					>{m.home_frontend_link()}</Button>
				<Button href="https://github.com/ctih1/frii.site-backend" variant={"ghost"}
					>{m.home_backend_link()}</Button>
			</div>
		</div>
	</div>
</div>

<Footer />

{#if scrollY < 50}
	<div transition:fade={{ duration: 100 }}>
		<MaterialSymbolsKeyboardArrowDownRounded class="absolute top-11/12 left-1/2 text-xl" />
	</div>
{/if}

<style>
	.content {
		background-color: var(--color-background);
		background:
			radial-gradient(circle at -25% -25%, var(--gradient-start) 0%, var(--gradient-end) 85%),
			url("data:image/svg+xml,%3Csvg viewBox='0 0 362 362' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='10' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
	}

	@media (max-width: 1250px) {
		.description {
			width: 40%;
			margin-left: 0px;
		}
		.description h1 {
			margin-left: 0px;
		}
		.right-side {
			width: 50%;
			margin-left: auto;
			margin-right: 24px;
		}
	}

	@media (max-width: 900px), (orientation: portrait) {
		.right-side {
			margin-right: 0px;
		}
		.about-us {
			margin-top: 2rem;
			width: 100%;
			max-width: 38rem;
			text-align: center;
			margin-right: auto;
			margin-left: auto;
		}
		.introduction {
			padding: 0px;
			margin-left: auto;
			margin-right: auto;
			width: 90%;
			padding-top: 30vh;
			flex-direction: column;
		}
		.introduction div {
			width: 100%;
		}
		.description h1 {
			margin-left: auto;
			margin-right: auto;
		}

		.selling-point-dreams {
			margin-top: 12rem;
		}

		.visual {
			display: none;
		}

		.text {
			width: 90%;
			margin-left: auto;
			margin-right: auto;
		}

		h2 {
			font-size: 2.75em;
		}
	}

	@media (max-width: 600px) {
		.description h1 {
			font-size: 6em;
		}
		.about-us {
			font-size: 1.5em;
			line-height: normal;
		}

		.details {
			margin-left: 12px;
			width: fit-content;
			flex-direction: column;
		}
	}
</style>
