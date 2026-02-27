import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ url, cookies }) => {
	const loggedIn = cookies.get("logged-in") && cookies.get("auth-token");

	if (loggedIn) {
		redirect(307, "/account/manage");
	}

	return {
		redirectURL: url.searchParams.get("r"),
		statusCode: url.searchParams.get("c"),
		referrerCode: url.searchParams.get("ref")
	};
};
