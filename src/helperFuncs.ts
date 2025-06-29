import Cookies from "js-cookie";
import { localizeHref } from "./paraglide/runtime";

export function redirectToLogin(code: number = 0, timeoutSeconds: number = 0): void {
	setTimeout(() => {
		localStorage.removeItem("logged-in");
		if (code === 461) {
			window.location.href = localizeHref(`/account/warn?reason=permission`);
		}
		if (code === 462) {
			window.location.href = localizeHref(`/account/warn?reason=feature`);
		}
		window.location.href = localizeHref(`/account?r=${window.location.pathname}&c=${code}`);
	}, timeoutSeconds * 1000);
}
export function createFile(filename: string, content: string): boolean {
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
		.map(char => 127397 + char.charCodeAt());
	return String.fromCodePoint(...codePoints);
}

export function getAuthToken() {
	return Cookies.get("auth-token") ?? localStorage.getItem("auth-token");
}
