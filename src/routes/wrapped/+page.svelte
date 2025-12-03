<script lang="ts">
	import { getAuthToken, ServerContactor } from "$lib";
	import Holder from "$lib/components/Holder.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Loader from "$lib/components/ui/loader/loader.svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let serverContactor: ServerContactor | undefined;
	let data: Awaited<ReturnType<ServerContactor["getWrapped"]>> | undefined = $state();

	function ordinal(i: number): string {
		let j = i % 10,
			k = i % 100;
		if (j === 1 && k !== 11) {
			return i + "st";
		}
		if (j === 2 && k !== 12) {
			return i + "nd";
		}
		if (j === 3 && k !== 13) {
			return i + "rd";
		}
		return i + "th";
	}

	function adaptiveFormat(n: number) {
		const length = Math.floor(Math.abs(n)).toString().length;

		if (length <= 1) {
			return parseFloat(n.toFixed(2));
		} else {
			return Math.round(n);
		}
	}

	onMount(async () => {
		serverContactor = new ServerContactor(getAuthToken()!);

		data = await serverContactor.getWrapped();
	});
</script>

<Holder>
	<h1 class="text-3xl font-semibold">frii.site wrapped</h1>
	{#if !data}
		<div transition:fade class="w-80">
			<p class="flex items-center">Loading <Loader className="ml-2" asForeground /></p>
		</div>
	{:else}
		{@const createDate = new Date(data.account_created * 1000)}
		{@const daysSinceCreation = Math.floor(
			Math.abs(new Date().getTime() - createDate.getTime()) / (1000 * 60 * 60 * 24)
		)}
		{@const nthAccount = data.total_users - data.accounts_made_after}

		<div class="mt-16 space-y-16">
			<div>
				<h2 class="text-3xl font-semibold">
					You created your account in <span class="text-primary"
						>{createDate.getFullYear()}</span
					>!
				</h2>
				<p class="text-foreground/50">(specifically {createDate.toLocaleString()})</p>
				<h3 class="text-xl font-semibold">
					That's {daysSinceCreation} days ago!
				</h3>
				<p class="text-lg">
					<b>To put that into perspective</b>, your heart has beaten around
					<b>{daysSinceCreation * 103680}</b> times since you created your account.
				</p>
				<h3 class="mt-2">
					Your acount is older than {Math.round(
						100 -
							((data.total_users - data.accounts_made_after) / data.total_users) * 100
					)}% of frii.site accounts!
				</h3>
			</div>

			<div>
				<h2 class="text-3xl font-semibold">
					You registered <span class="text-primary">{data.domains_registered}</span> domains!
				</h2>
				<p>
					{#if data.domains_registered === 0}
						That's fine - we don't judge!
					{:else if data.domains_registered === 1}
						Who needs multiple domains when you have a single great project!
					{:else if data.domains_registered === 2}
						You're above average! The average frii.site user has 1.9 domains.
					{:else if data.domains_registered === 3}
						Third time's the charm!
					{:else if data.domains_registered === 4}
						You're really making the most out of your account!
					{:else if data.domains_registered === 5}
						You're going to need a secretary soon
					{:else if data.domains_registered > 6}
						Wow, that's a lot. Save some for the rest of us!
					{/if}
				</p>
			</div>

			<div>
				<h2 class="text-3xl font-semibold">
					Your account was the <span class="text-primary">{ordinal(nthAccount)}</span> ever
					created!
				</h2>
				<h3 class="text-lg">
					We have around <b
						>{adaptiveFormat(((data.accounts_made_after / nthAccount) * 100) / 100)}
						times</b> as many users as when you initially made your account.
				</h3>
				<p>
					Whether you were the first to join, or the last to arrive, we're grateful you're
					here!
				</p>
				<Button variant="link" href="https://ko-fi.com/ctih1/link/WRAPPED25"
					>Here's a coupon to get 100% off from our domains! Valid until December 31st,
					2025
				</Button>
			</div>

			<div>
				<h2 class="text-3xl font-semibold">
					You have logged in from <span class="text-primary">{data.unique_ips}</span> unique
					IPs!
				</h2>
				<h3 class="text-xl font-semibold">
					{#if data.unique_ips > 50}
						Captain Worldwide I see
					{:else if data.unique_ips > 30}
						Quite the traveller!
					{:else if data.unique_ips > 20}
						That's quite a few!
					{:else if data.unique_ips > 10}
						Staying local I see
					{/if}
				</h3>
				<p>
					On average, you used an IP for about {Math.round(
						daysSinceCreation / data.unique_ips
					)} days before getting a new one
				</p>
			</div>

			<div>
				<h2 class="text-3xl font-semibold">
					You have visited <span class="text-primary"
						>{window ? (localStorage.getItem("views") ?? 0) : 0}</span> pages here!
				</h2>
				<p class="text-lg font-semibold">
					If we were earning ad-revenue, we could have earned about ${Math.round(
						((window ? (Number(localStorage.getItem("views")) ?? 0) : 0) / 30) * 100
					) / 100} from you!
				</p>
			</div>
		</div>
	{/if}
</Holder>
