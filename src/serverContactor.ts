import { redirectToLogin } from "./helperFuncs";
import { browser } from "$app/environment";
import type { paths } from "./api";
import createClient from "openapi-fetch";

export let serverURL = "https://api.frii.site";
if (browser) {
	let subdomain = window.location.hostname.split(".")[0];
	if (subdomain === "canary") {
		serverURL = "https://beta.frii.site";
	}
	if (localStorage.getItem("url_override")) {
		serverURL = localStorage.getItem("url_override") ?? "https://api.frii.site";
	}
	console.debug("Switched server url to " + serverURL);
}

const client = createClient<paths>({ baseUrl: serverURL });

export async function digestMessage(message: string): Promise<string> {
	const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
	const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
	return hashHex;
}

export async function createToken(username: string, password: string): Promise<string> {
	const psw = await digestMessage(password);
	const usr = await digestMessage(username);
	const token = `${usr}|${psw}`;
	return token;
}

export class UserError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UserError";
	}
}
export class AuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AuthError";
	}
}
export class MFAError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MFAError";
	}
}

export class CodeError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "CodeError";
	}
}

export class PermissionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PermissionError";
	}
}


export class DNSError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DNSError";
	}
}

export class ConflictError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ConflictError";
	}
}

export class InviteError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InviteError";
	}
}

export class LimitError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "LimitError";
	}
}





export async function login(username: string, password: string): Promise<paths["/login"]["post"]["responses"]["200"]["content"]["application/json"]> {
	const hashed_username: string = await digestMessage(username);
	const hashed_password: string = await digestMessage(password);

	const token: string = `${hashed_username}|${hashed_password}`;

	const { data, error, response } = await client.POST("/login", {
		params: {
			header: { "x-auth-request": token },
		},
	});

	if (error) {
		console.log(error);
		switch (response.status) {
			case 401:
				throw new AuthError("Unauthorized. Please check your credentials.");
			case 403:
				throw new PermissionError("Verification required");
			case 404:
				throw new UserError("User not found.");
			case 412:
				throw new MFAError("Precondition failed.");
			default:
				throw new Error(`An unexpected error occurred. Status code: ${response.status}`);
		}
	}

	return data;
}

export async function getStatus(): Promise<paths["/status"]["get"]["responses"]["200"]["content"]["application/json"]> {
	const { data, error, response } = await client.GET("/status");

	if (error) {
		throw new Error(`Failed to get status. Status code: ${response.status}`);
	}

	return data;
}

export async function sendForgotCode(username: string): Promise<paths["/recovery/send"]["post"]["responses"]["200"]["content"]["application/json"]> {
	const { data, error, response } = await client.POST("/recovery/send", {
		params: {
			query: { "username": username }
		}
	});

	if (error) {
		switch (response.status) {
			case 404: // as of 25.1.25, the server doesn't even return a 404
				throw new UserError("User not found.");
			default:
				throw new Error(`Failed to send forgot code. Status code: ${error.detail}`);
		}
	}

	return data;
}


export async function confirmPasswordChange(id: string, password: string): Promise<paths["/recovery/verify"]["post"]["responses"]["200"]["content"]["application/json"]> {
	let hashed_password: string = await digestMessage(password);

	const { data, error, response } = await client.POST(`/recovery/verify`, {
		body: { "code": id, "hashed_password": hashed_password }
	});

	if (error) {
		switch (response.status) {
			case 403: throw new CodeError("Invalid code.");
			case 404: throw new UserError("User not found");
			default: throw new Error(`Failed to confirm password change. Status code: ${response.status}`);
		}
	}

	return data;
}


export async function resendEmail(username: string): Promise<paths["/email/send"]["post"]["responses"]["200"]["content"]["application/json"]> {
	const hashed_username = await digestMessage(username);

	const { data, error, response } = await client.POST("/email/send", {
		params: {
			query: { "user_id": hashed_username }
		},
	});

	if (error) {
		switch (response.status) {
			case 404: throw new UserError("User does not exist");
			default: throw new Error(`Failed to resend email. Status code: ${response.status}`);
		}

	}

	return data;
}

export async function verifyEmail(code:string): Promise<paths["/email/verify"]["post"]["responses"]["200"]["content"]["application/json"]> {
	const { data, error, response } = await client.POST("/email/verify", {
		params: {
			query: { "code": code }
		}
	});
	if (error) { 
		switch(response.status) {
			case 400: throw new CodeError("Code is invalid");
			case 404: throw new UserError("User does not exist");
			default: throw new Error(`Failed to verify. Status code: ${response.status}`);
		}
	}
	return data;
}

export async function verifyDeletion(code:string): Promise<paths["/deletion/verify"]["delete"]["responses"]["200"]["content"]["application/json"]> {
	const { data, error, response } = await client.DELETE("/deletion/verify", {
		params: {
			query: { "code": code }
		}
	});
	if (error) { 
		switch(response.status) {
			case 400: throw new CodeError("Code is invalid");
			case 404: throw new UserError("User does not exist");
			default: throw new Error(`Failed to delete. Status code: ${response.status}`);
		}
	}
	return data;
}

export async function getLanguagePercentages(): Promise<paths["/languages/percentages"]["get"]["responses"]["200"]["content"]["application/json"]> {
	const { data, error } = await client.GET("/languages/percentages");
	if (error) {
		throw new Error(`Failed to get language percentages`)
	}
	return data;
}


export async function getTranslationKeys(code: string): Promise<paths[`/languages/{language}/missing-keys`]["get"]["responses"]["200"]["content"]["application/json"]> {
	//@ts-ignore
	const { data, error, response} = await client.GET(`/languages/${code}/missing-keys`);
	if (error) {
		throw new Error(`Failed to get translation keys.`);
	}
	//@ts-ignore
	return data;
}



export class ServerContactor {
	token: string;
	serverURL: string;

	constructor(token: string | null, urlOverride: string | null = null) {
		this.serverURL = serverURL;
		if (urlOverride) {
			this.serverURL = urlOverride;
		}
		this.token = token as string;
		if (this.token === null && window.location.pathname !== "/account") {
			redirectToLogin(302);
		}
	}

	async domainAvailable(domain: string): Promise<boolean> {
		const { data, error, response } = await client.GET(`/domain/available`, {
			params: { query: { "name": domain } }
		});

		return error ? false : true;
	}

	async modifyDomain(domain: string, value: string, type: string): Promise<paths["/domain/modify"]["patch"]["responses"]["200"]["content"]["application/json"]> {
		const { data, error, response } = await client.PATCH("/domain/modify", {
			body: { domain, type, value },
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": this.token },
			},
		});

		if (error) {
			switch (response.status) {
				case 403: throw new PermissionError("User does not own domain");
				case 412: throw new DNSError("Invalid record name or value");
				case 460: throw new AuthError("Invalid session");
				default: throw new Error(`Failed to modify domain. Status code: ${response.status}`);
			}
		}
		return data;
	}

	async registerDomain(domain: string, type: string): Promise<paths["/domain/register"]["post"]["responses"]["200"]["content"]["application/json"]> {
		const { data, error, response } = await client.POST("/domain/register", {
			body: { domain, type, value: type === "CNAME" ? "example.com" : "0.0.0.0" },
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": this.token },
			},
		});

		if (error) {
			switch (response.status) {
				case 400: throw new DNSError("Invalid domain name");
				case 403: throw new PermissionError("User does not own required domain");
				case 405: throw new LimitError("User has reached their domain limit");
				case 409: throw new ConflictError("Domain already exists");
				case 412: throw new DNSError("Invalid DNS record type");
				case 460: throw new AuthError("Invalid session");
				default: throw new Error(`Failed to register domain. Status code: ${response.status}`);
			}
		}

		return data;
	}

	async deleteDomain(domain: string): Promise<paths["/domain/delete"]["delete"]["responses"]["200"]["content"]["application/json"]> {
		const { data, error, response } = await client.DELETE("/domain/delete", {
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": this.token },
				query: { "domain": domain }
			},
		});

		if (error) {
			switch (response.status) {
				case 403: throw new PermissionError("User does not own domain");
				case 460: throw new AuthError("Invalid session");
				default: throw new Error(`Failed to delete domain. Status code: ${response.status}`);
			}
		}

		return data;
	}

	async register(username: string, password: string, email: string, code: string): Promise<paths["/sign-up"]["post"]["responses"]["200"]["content"]["application/json"]> {
		const { data, error, response } = await client.POST("/sign-up", {
			body: { username, password, email, language: navigator.language, invite: code },
		});

		if (error) {
			switch (response.status) {
				case 400: throw new InviteError("Invalid invite");
				case 409: throw new ConflictError("Username taken");
				case 422: throw new UserError("Invalid email");
				default: throw new Error(`Failed to register. Status code: ${response.status}`);
			}
		}

		return data;
	}

	async deleteAccount(): Promise<paths["/deletion/send"]["delete"]["responses"]["200"]["content"]["application/json"]> {
		const { data, error, response } = await client.DELETE("/deletion/send", {
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": this.token },
			},
		});

		if (error) {
			//@ts-ignore
			if (response.status === 460) { throw new AuthError("Invalid session"); }
			//@ts-ignore
			throw new Error(`Failed to delete account. Status code: ${response.status}`);
		}

		return data;
	}

	async getAccountSettings(): Promise<paths["/settings"]["get"]["responses"]["200"]["content"]["application/json"]> {
		const { data, error, response } = await client.GET("/settings", {
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": this.token },
			},
		});


		if (error) {
			//@ts-ignore
			if (response.status === 460) { throw new AuthError("Invalid session"); }
			//@ts-ignore
			throw new Error(`Failed to get account details. Status code: ${response.status}`);
		}

		return data;
	}


	async getGDPR(): Promise<paths["/gdpr"]["get"]["responses"]["200"]["content"]["application/json"]> { // TODO: Implement on backend
		const { data, error, response } = await client.GET("/gdpr", {
			params: {
				header: { "X-Auth-Token": this.token },
			},
		});

		if (error) {
			throw new Error(`Failed to get GDPR data. Status code: ${error.detail}`);
		}

		return data;
	}

	async createInvite(): Promise<paths["/invite/create"]["post"]["responses"]["200"]["content"]["application/json"]> {
		const { data, error, response } = await client.POST("/invite/create", {
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": this.token },
			},
		});

		if (error) {
			switch (response.status) {
				case 460: throw new AuthError("Invalid session");
				case 409: throw new ConflictError("Invite limit reached");
				default: throw new Error(`Failed to create invite. Status code: ${response.status}`);
			}
		}

		//@ts-ignore
		return data;
	};


	async getDomains(): Promise<paths["/domain/get"]["get"]["responses"]["200"]["content"]["application/json"]> {
		const { data, error, response } = await client.GET("/domain/get", {
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": this.token },
			},
		});

		if (error) {
			//@ts-ignore
			switch (response.status) {
				case 460: throw new AuthError("Invalid session");
				default: throw new Error(`Failed to create invite. Status code: ${response.status}`);
			}
		}

		//@ts-ignore
		return data;
	};

	async logOut(id?: string | undefined): Promise<void> {
		console.log(id);
		const { data, error, response } = await client.PATCH(`/logout`, {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": this.token,
					"specific": id !== undefined,
					"id": id
				},

			}
		});

		if (error) {
			//@ts-ignore
			switch (response.status) {
				case 404: throw new UserError("A session with that id does not exist");
				case 460: throw new AuthError("Invalid session");
				case 461: throw new PermissionError("User does not own target session");
				default: throw new Error(`Failed to delete session Status code: ${response.status}`);
			}
		}

		return;
	}

	async contributeLanguageKeys(code:string, keys:{key:string,val:string}[]) {
		//@ts-ignore
		const { data, error, response} = await client.POST(`/languages/${code}/contribute`, {
			params: {
				header: {
					"X-Auth-Token": this.token
				}
			},

			body: {
				"keys":keys
			}
		});
		if(error) {
			switch(response.status) {
				case 460: throw new AuthError("Invalid session")
				case 500: throw new Error("Internal server error")
			}
		}
	}


}
