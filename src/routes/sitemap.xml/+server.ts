// /src/routes/sitemap.xml/+server.ts
import { type RequestHandler } from "@sveltejs/kit";
import * as sitemap from "super-sitemap";
import { locales, localizeHref } from "../../paraglide/runtime";

export const prerender = true; // optional

const Priorities: { [key: string]: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0 } = {
	"/": 0.9,
	"/dashboard": 0.8,
	"/adblock-info": 0.3,
	"/terms": 0.7,
	"/privacy": 0.7,
	"/support/info": 0.4,
	"/login": 0.8
};

export const GET: RequestHandler = async () => {
	return await sitemap.response({
		origin: "https://www.frii.site",
		excludeRoutePatterns: ["^/account.*", "^/blog.*", "componenttest", "^/redeem.*"],
		defaultChangefreq: "daily",
		defaultPriority: 0.7,
		sort: "alpha",
		processPaths: paths => {
			return paths.map(({ path, ...rest }) => {
				const alternatives = [];

				for (const locale of locales) {
					alternatives.push({
						lang: locale,
						path: localizeHref(path, { locale: locale })
					});
				}
				return {
					...rest,
					path: path,
					priority: Priorities[path] ?? 0.7,
					alternates: alternatives
				};
			});
		},
		headers: { "Content-Type": "text/xml" }
	});
};
