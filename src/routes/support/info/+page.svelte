<script lang="ts">
	import { browser } from "$app/environment"
	import { getAuthToken, ServerContactor, serverURL } from "$lib"
	import Button from "$lib/components/Button.svelte"
	import Holder from "$lib/components/Holder.svelte"
	import copy from "clipboard-copy"

	const commit = __BUILD_COMMIT__
	const time = __BUILD_TIME__

	let deviceWidth: number
	let deviceHeight: number
	let useragent: string
	let usingServer: string
	let userId: string = ""

	let code: HTMLElement

	if (browser) {
		deviceHeight = window.innerHeight
		deviceWidth = window.innerWidth
		useragent = navigator.userAgent

		const serverContactor = new ServerContactor(
			getAuthToken(),
			localStorage.getItem("server_url")
		)

		serverContactor
			.getAccountSettings()
			.catch(error => {
				throw new Error("User not logged in")
			})
			.then(data => {
				userId = data.username
			})
	}
</script>

<Holder>
	<h1>Technical information:</h1>
	<code bind:this={code}>
		commit: {commit}
		server: {serverURL}
		width: {deviceWidth}
		height: {deviceHeight}
		ua: {useragent}
		uid: {userId}
	</code>
	<Button args="padding" on:click={_ => copy(code.innerText)}>Copy to clipboard</Button>
</Holder>
