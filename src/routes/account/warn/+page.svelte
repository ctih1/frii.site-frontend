<script lang="ts">
	import { page } from "$app/stores";
	import Holder from "$lib/components/Holder.svelte";
	import { m } from "../../../paraglide/messages";

	const reason: string = $page.url.searchParams.get("reason") ?? "";
	let warningText: string = "";

	switch (reason) {
		case "permission":
		case "feature":
			warningText = m.account_permissions_lack();
			break;
	}
</script>

<Holder>
	<h1>{m.account_uhoh_annoyance()}</h1>
	<p>{warningText}</p>
</Holder>
