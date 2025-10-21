<script lang="ts">
	import consola from "consola";
	import { onMount } from "svelte";

	onMount(() => {
		//@ts-ignore
		turnstile.ready(function () {
			let container = document.getElementById("turnstile-container");

			if (container) {
				container.innerHTML = "";
			}
			// @ts-ignore
			widgetId = turnstile.render("#turnstile-container", {
				sitekey: "0x4AAAAAABiGbbOhSUc5vWl9",
				callback: function (token: string) {
					// @ts-ignore
					if (window.webkit) {
						// @ts-ignore
						window.webkit?.messageHandlers.turnstile.postMessage(token);
					}
					consola.info("Solved captcha");
				}
			});
		});
	});
</script>

<svelte:head>
	<link
		rel="preload"
		href="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
		as="script" />
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
</svelte:head>

<div id="turnstile-container"></div>
