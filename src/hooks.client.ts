import * as Sentry from "@sentry/sveltekit";
import { handleErrorWithSentry, replayIntegration } from "@sentry/sveltekit";

Sentry.init({
	dsn: "https://0e20b29e0aab621bc4e9eb20bf1e6681@o4508127968886784.ingest.de.sentry.io/4508128377765968",
	enableLogs: true,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
	tunnel: "/tunnel",

	// If you don't want to use Session Replay, just remove the line below:
	integrations: [replayIntegration()]
});

export const handleError = handleErrorWithSentry();
