import * as Sentry from "@sentry/sveltekit";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { paraglideMiddleware } from "./paraglide/server";

Sentry.init({
	dsn: "https://0e20b29e0aab621bc4e9eb20bf1e6681@o4508127968886784.ingest.de.sentry.io/4508128377765968",
	enableLogs: true
});

const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		console.log("Running paraglide");
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace("%lang%", locale);
			}
		});
	});

export const handle = sequence(Sentry.sentryHandle(), sequence(paraglideHandle));
export const handleError = Sentry.handleErrorWithSentry();
