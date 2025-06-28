import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get("auth-token");

	if (!token) {
		console.log("invalid token");
		redirect(302, "/account?c=302&r=/");
	}

	const res = await fetch(`https://beta.frii.site/admin/user/can-access`, {
		headers: {
			"X-Auth-Token": token
		}
	});

	switch (res.status) {
		case 403:
			redirect(307, "/account/warn?reason=permission");
			break;
		case 460:
			redirect(307, "/account?c=460&r=/");
			break;
		case 200:
			return {
				hasAccess: true,
				code: 200
			};

		default:
			redirect(307, `/account?c=${res.status}&r=/`);
	}
};
