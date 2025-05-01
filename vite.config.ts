import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "friisite",
            project: "frontend"
        }
    }), sveltekit()],
    define: {
        __BUILD_COMMIT__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || 'local-dev'),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString())
      }
});