import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: { org: "friisite", project: "frontend" }
		}),
		tailwindcss(),
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/paraglide",
			strategy: ["cookie", "localStorage", "url", "baseLocale"]
		}),
		sveltekit(),
		Icons({ compiler: "svelte" }),
		devtoolsJson()
	],
	define: {
		__BUILD_COMMIT__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || "local-dev"),
		__BUILD_TIME__: JSON.stringify(new Date().toISOString())
	}
});
