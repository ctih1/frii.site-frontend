import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
injectSpeedInsights(); // "Inject" man you aint a freaking narc brah

export const ssr = true;
/** @type {import('@sveltejs/kit').Load} */
console.log(
	"%c ⚠️ Pasting code in this window can get you hacked. ⚠️",
	"color:red; font-size: 25px;"
);
console.log(
	"%c Pasting unknown code in this window might share your session id to unwanted individuals. We are NOT responsible for your account potentially being hacked.",
	"color:black; font-size: 12px;"
);
