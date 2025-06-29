import type { Reroute } from "@sveltejs/kit";
import { deLocalizeUrl } from "./paraglide/runtime";

export const reroute: Reroute = request => {
	console.log(request.url);
	return deLocalizeUrl(request.url).pathname;
};
