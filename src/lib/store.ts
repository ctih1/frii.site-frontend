import { writable } from "svelte/store";

function getLocalStorageKey(key: string, defaultValue: any) {
	if (typeof window === typeof undefined) {
		return defaultValue;
	} else {
		return localStorage.getItem(key) ?? defaultValue;
	}
}

function setKey(key: string, value: string) {
	if (typeof window === typeof undefined) {
		return null;
	} else {
		localStorage.setItem(key, value);
	}
}

const StoredDomainKey = "domainAmountStore";
const DefaultDomainAmount = 3;

const storedDomainAmount: number = Number(getLocalStorageKey(StoredDomainKey, DefaultDomainAmount));
export const domainAmount = writable(storedDomainAmount);

domainAmount.subscribe(value => {
	setKey(StoredDomainKey, `${Number(value) || DefaultDomainAmount}`);
});
