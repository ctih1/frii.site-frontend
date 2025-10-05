import { dev } from "$app/environment";
import { activeTheme } from "$lib/store";
import consola from "consola";
import Cookies from "js-cookie";
import { localizeHref } from "./paraglide/runtime";

export function redirectToLogin(
	code: number = 0,
	timeoutSeconds: number = 0,
	no_reroute: boolean = false
): void {
	setTimeout(() => {
		consola.info(`Redirecting to login with code ${code}`);

		Cookies.remove("logged-in");
		Cookies.remove("auth-token", {
			secure: !dev,
			domain: window.origin,
			sameSite: "Strict"
		});

		if (code === 461) {
			window.location.href = localizeHref(`/account/warn?reason=permission`);
		} else if (code === 462) {
			window.location.href = localizeHref(`/account/warn?reason=feature`);
		} else {
			window.location.href = localizeHref(
				`/login?r=${no_reroute ? "/" : window.location.pathname}&c=${code}`
			);
		}
	}, timeoutSeconds * 1000);
}
export function createFile(filename: string, content: string): boolean {
	consola.info("Creating a downloadable file");

	let a: HTMLElement = document.createElement("a");
	a.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
	a.setAttribute("download", filename);
	a.click();
	return true;
}
export function getFlagEmoji(countryCode: String): string {
	if (countryCode == "en") {
		countryCode = "gb";
	}
	if (countryCode == "ar") {
		countryCode = "sa";
	}
	let codePoints = countryCode
		.toUpperCase()
		.split("")
		.map(char => 127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
}

export function getAuthToken() {
	consola.debug("Getting auth token");
	return Cookies.get("auth-token");
}

export function setAuthToken(token: string) {
	const tokenExpirationMin = 10;
	const expires = new Date(new Date().getTime() + tokenExpirationMin * 60000);

	consola.debug(`Creating a new token that expires on ${expires}`);

	Cookies.set("auth-token", token, {
		secure: !dev,
		expires: expires,
		sameSite: "Strict",
		path: "/"
	});
}

export function getFlagImageSrcFromEmoji(emoji: string) {
	const codePoint = Array.from(emoji)
		// @ts-ignore
		.map(c => c.codePointAt(0).toString(16))
		.join("-");

	return `https://twemoji.maxcdn.com/v/latest/svg/${codePoint}.svg`;
}

export function updateThemeBody(theme: string) {
	if (theme === "light") {
		document.body.classList.remove("dark");
	} else if (theme === "dark") {
		document.body.classList.add("dark");
	} else if (theme === "auto") {
		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			document.body.classList.add("dark");
		} else {
			document.body.classList.add("light");
		}
	}
}

export function changeTheme(theme: string) {
	updateThemeBody(theme);
	activeTheme.set(theme);
	window.location.reload();
}
