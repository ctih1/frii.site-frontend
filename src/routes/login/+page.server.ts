import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ url, cookies }) => {
	const loggedIn = cookies.get("logged-in") && cookies.get("auth-token");

	console.log(cookies.get("logged-in"));
	console.log(cookies.get("auth-token"));
	console.log(loggedIn);

	if (loggedIn) {
		redirect(307, "/account/manage");
	}

	return {
		redirectURL: url.searchParams.get("r"),
		statusCode: url.searchParams.get("c"),
		referrerCode: url.searchParams.get("ref")
	};
};
