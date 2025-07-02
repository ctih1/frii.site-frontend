<script lang="ts">
	import { goto } from "$app/navigation";
	import Github from "$lib/assets/github.svg";
	import Footer from "$lib/components/Footer.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { fade } from "svelte/transition";
	import MaterialSymbolsCheckCircleRounded from "~icons/material-symbols/check-circle-rounded";
	import MaterialSymbolsKeyboardArrowDownRounded from "~icons/material-symbols/keyboard-arrow-down-rounded";
	import { localizeHref } from "../paraglide/runtime.js";

	//@ts-ignore

	let { data } = $props();

	let scrollY: number = $state(0);
</script>

<svelte:head>
	<title>frii.site - Register subdomains for free!</title>
</svelte:head>

<svelte:window bind:scrollY={scrollY} />

<div class="content pb-44">
	<div class="introduction flex h-screen w-screen items-center p-10">
		<div class="description w-3/5">
			<h1 class="ml-8 w-fit text-9xl font-bold">frii.site</h1>
		</div>
		<div class="right-side mr-8 h-fit w-2/5 items-center">
			<p class="about-us text-3xl leading-10 font-semibold">
				Modern free subdomain service for developers, project managers, and regular people.
			</p>

			<div class="details mt-12 mb-12 flex w-full justify-between text-3xl">
				<div class="item flex">
					<MaterialSymbolsCheckCircleRounded class=" text-blue-600" />
					<Label class="text-lg">100% free</Label>
				</div>
				<div class="item flex">
					<MaterialSymbolsCheckCircleRounded class="text-blue-600" />
					<Label class="text-lg">Modern UI</Label>
				</div>
				<div class="item flex">
					<MaterialSymbolsCheckCircleRounded class="text-blue-600" />
					<Label class="text-lg">Independent control</Label>
				</div>
			</div>
			<div class="actions mt-auto mb-0 flex space-x-2">
				<Button onclick={_ => goto(localizeHref("/login?register=true"))} class="w-1/2"
					>Sign up now</Button>
				<Button
					variant={"secondary"}
					onclick={_ => goto(localizeHref("/dashboard"))}
					class="w-1/2">Go to the dashboard</Button>
			</div>
		</div>
	</div>

	<div class="selling-points mt-64">
		<div class="free flex">
			<div class="text ml-32 w-3/5">
				<h2 class="w-fit text-5xl font-semibold">Always free</h2>
				<p class="mt-4 text-xl">
					frii.site has, and will always be free to use for everyone. Our main goal is to
					provide free domains to users who cannot buy their own domains. However, even if
					you do own a domain, you're welcome to use our service!
				</p>
				<Button class="mt-6" href={localizeHref("/terms/domains")} variant={"outline"}
					>Read our domain guidelines</Button>
			</div>
			<div class="visual w-2/5"></div>
		</div>
	</div>

	<div class="selling-points mt-64">
		<div class="services flex">
			<div class="visual ml-32 w-2/5"></div>
			<div class="text mr-32 w-3/5">
				<h2 class="w-fit text-5xl font-semibold">Support for many services</h2>
				<p class="mt-4 text-xl">
					frii.site has support for multiple services, such as Vercel. Most services that
					simply require a domain are supported, but certain services, such as
					Cloudflare's DNS, require you to use a real domain.
				</p>

				<Separator class="mt-4 mb-4" />
				<p>Related:</p>
				<Button href="https://guides.frii.site/guides/vercel.html" variant={"ghost"}
					>How to setup Vercel</Button>
			</div>
		</div>
	</div>

	<div class="selling-points mt-64">
		<div class="management flex">
			<div class="text ml-32 w-3/5">
				<h2 class="w-fit text-5xl font-semibold">Independent domain management</h2>
				<p class="mt-4 text-xl">
					You can register, delete, and modify domains straight from our dashboard. No
					need to use a convoluted CLI or a request form. Domain registrations are done
					immediately, so you don't have to wait for someone to verify your domain.
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
				<h2 class="w-fit text-5xl font-semibold">Completely open source</h2>
				<p class="mt-4 text-xl">
					Our frontend and backend are both completely open source, and open to
					contributions. Our backend uses fully typed Python code, FastAPI, and MongoDB,
					which makes it easy for other developers to quickly jump into our codebase. Our
					frontend is written in Svelte (with Typescript).
				</p>

				<Separator class="mt-4 mb-4" />
				<p>See more:</p>
				<Button
					href="https://guides.frii.site/translation/getting_started.html"
					variant={"secondary"}>Translate frii.site into your language</Button>
				<Button href="https://github.com/ctih1/frii.site-frontend" variant={"ghost"}
					>Our frontend repo</Button>
				<Button href="https://github.com/ctih1/frii.site-backend" variant={"ghost"}
					>Our backend repo</Button>
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
		background-color: rgb(17, 17, 31);
		background:
			radial-gradient(
				circle at -25% -25%,
				lch(61.66% 59.87 273.43 / 0.712) 0%,
				lch(2.43% 2.83 273.1) 85%
			),
			url("data:image/svg+xml,%3Csvg viewBox='0 0 362 362' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='10' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
	}

	@media (max-width: 900px), (orientation: portrait) {
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

		.visual {
			display: none;
		}

		.text {
			width: 90%;
			margin-left: auto;
			margin-right: auto;
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
