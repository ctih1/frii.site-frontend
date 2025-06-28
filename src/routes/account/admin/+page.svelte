<script lang="ts">
	import {
		AuthError,
		ConflictError,
		digestMessage,
		DNSError,
		getAuthToken,
		PermissionError,
		redirectToLogin,
		ServerContactor,
		UserError
	} from "$lib";
	import Button from "$lib/components/Button.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import Holder from "$lib/components/Holder.svelte";
	import Loader from "$lib/components/Loader.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Section from "$lib/components/Section.svelte";
	import { onMount } from "svelte";
	import type { components } from "../../../api";
	import { m } from "../../../paraglide/messages";

	// You can create a type alias for easier use
	type AccountData = components["schemas"]["AccountData"];

	let collectedUserData: AccountData[] = $state([]);
	let searchString: string = $state("");
	let serverContactor: ServerContactor;
	let modal: Modal;
	let loader: Loader;
	let deletionBegin: boolean = $state(false);
	let reasons: string = $state("");

	let newPermissionKey: string = $state("");
	let newPermissionValue: string = $state("");

	let hasAccess: boolean = $state(false);

	$effect(() => {
		console.log(reasons.split("\n"));
	});

	onMount(() => {
		serverContactor = new ServerContactor(getAuthToken());
		serverContactor
			.canUseAdminPanel()
			.catch(error => {
				if (error instanceof AuthError) {
					redirectToLogin(460);
				} else if (error instanceof PermissionError) {
					redirectToLogin(461);
				} else {
					redirectToLogin(500);
				}
				throw new Error("Failed to access admin dashboard");
			})
			.then(_ => {
				hasAccess = true;
			});
	});

	function stringIntoPermissionValueType(input: string): string | number | boolean {
		if (input === "false" || input === "true") return input === "true";
		if (Number(input)) return Number(input);
		return input;
	}

	function terminateAccount(id: string) {
		loader.show();
		serverContactor
			.deleteAccountAdmin(id, reasons.split("\n"))
			.catch(error => {
				loader.hide();
				if (error instanceof PermissionError) redirectToLogin(461);
				if (error instanceof AuthError) redirectToLogin(460);
				if (error instanceof DNSError)
					modal.open("Failed to delete user", "Failed to delete certain domains");
				throw new Error("Failed to delete");
			})
			.then(_ => {
				loader.hide();
				modal.open("Deleted user successfully", "");
			});
	}

	function reinstateAccount(id: string) {
		loader.show();
		serverContactor
			.reinstateAccount(id)
			.catch(error => {
				loader.hide();
				if (error instanceof PermissionError) redirectToLogin(461);
				if (error instanceof AuthError) redirectToLogin(460);
				if (error instanceof DNSError)
					modal.open(
						"Account reinstated but action required",
						"Failed to recover DNS records."
					);
				if (error instanceof ConflictError) {
					modal.open("User is already unbanned", "");
				}
				throw new Error("Failed to delete");
			})
			.then(_ => {
				loader.hide();
				modal.open("Reinstated user successfully", "");
			});
	}

	function updatePermission(id: string, permission: string, value: number | string | boolean) {
		console.debug(`Updating permission ${permission}->${value} (${typeof value})`);
		loader.show();
		serverContactor
			.updatePermission(id, permission, value)
			.catch(error => {
				loader.hide();
				if (error instanceof PermissionError) redirectToLogin(461);
				if (error instanceof AuthError) redirectToLogin(460);
				throw new Error("Failed to delete");
			})
			.then(_ => {
				loader.hide();
				modal.open("Updated value succesfully", `${permission} -> ${value}`);
			});
	}

	function sha256usernameThenLoad() {
		digestMessage(searchString).then(hash => {
			loadByUsername(hash);
		});
	}

	function loadByUsername(id: string) {
		loader.show();
		serverContactor
			.findById(id)
			.catch(error => {
				loader.hide();
				if (error instanceof AuthError) redirectToLogin(460);
				if (error instanceof PermissionError) redirectToLogin(461);
				if (error instanceof UserError)
					modal.open("No matches found", "your query returned no matches");
				throw new Error("Failed to get user data");
			})
			.then(data => {
				loader.hide();
				collectedUserData = [data!];
			});
	}

	function loadByDomain(domain: string) {
		loader.show();
		serverContactor
			.findByDomain(domain)
			.catch(error => {
				loader.hide();
				if (error instanceof AuthError) redirectToLogin(460);
				if (error instanceof PermissionError) redirectToLogin(461);
				if (error instanceof UserError)
					modal.open("No matches found", "your query returned no matches");
				throw new Error("Failed to get user data");
			})
			.then(data => {
				loader.hide();
				collectedUserData = [data!];
			});
	}

	function loadByEmail(email: string) {
		loader.show();
		serverContactor
			.findByEmail(email)
			.catch(error => {
				loader.hide();
				if (error instanceof AuthError) redirectToLogin(460);
				if (error instanceof PermissionError) redirectToLogin(461);
				if (error instanceof UserError)
					modal.open("No matches found", "your query returned no matches");
				throw new Error("Failed to get user data");
			})
			.then(data => {
				loader.hide();
				collectedUserData = [data!];
			});
	}
</script>

<Modal bind:this={modal} options={[m.modal_ok()]} description={""} title={""}></Modal>
<Loader bind:this={loader} />
<Holder>
	{#if hasAccess}
		<h1>Admin tools</h1>

		<Section id="search" title="Search">
			<input bind:value={searchString} id="finder" placeholder="Search term" />
			<div class="search-buttons">
				<Button on:click={_ => sha256usernameThenLoad()} args={"padding"}
					>Find user by name</Button>
				<Button on:click={_ => loadByUsername(searchString)} args={"padding"}
					>Find user by id</Button>
				<Button on:click={_ => loadByDomain(searchString)} args={"padding"}
					>Find user by domain</Button>
				<Button on:click={_ => loadByEmail(searchString)} args={"padding"}
					>Find user by email</Button>
			</div>
		</Section>

		<Section id="manage" title="Manage">
			{#if collectedUserData.length < 1}
				<p>Please collect data to manage users.</p>
			{/if}
			{#each collectedUserData as user}
				{@const createdAt = new Date(user.created * 1000)}
				{@const obj = Object.keys(user.domains)}

				<div class="user">
					<h2 class={user.banned ? "danger" : ""}>
						{user.username}
						{#if user.banned}
							(banned)
						{/if}
					</h2>
					<p>From: {user.country.country} ({user.country.city}, locale: {user.lang})</p>
					<p>Enrolled in beta? {user["beta-enroll"] ?? false}</p>
					<p>
						Email: <a href={`mailto:${user.email}`}>{user.email}</a> ({user.verified
							? "verified"
							: "not verified"})
					</p>
					<p>Created at {createdAt}</p>
					<p>Last login: {new Date(user.last_login * 1000)}</p>
					<p>Active sessions: {user.sessions.length}</p>
					<h4>Permission</h4>
					{#each Object.keys(user.permissions) as permission}
						<div class="permission">
							<p class="permission-key">{permission} -&gt;</p>
							{#if typeof user.permissions[permission] === "boolean"}
								<div class="permission-value">
									<Dropdown
										options={["true", "false"]}
										defaultValue={user.permissions[permission]}
										disabled={false}
										on:optionchange={e =>
											(user.permissions[permission] = e.detail === "true")}
									></Dropdown>
								</div>
							{:else}
								<input
									class="permission-value"
									bind:value={user.permissions[permission]} />
							{/if}
							<div class="permission-button">
								<Button
									on:click={_ =>
										updatePermission(
											user.id,
											permission,
											user.permissions[permission] ?? 0
										)}
									args={"padding"}>Update</Button>
							</div>
						</div>
					{/each}
					<div class="permission">
						<input bind:value={newPermissionKey} placeholder="key" />
						<input bind:value={newPermissionValue} placeholder="value" />
						<div class="permission-button">
							<Button
								on:click={_ =>
									updatePermission(
										user.id,
										newPermissionKey,
										stringIntoPermissionValueType(newPermissionValue)
									)}
								args={"padding"}>Create</Button>
						</div>
					</div>
					{#each obj as key}
						{@const val = user.domains[key]}
						<h4>{key.replaceAll("[dot]", ".")}.frii.site</h4>
						<div class="domain-info">
							<input class="domain-type" disabled value={val?.type} />
							<input disabled value={val?.ip} />
						</div>
					{/each}
					{#if deletionBegin}
						<textarea placeholder="Reasons. Seperate by newlines" bind:value={reasons}
						></textarea>
					{/if}
					{#if !user.banned}
						<Button
							args={"padding danger"}
							on:click={_ =>
								!deletionBegin ? (deletionBegin = true) : terminateAccount(user.id)}
							>Terminate account</Button>
					{:else}
						<Button args={"padding"} on:click={_ => reinstateAccount(user.id)}
							>Reinstate account</Button>
					{/if}
				</div>
			{/each}
		</Section>
	{:else}
		<h1>Checking permissions...</h1>
	{/if}
</Holder>

<style>
	.search-buttons {
		display: flex;
	}
	:global(.search-buttons button) {
		margin: 4px;
	}
	#finder {
		height: 3em;
		background-color: rgb(40, 40, 40);
		font-size: large;
	}
	.domain-type {
		width: 20%;
	}
	.domain-info {
		display: flex;
	}
	h4 {
		margin-bottom: 0px;
	}
	.domain-info input {
		height: 3em;
		background-color: rgb(40, 40, 40);
	}

	textarea {
		background-color: rgb(40, 40, 40);
		border-radius: 0.5em;
		color: white;
		font-size: 16px;
	}

	.user p {
		margin: 4px;
	}

	.danger {
		color: rgb(200, 17, 17);
	}
	.permission {
		display: flex;
		margin-bottom: 12px;
		padding: 4px;
	}
	.permission:nth-child(even) {
		background-color: rgb(40, 40, 40);
	}
	.permission-value {
		width: 50%;
		background-color: rgb(40, 40, 40);
	}
	.permission-key {
		width: fit-content;
	}
	.permission-button {
		margin-left: auto;
		margin-right: 0px;
	}
</style>
