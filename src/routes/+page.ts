import type { Load } from "@sveltejs/kit";

interface Iblog {
	url: string;
	date: number;
	body: string;
	title: string;
}

/** @type {import('@sveltejs/kit').Load} */
export const load: Load = async ({ fetch }) => {
	const serverURL = "https://api.frii.site";
	const blogRoute = `${serverURL}/blog/get/all?n=3&content=80`;
	let res;

	try {
		const response = await fetch(blogRoute, { signal: AbortSignal.timeout(3500) });
		res = response;
	} catch (err) {
		console.error("Failed to retrieve data ");
		console.error(err);

		return {
			shouldBeShown: false,
			blogs: [],
			status: 0
		};
	}

	if (!res.ok) {
		return {
			shouldBeShown: false,
			blogs: [],
			status: res.status
		};
	}

	try {
		const json = await res.json();
		return {
			shouldBeShown: true,
			blogs: json as Iblog[]
		};
	} catch (err) {
		return {
			shouldBeShown: false,
			blogs: [],
			status: res.status,
			error: err
		};
	}
};
