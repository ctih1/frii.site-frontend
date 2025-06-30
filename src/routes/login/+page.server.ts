import { redirect } from "@sveltejs/kit";

export function load({ cookies }) {
	const loggedIn = cookies.get("logged-in") && cookies.get("auth-token");

	console.log(cookies.get("logged-in"));
	console.log(cookies.get("auth-token"));
	console.log(loggedIn);

	if (loggedIn) {
		redirect(307, "/account/manage");
	}
}
