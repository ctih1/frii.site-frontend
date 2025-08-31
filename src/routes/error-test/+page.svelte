<script>
	import { browser, dev } from "$app/environment";
	import { error } from "@sveltejs/kit";

	if (browser && dev) {
		throw new Error("Failed to test");
	}

	if (!dev) {
		error(404, { message: "Not found" });
	}
</script>

<h1>HEllo</h1>
