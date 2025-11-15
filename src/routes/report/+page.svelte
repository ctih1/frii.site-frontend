<script lang="ts">
	import { m } from "../../paraglide/messages";
</script>

<div class="bg-card mt-8 mr-auto ml-auto w-11/12 max-w-4xl rounded-xl p-4">
	<h1 class="text-2xl font-semibold">{m.security_report_what_would_you_like_to_report()}</h1>
	<div class="options flex flex-col">
		<a href="https://forms.gle/Lyi54cdLb5dUNnyU8">{m.security_report_vulnerability()}</a>
		<a href="https://github.com/ctih1/frii.site-frontend/issues/new">{m.security_report_bug()}</a>
		<a href="https://forms.gle/Ct7fLpkMHSk2zqJdA">{m.security_report_abuse()}</a>
	</div>
</div>

<style>
	.options * {
		margin-top: 1em;
	}
</style>
