import { AuthError, getAuthToken, redirectToLogin, RefreshError, ServerContactor } from "$lib";

export interface Session {
	hash: string;
	user_agent: string;
	ip: string;
	expires: number;
	loading: boolean;
}

export const load = async () => {
	const serverContactor = new ServerContactor(getAuthToken());
	try {
		var accountSettings = await serverContactor.getAccountSettings();
	} catch (err) {
		if (err instanceof AuthError) redirectToLogin(460);
		else if (err instanceof RefreshError) redirectToLogin(465);
		else {
			console.error(err);
			redirectToLogin(500);
		}
		return;
	}

	const username = accountSettings.username;
	const email = accountSettings.email;
	const maxDomains = accountSettings.permissions["max-domains"] ?? 3;
	const maxSubdomains = accountSettings.permissions["max-subdomains"] ?? 50;
	const mfaEnabled = accountSettings.mfa_enabled;
	const sessionObject = accountSettings.sessions;

	const sessions: Session[] = [];

	sessionObject.forEach(element => {
		sessions.push({
			expires: element["expires"],

			// @ts-ignore
			hash: element["_id"],
			ip: element["ip"],
			user_agent: element["user-agent"] ?? element["agent"],
			loading: false
		});
	});

	return {
		username,
		email,
		maxDomains,
		mfaEnabled,
		sessions,
		maxSubdomains,
		permissions: new Map(Object.entries(accountSettings.permissions)) || new Map(),
		googleLinked: accountSettings["google-connected"]
	};
};

export const ssr = false;
