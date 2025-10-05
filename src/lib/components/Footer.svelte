<script lang="ts">
	import { m } from "../../paraglide/messages";
	import { serverURL } from "../../serverContactor";
	import Separator from "./ui/separator/separator.svelte";

	const commit = __BUILD_COMMIT__;
	const time = __BUILD_TIME__;
</script>

<div class="footer bg-footer pt-8">
	<div class="contact">
		<h3 class="text-lg font-medium">{m.footer_contact()}</h3>
		<Separator />

		<a href="mailto: support@frii.site">{m.footer_contact_support()}</a>
		<a href="mailto: urgent@frii.site">{m.footer_contact_urgent()}</a>
		<a href="mailto: support@frii.site">{m.footer_contact_social()}</a>
		<a href="https://discord.gg/FjujyhvbMY">{m.footer_contact_discord()}</a>
	</div>
	<div class="starting">
		<h3 class="text-lg font-medium">{m.footer_started()}</h3>
		<Separator />
		<a href="https://github.com/ctih1/frii.site-frontend/wiki/FAQ">{m.footer_started_faq()}</a>
		<a href="https://github.com/ctih1/frii.site-frontend/wiki/Getting-Started#getting-started"
			>{m.footer_started_register()}</a>
		<a
			href="https://github.com/ctih1/frii.site-frontend/wiki/Getting-Started#managing-your-domains"
			>{m.footer_started_modify()}</a>
		<a
			href="https://github.com/ctih1/frii.site-frontend/wiki/Getting-Started#account-management"
			>{m.footer_started_account()}</a>
		<a href="https://github.com/ctih1/frii.site-frontend/wiki/API">{m.footer_started_api()}</a>
	</div>
	<div class="dev">
		<h3 class="text-lg font-medium">{m.footer_dev()}</h3>
		<Separator />
		<a href="https://github.com/ctih1/frii.site-frontend/wiki/Translation-guide"
			>{m.footer_dev_translations()}</a>
		<a href="https://github.com/ctih1/frii.site-frontend/blob/master/.github/CONTRIBUTING.md"
			>{m.footer_dev_coding()}</a>
		<a href="https://github.com/ctih1/frii.site-frontend/discussions/67"
			>{m.footer_dev_partner()}</a>
		<p style="margin: 0px;">Using server {serverURL}</p>
		<p style="margin: 0px;">Commit {commit}</p>
		<p style="margin: 0px;">Built {time}</p>
	</div>
</div>

<style>
	.footer {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(auto, 1fr);
		max-width: 100vw;
		width: 100%;
		padding-bottom: 2em;
		text-align: center;
	}
	.footer * {
		display: flex;
		flex-direction: column;
	}
	a {
		color: var(--color-foreground);
		text-decoration: underline;
		width: fit-content;
		margin-right: auto;
		margin-left: auto;
	}

	@media (orientation: portrait) {
		.footer {
			display: flex;
			flex-direction: column;
		}
	}
</style>
