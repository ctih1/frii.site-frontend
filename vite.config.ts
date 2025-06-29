import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/paraglide",
			strategy: ["cookie", "localStorage", "url", "baseLocale"]
		}),
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: "friisite",
				project: "frontend"
			}
		}),
		sveltekit()
	],
	define: {
		__BUILD_COMMIT__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || "local-dev"),
		__BUILD_TIME__: JSON.stringify(new Date().toISOString())
	}
});
