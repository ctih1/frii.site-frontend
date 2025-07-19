<script lang="ts">
	import {
		AuthError,
		ConflictError,
		DNSError,
		getAuthToken,
		PermissionError,
		redirectToLogin,
		ServerContactor,
		UserError
	} from "$lib";
	import Holder from "$lib/components/Holder.svelte";
	import Loader from "$lib/components/Loader.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Section from "$lib/components/Section.svelte";
	import * as Accordion from "$lib/components/ui/accordion/index.js";
	import { Button } from "$lib/components/ui/button";
	import Input from "$lib/components/ui/input/input.svelte";
	import * as Select from "$lib/components/ui/select/index.js";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { UAParser } from "ua-parser-js";
	import type { components } from "../../../api";
	import { m } from "../../../paraglide/messages";
	import { getLocale } from "../../../paraglide/runtime";

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

	let loading: boolean = $state(false);

	let domainDeleteReason = $state("");

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

	function deleteDomain(domain: string, userId: string, reason: string) {
		serverContactor
			.adminDeleteDomain(userId, domain, reason)
			.catch(error => {
				if (error instanceof PermissionError) redirectToLogin(461);
				if (error instanceof AuthError) redirectToLogin(460);
				throw new Error("failed to delete domain");
			})
			.then(_ => toast.success("Deleted domain succesfully"));
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

	function loadByUsername(username: string) {
		loading = true;
		serverContactor
			.findByUsername(username)
			.catch(error => {
				loading = false;
				if (error instanceof AuthError) redirectToLogin(460);
				if (error instanceof PermissionError) redirectToLogin(461);
				if (error instanceof UserError)
					modal.open("No matches found", "your query returned no matches");
				throw new Error("Failed to get user data");
			})
			.then(data => {
				loading = false;
				collectedUserData = [data!];
			});
	}

	function loadById(id: string) {
		loading = true;
		serverContactor
			.findById(id)
			.catch(error => {
				loading = false;
				if (error instanceof AuthError) redirectToLogin(460);
				if (error instanceof PermissionError) redirectToLogin(461);
				if (error instanceof UserError)
					modal.open("No matches found", "your query returned no matches");
				throw new Error("Failed to get user data");
			})
			.then(data => {
				loading = false;
				collectedUserData = [data!];
			});
	}

	function loadByDomain(domain: string) {
		loading = true;
		serverContactor
			.findByDomain(domain)
			.catch(error => {
				loading = false;
				if (error instanceof AuthError) redirectToLogin(460);
				if (error instanceof PermissionError) redirectToLogin(461);
				if (error instanceof UserError)
					modal.open("No matches found", "your query returned no matches");
				throw new Error("Failed to get user data");
			})
			.then(data => {
				loading = false;
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
		<h1 class="text-2xl font-semibold">Admin tools</h1>

		<div class="space-y-2">
			<p class="text-sm">Search</p>
			<Input bind:value={searchString} id="finder" placeholder="Search term" />
			<div class="search-buttons flex justify-between [&>button]:w-1/5">
				<Button loading={loading} onclick={_ => loadByUsername(searchString)}
					>Find user by name</Button>
				<Button loading={loading} onclick={_ => loadById(searchString)}
					>Find user by id</Button>
				<Button loading={loading} onclick={_ => loadByDomain(searchString)}
					>Find user by domain</Button>
				<Button loading={loading} onclick={_ => loadByEmail(searchString)}
					>Find user by email</Button>
			</div>
		</div>

		<Section id="manage" title="Manage">
			{#if collectedUserData.length < 1}
				<p>Please collect data to manage users.</p>
			{/if}
			{#each collectedUserData as user}
				{@const createdAt = new Date(user.created * 1000)}
				{@const obj = Object.keys(user.domains)}

				<div class="user">
					<h2 class={`${user.banned ? "text-red-600" : ""} text-2xl font-semibold`}>
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

					<Accordion.Root type="single">
						<Accordion.Item>
							<Accordion.Trigger
								><h2 class="text-xl font-semibold">
									Sessions ({user.sessions.length})
								</h2></Accordion.Trigger>
							<Accordion.Content>
								<Accordion.Root type="multiple">
									{#each user.sessions as session}
										{@const date = new Date(session.expires * 1000)}
										{@const ua =
											"user-agent" in session
												? new UAParser(session["user-agent"])
												: "agent" in session
													? new UAParser(session["agent"])
													: new UAParser("")}
										<Accordion.Item>
											<Accordion.Trigger>
												({"user-agent" in session ? "Old" : "New"})
												{ua.getBrowser().name}
												{ua.getDevice().vendor}
												{date.toLocaleString(getLocale())}
											</Accordion.Trigger>
											<Accordion.Content>
												{#if "user-agent" in session}
													<p>{session["user-agent"]}</p>
												{:else if "agent" in session}
													<p>{session.agent}</p>
													<p>
														Created: {new Date(
															session.created * 1000
														).toLocaleString(getLocale())}
													</p>
												{/if}
												<p>ip: {session.ip}</p>
											</Accordion.Content>
										</Accordion.Item>
									{/each}
								</Accordion.Root>
							</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>

					<Accordion.Root type="single">
						<Accordion.Item>
							<Accordion.Trigger
								><h2 class="text-xl font-semibold">
									Accessed from ({user.accessed_from.length})
								</h2></Accordion.Trigger>
							<Accordion.Content>
								<Accordion.Root type="multiple">
									{#each user.accessed_from as ip}
										<p>{ip}</p>
									{/each}
								</Accordion.Root>
							</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>

					<h4 class="text-xl font-semibold">Permission</h4>
					{#each Object.keys(user.permissions) as permission}
						<div class="permission flex max-w-full items-center space-y-2 space-x-2">
							<p class="permission-key">{permission} -&gt;</p>
							{#if typeof user.permissions[permission] === "boolean"}
								<Select.Root
									onValueChange={value =>
										(user.permissions[permission] = value === "true")}
									type="single"
									name="domain">
									<Select.Trigger class="w-1/8 min-w-24"
										>{user.permissions[permission]
											? "Yes"
											: "No"}</Select.Trigger>
									<Select.Content>
										<Select.Item value="false" label="false">No</Select.Item>
										<Select.Item value="true" label="true">Yes</Select.Item>
									</Select.Content>
								</Select.Root>
							{:else}
								<Input bind:value={user.permissions[permission]} />
							{/if}
							<div class="mr-2 ml-auto">
								<Button
									onclick={_ =>
										updatePermission(
											user.id,
											permission,
											user.permissions[permission] ?? 0
										)}>Update</Button>
							</div>
						</div>
					{/each}

					<div class="permission space-y-2">
						<div class="buttons flex [&>button]:w-1/2">
							<Input bind:value={newPermissionKey} placeholder="key" />
							<Input bind:value={newPermissionValue} placeholder="value" />
						</div>
						<div class="permission-button">
							<Button
								onclick={_ =>
									updatePermission(
										user.id,
										newPermissionKey,
										stringIntoPermissionValueType(newPermissionValue)
									)}>Create</Button>
						</div>
					</div>
					<div class="domains space-y-2">
						{#each obj as key}
							{@const val = user.domains[key]}
							<div class="domain space-y-1">
								<h4>{key.replaceAll("[dot]", ".")}.frii.site</h4>
								<div class="domain-info flex space-x-2">
									<Input class="w-24" disabled value={val?.type} />
									<Input class="w-full" disabled value={val?.ip} />
								</div>
								<div class="delete-bar flex w-full space-x-2">
									<Input
										bind:value={domainDeleteReason}
										class="w-full"
										placeholder="Reason" />
									<Button
										onclick={_ =>
											deleteDomain(key, user.id, domainDeleteReason)}
										variant={"destructive"}>Delete</Button>
								</div>
							</div>
						{/each}
					</div>

					{#if deletionBegin}
						<textarea placeholder="Reasons. Seperate by newlines" bind:value={reasons}
						></textarea>
					{/if}
					{#if !user.banned}
						<Button
							variant={"destructive"}
							class="mt-4"
							onclick={_ =>
								!deletionBegin ? (deletionBegin = true) : terminateAccount(user.id)}
							>Terminate account</Button>
					{:else}
						<Button onclick={_ => reinstateAccount(user.id)}>Reinstate account</Button>
					{/if}
				</div>
			{/each}
		</Section>
	{:else}
		<h1>Checking permissions...</h1>
	{/if}
</Holder>
