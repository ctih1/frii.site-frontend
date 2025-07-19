import { AuthError, getAuthToken, redirectToLogin, ServerContactor } from "$lib";

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
		else {
			console.error(err);
			redirectToLogin(500);
		}
		throw new Error("Failed to get account data");
	}

	const username = accountSettings.username;
	const email = accountSettings.email;
	const maxDomains = accountSettings.permissions["max-domains"] ?? 3;
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
		sessions
	};
};

export const ssr = false;
