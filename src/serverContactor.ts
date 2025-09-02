import { browser } from "$app/environment";
import consola from "consola";
import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./api";
import { getAuthToken, redirectToLogin, setAuthToken } from "./helperFuncs";

export let serverURL = "https://api.frii.site";
if (browser) {
	let subdomain = window.location.hostname.split(".")[0];
	if (subdomain === "canary") {
		serverURL = "https://beta.frii.site";
	} else if (subdomain === "development") {
		serverURL = "https://alpha.frii.site";
	}
	if (localStorage.getItem("url_override")) {
		serverURL = localStorage.getItem("url_override") ?? "https://api.frii.site";
	}
	console.debug("Switched server url to " + serverURL);
}

const client = createClient<paths>({ baseUrl: serverURL });

const JWTAuthMiddleware: Middleware = {
	async onResponse({ request, response, options }) {
		if (response.status === 460) {
			let start = new Date();
			consola.info("Refreshing session");

			const authCode = await tryRefreshToken();

			if (!authCode) {
				consola.warn("Failed to refresh session");
				redirectToLogin(465);
				throw new Error("Redirecting to login");
			} else {
				let ms = new Date().getTime() - start.getTime();
				consola.info(`Refreshed session in ${ms}ms`);

				setAuthToken(authCode);
				let req = request.clone();
				req.headers.set("X-Auth-Token", authCode);
				return await options.fetch(req);
			}
		}

		return response;
	}
};

// Automatically refresh auth tokens
client.use(JWTAuthMiddleware);

async function tryRefreshToken(): Promise<string | false> {
	try {
		const res = await fetch(`${serverURL}/refresh`, {
			method: "POST",
			credentials: "include"
		});

		if (!res.ok) return false;

		const data = await res.json();

		if (data["auth-token"]) {
			// refresh token gets set with the request itself as Set-Cookie header
			return data["auth-token"];
		}

		return false;
	} catch (err) {
		console.error("Refresh token request failed", err);
		return false;
	}
}

export async function digestMessage(message: string): Promise<string> {
	const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
	const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
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

export class CaptchaError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "CaptchaError";
	}
}

export async function login(
	username: string,
	password: string,
	captcha: string,
	mfaCode?: string
): Promise<paths["/login"]["post"]["responses"]["200"]["content"]["application/json"]> {
	const hashed_username: string = await digestMessage(username);
	const hashed_password: string = await digestMessage(password);

	const token: string = `${hashed_username}|${hashed_password}`;

	const { data, error, response } = await client.POST("/login", {
		params: {
			header: {
				"x-auth-request": token,
				"x-mfa-code": mfaCode,
				"x-plain-username": username, // Older versions of the backend didnt save usernames so this is the only way to give the backend the users actual username
				"x-captcha-code": captcha
			}
		},
		credentials: "include"
	});

	if (error) {
		switch (response.status) {
			case 401:
				throw new AuthError("Unauthorized. Please check your credentials.");
			case 403:
				throw new PermissionError("Verification required");
			case 404:
				throw new UserError("User not found.");
			case 412:
				throw new MFAError("MFA code required failed.");
			case 429:
				throw new CaptchaError("Invalid Captcha");
			default:
				throw new Error(`An unexpected error occurred. Status code: ${response.status}`);
		}
	}

	return data;
}

export async function register(
	username: string,
	password: string,
	email: string,
	captcha: string
): Promise<paths["/sign-up"]["post"]["responses"]["200"]["content"]["application/json"]> {
	const { data, error, response } = await client.POST("/sign-up", {
		body: { username, password, email, language: navigator.language },
		params: {
			header: { "x-captcha-code": captcha }
		}
	});

	if (error) {
		switch (response.status) {
			case 400:
				throw new InviteError("Invalid invite");
			case 409:
				throw new ConflictError("Username taken");
			case 422:
				throw new UserError("Invalid email");
			case 429:
				throw new CaptchaError("Invalid Captcha");
			default:
				throw new Error(`Failed to register. Status code: ${response.status}`);
		}
	}

	return data;
}

export async function getStatus(): Promise<
	paths["/status"]["get"]["responses"]["200"]["content"]["application/json"]
> {
	const { data, error, response } = await client.GET("/status");

	if (error) {
		throw new Error(`Failed to get status.`);
	}

	return data;
}

export async function sendForgotCode(
	username: string
): Promise<paths["/recovery/send"]["post"]["responses"]["200"]["content"]["application/json"]> {
	const { data, error, response } = await client.POST("/recovery/send", {
		params: {
			query: { username: username }
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

export async function confirmPasswordChange(
	id: string,
	password: string
): Promise<paths["/recovery/verify"]["post"]["responses"]["200"]["content"]["application/json"]> {
	let hashed_password: string = await digestMessage(password);

	const { data, error, response } = await client.POST(`/recovery/verify`, {
		body: { code: id, hashed_password: hashed_password }
	});

	if (error) {
		switch (response.status) {
			case 403:
				throw new CodeError("Invalid code.");
			case 404:
				throw new UserError("User not found");
			default:
				throw new Error(
					`Failed to confirm password change. Status code: ${response.status}`
				);
		}
	}

	return data;
}

export async function resendEmail(
	username: string
): Promise<paths["/email/send"]["post"]["responses"]["200"]["content"]["application/json"]> {
	const hashed_username = await digestMessage(username);

	const { data, error, response } = await client.POST("/email/send", {
		params: {
			query: { user_id: hashed_username }
		}
	});

	if (error) {
		switch (response.status) {
			case 404:
				throw new UserError("User does not exist");
			default:
				throw new Error(`Failed to resend email. Status code: ${response.status}`);
		}
	}

	return data;
}

export async function verifyEmail(
	code: string
): Promise<paths["/email/verify"]["post"]["responses"]["200"]["content"]["application/json"]> {
	const { data, error, response } = await client.POST("/email/verify", {
		params: {
			query: { code: code }
		}
	});
	if (error) {
		switch (response.status) {
			case 400:
				throw new CodeError("Code is invalid");
			case 404:
				throw new UserError("User does not exist");
			default:
				throw new Error(`Failed to verify. Status code: ${response.status}`);
		}
	}
	return data;
}

export async function verifyDeletion(
	code: string
): Promise<paths["/deletion/verify"]["delete"]["responses"]["200"]["content"]["application/json"]> {
	const { data, error, response } = await client.DELETE("/deletion/verify", {
		params: {
			query: { code: code }
		}
	});
	if (error) {
		switch (response.status) {
			case 400:
				throw new CodeError("Code is invalid");
			case 404:
				throw new UserError("User does not exist");
			default:
				throw new Error(`Failed to delete. Status code: ${response.status}`);
		}
	}
	return data;
}

export async function recoverMfaCode(username: string, password: string, backupCode: string) {
	const hashed_username: string = await digestMessage(username);
	const hashed_password: string = await digestMessage(password);

	const token: string = `${hashed_username}|${hashed_password}`;

	const { data, error, response } = await client.DELETE("/mfa/recovery", {
		params: {
			header: {
				"x-auth-request": token,
				"x-backup-code": backupCode
			}
		}
	});

	if (error) {
		switch (response.status) {
			case 401:
				throw new AuthError("Unauthorized. Please check your credentials.");
			case 404:
				throw new UserError("User not found.");
			case 409:
				throw new CodeError("Invalid backup code");
			case 412:
				throw new MFAError("MFA not setup.");
			default:
				throw new Error(`An unexpected error occurred. Status code: ${response.status}`);
		}
	}

	return data;
}

export class ServerContactor {
	serverURL: string;

	constructor(token: string | null, urlOverride: string | null = null) {
		this.serverURL = serverURL;
		if (urlOverride) {
			this.serverURL = urlOverride;
		}

		if (getAuthToken() === null && window.location.pathname !== "/account") {
			redirectToLogin(302);
		}
	}

	async domainAvailable(domain: string): Promise<boolean> {
		const { data, error, response } = await client.GET(`/domain/available`, {
			params: { query: { name: domain } }
		});

		return error ? false : true;
	}

	async modifyDomain(
		domain: string,
		value: string,
		type: string
	): Promise<
		paths["/domain/modify"]["patch"]["responses"]["200"]["content"]["application/json"]
	> {
		const { data, error, response } = await client.PATCH("/domain/modify", {
			body: { domain, type, value },
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": getAuthToken() }
			}
		});

		if (error) {
			switch (response.status) {
				case 403:
					throw new PermissionError("User does not own domain");
				case 412:
					throw new DNSError("Invalid record name or value");
				case 460:
					throw new AuthError("Invalid session");
				default:
					throw new Error(`Failed to modify domain. Status code: ${response.status}`);
			}
		}
		return data;
	}

	async registerDomain(domain: string, type: string): Promise<string> {
		let value: string = "0.0.0.0";
		if (type === "CNAME" || type === "NS") {
			value = "example.com";
		}
		if (type === "TXT") {
			value = "test-txt";
		}
		if (type === "AAAA") {
			value = "0000:0000:0000:0000:0000:0000:0000:0000";
		}

		const { data, error, response } = await client.POST("/domain/register", {
			body: { domain, type, value },
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": getAuthToken() }
			}
		});

		if (error) {
			switch (response.status) {
				case 400:
					throw new DNSError("Invalid domain name");
				case 403:
					throw new PermissionError("User does not own required domain");
				case 405:
					throw new LimitError("User has reached their domain limit");
				case 409:
					throw new ConflictError("Domain already exists");
				case 412:
					throw new DNSError("Invalid DNS record type");
				case 460:
					throw new AuthError("Invalid session");
				default:
					throw new Error(`Failed to register domain. Status code: ${response.status}`);
			}
		}

		return value;
	}

	async deleteDomain(
		domain: string
	): Promise<
		paths["/domain/delete"]["delete"]["responses"]["200"]["content"]["application/json"]
	> {
		const { data, error, response } = await client.DELETE("/domain/delete", {
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": getAuthToken() },
				query: { domain: domain }
			}
		});

		if (error) {
			switch (response.status) {
				case 403:
					throw new PermissionError("User does not own domain");
				case 460:
					throw new AuthError("Invalid session");
				default:
					throw new Error(`Failed to delete domain. Status code: ${response.status}`);
			}
		}

		return data;
	}

	async deleteAccount(
		mfaCode: string
	): Promise<
		paths["/deletion/send"]["delete"]["responses"]["200"]["content"]["application/json"]
	> {
		const { data, error, response } = await client.DELETE("/deletion/send", {
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": getAuthToken(), "X-MFA-Code": mfaCode }
			}
		});

		if (error) {
			//@ts-ignore
			if (response.status === 460) {
				throw new AuthError("Invalid session");
			}
			//@ts-ignore
			throw new Error(`Failed to delete account. Status code: ${response.status}`);
		}

		return data;
	}

	async getAccountSettings(): Promise<
		paths["/settings"]["get"]["responses"]["200"]["content"]["application/json"]
	> {
		const { data, error, response } = await client.GET("/settings", {
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": getAuthToken() }
			}
		});

		if (error) {
			//@ts-ignore
			if (response.status === 460) {
				throw new AuthError("Invalid session");
			}
			//@ts-ignore
			throw new Error(`Failed to get account details. Status code: ${response.status}`);
		}

		return data;
	}

	async getGDPR(): Promise<
		paths["/gdpr"]["get"]["responses"]["200"]["content"]["application/json"]
	> {
		const { data, error, response } = await client.GET("/gdpr", {
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": getAuthToken() }
			}
		});

		if (error) {
			throw new Error(`Failed to get GDPR data. Status code: ${error.detail}`);
		}

		return data;
	}

	async createInvite(): Promise<
		paths["/invite/create"]["post"]["responses"]["200"]["content"]["application/json"]
	> {
		const { data, error, response } = await client.POST("/invite/create", {
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": getAuthToken() }
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 409:
					throw new ConflictError("Invite limit reached");
				default:
					throw new Error(`Failed to create invite. Status code: ${response.status}`);
			}
		}

		//@ts-ignore
		return data;
	}

	async getDomains(): Promise<
		paths["/domain/get"]["get"]["responses"]["200"]["content"]["application/json"]
	> {
		const { data, error, response } = await client.GET("/domain/get", {
			params: {
				//@ts-ignore
				header: { "X-Auth-Token": getAuthToken() }
			}
		});

		if (error) {
			//@ts-ignore
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				default:
					throw new Error(`Failed to get domains. Status code: ${response.status}`);
			}
		}

		//@ts-ignore
		return data;
	}

	async logOut(id?: string | undefined): Promise<void> {
		consola.info("Logging out session");
		const { data, error, response } = await client.PATCH(`/logout`, {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken(),
					specific: id !== undefined,
					id: id
				}
			}
		});

		if (error) {
			//@ts-ignore
			switch (response.status) {
				case 404:
					throw new UserError("A session with that id does not exist");
				case 460:
					throw new AuthError("Invalid session");
				case 461:
					throw new PermissionError("User does not own target session");
				default:
					throw new Error(`Failed to delete session Status code: ${response.status}`);
			}
		}

		return;
	}

	async getApiKeys() {
		const { data, error, response } = await client.GET("/api/get-keys", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				default:
					throw new Error("Failed to get api keys");
			}
		}

		return data;
	}

	async getApiKey(hash: string) {
		const { data, error, response } = await client.GET("/api/get-key", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				},
				query: {
					hash: hash
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				default:
					throw new Error("Failed to get api keys");
			}
		}

		return data;
	}

	async deleteApiKey(hash: string) {
		const { data, error, response } = await client.DELETE("/api/delete-key", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				}
			},
			body: {
				hash: hash
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				default:
					throw new Error("Failed to get api keys");
			}
		}

		return data;
	}

	async createApiKey(
		comment: string,
		domains: string[],
		permissions: ("delete" | "register" | "modify" | "list")[]
	) {
		const { data, error, response } = await client.POST("/api/create-key", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				}
			},
			body: {
				comment,
				domains,
				permissions
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				default:
					throw new Error("Failed to get api keys");
			}
		}

		return data;
	}

	async joinVercelQueue(value: string) {
		const { data, error, response } = await client.POST("/domain/vercel/join", {
			params: {
				query: { value: value },
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				default:
					throw new Error("Failed to join queue");
			}
		}

		return data;
	}

	async getVercelQueue() {
		const { data, error, response } = await client.GET("/domain/vercel/get", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 404:
					throw new UserError("User not joined into queue");
				case 408:
					throw new CodeError("Verification is now ready");
				default:
					throw new Error("Failed to get queue position");
			}
		}

		return data;
	}

	async createMfaCode() {
		const { data, error, response } = await client.POST("/mfa/create", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 409:
					throw new ConflictError("MFA already setup for user");
				default:
					throw new Error("Failed to create 2fa code");
			}
		}

		return data;
	}

	async verifyMfaCode(code: string) {
		const { data, error, response } = await client.POST("/mfa/verify", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken(),
					"x-mfa-code": code
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 401:
					throw new CodeError("Invalid code");
				case 409:
					throw new ConflictError("MFA already setup for user");
				default:
					throw new Error("Failed to verify MFA code");
			}
		}

		return data;
	}

	async deleteMfaCode(code?: string, backupCode?: string) {
		const { data, error, response } = await client.DELETE("/mfa/delete", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken(),
					"x-mfa-code": code,
					"x-backup-code": backupCode
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 401:
					throw new CodeError("Invalid code");
				default:
					throw new Error("Failed to verify MFA code");
			}
		}

		return data;
	}

	async findById(id: string) {
		const { data, error, response } = await client.GET("/admin/user/get/id", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				},
				query: {
					id: id
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 461:
					throw new PermissionError("Invalid permissions");
				case 404:
					throw new UserError("User not found");
				default:
					throw new Error("Failed to load user data");
			}
		}

		return data;
	}

	async findByUsername(username: string) {
		const { data, error, response } = await client.GET("/admin/user/get/username", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				},
				query: {
					username: username
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 461:
					throw new PermissionError("Invalid permissions");
				case 404:
					throw new UserError("User not found");
				default:
					throw new Error("Failed to load user data");
			}
		}

		return data;
	}

	async findByDomain(domain: string) {
		const { data, error, response } = await client.GET("/admin/user/get/domain", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				},
				query: {
					domain: domain
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 461:
					throw new PermissionError("Invalid permissions");
				case 404:
					throw new UserError("User not found");
				default:
					throw new Error("Failed to load user data");
			}
		}

		return data;
	}

	async findByEmail(email: string) {
		const { data, error, response } = await client.GET("/admin/user/get/email", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				},
				query: {
					email: email
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 461:
					throw new PermissionError("Invalid permissions");
				case 404:
					throw new UserError("User not found");
				default:
					throw new Error("Failed to load user data");
			}
		}

		return data;
	}

	async deleteAccountAdmin(account: string, reasons: string[]) {
		const { data, error, response } = await client.DELETE("/admin/user/delete", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				}
			},
			body: {
				user_id: account,
				reasons: reasons
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 461:
					throw new PermissionError("Invalid permissions");
				case 503:
					throw new DNSError("Failed to delete domains");
				case 404:
					throw new UserError("User not found");
				default:
					throw new Error("Failed to load user data");
			}
		}

		return data;
	}

	async reinstateAccount(account: string) {
		const { data, error, response } = await client.POST("/admin/user/reinstate", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				},
				query: {
					user_id: account
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 461:
					throw new PermissionError("Invalid permissions");
				case 503:
					throw new DNSError("Failed to recoer domains");
				case 404:
					throw new UserError("User not found");
				case 412:
					throw new ConflictError("User already unbanned");
				default:
					throw new Error("Failed to load user data");
			}
		}

		return data;
	}

	async updatePermission(account: string, permission: string, value: string | boolean | number) {
		const { data, error, response } = await client.PATCH("/admin/user/permission", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				},
				query: {
					id: account,
					permission: permission,
					value: value
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 461:
					throw new PermissionError("Invalid permissions");
				case 404:
					throw new UserError("User not found");
				default:
					throw new Error("Failed to load user data");
			}
		}

		return data;
	}

	async adminDeleteDomain(account: string, domain: string, reason: string) {
		const { data, error, response } = await client.DELETE("/admin/domain/delete", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				},
				query: {
					userid: account,
					reason: reason,
					domain: domain
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 461:
					throw new PermissionError("Invalid permissions");
				case 404:
					throw new UserError("User not found");
				default:
					throw new Error("Failed to load user data");
			}
		}

		return data;
	}

	async canUseAdminPanel() {
		const { data, error, response } = await client.GET("/admin/user/can-access", {
			params: {
				//@ts-ignore
				header: {
					"X-Auth-Token": getAuthToken()
				}
			}
		});

		if (error) {
			switch (response.status) {
				case 460:
					throw new AuthError("Invalid session");
				case 403:
					throw new PermissionError("Invalid permissions");
				default:
					throw new Error("Failed to load user permission");
			}
		}
	}
}
