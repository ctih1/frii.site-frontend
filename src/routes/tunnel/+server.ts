import { json } from "@sveltejs/kit";

const SENTRY_HOST = "0e20b29e0aab621bc4e9eb20bf1e6681@o4508127968886784.ingest.de.sentry.io";
const SENTRY_PROJECT_IDS = ["4508128377765968"];

export async function POST({ request }) {
	try {
		const envelopeBytes = await request.arrayBuffer();
		const envelope = new TextDecoder().decode(envelopeBytes);

		const piece = envelope.split("\n")[0];

		if (!piece) {
			throw new Error("Invalid piece!");
		}

		const header = JSON.parse(piece);

		const dsn = new URL(header["dsn"]);
		const project_id = dsn.pathname?.replace("/", "");

		if (dsn.hostname !== SENTRY_HOST) {
			throw new Error(`Invalid sentry hostname: ${dsn.hostname}`);
		}
		if (!project_id || !SENTRY_PROJECT_IDS.includes(project_id)) {
			throw new Error(`Invalid sentry project id: ${project_id}`);
		}

		const upstream_sentry_url = `https://${SENTRY_HOST}/api/${project_id}/envelope/`;
		await fetch(upstream_sentry_url, {
			method: "POST",
			body: envelopeBytes
		});
		return json({}, { status: 200 });
	} catch (e) {
		console.error("error tunneling to sentry", e);
		return json({ error: "error tunneling to sentry" }, { status: 500 });
	}
}
