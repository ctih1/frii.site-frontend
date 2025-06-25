import { browser } from "$app/environment";
import { writable } from "svelte/store";

function persisted(key: string, placeholder: string) {
	let value: string | null = null;
	if (browser) {
		value = localStorage.getItem(key);
	}
	let store = writable(value ? JSON.parse(value) : placeholder);

	store.subscribe(value_ => {
		if (browser) {
			localStorage.setItem(key, JSON.stringify(value_));
		}
	});
	return store;
}

export const prefLocale = persisted("preferredLocale", "en");
