import i18n from 'sveltekit-i18n';
import lang from "../locales/+lang.json"

export const defaultLocale = "en";

const config = ({
	fallbackLocale:"en",
	translations: { // add your language here, and +lang.js it makes the language selector show the language in its native language (en->English)
		en: {lang},
		fi: {lang}
	},
	loaders: [
		{
			"locale":"en",
			"key":"common",
			loader: async() => (
				await import("../locales/en.json")
			).default,
		},
		{
			"locale":"fi",
			"key":"common",
			loader: async() => (
				await import("../locales/fi.json")
			).default
		}
	]
})

export function addArguements(translation:string, replaced:Object):string {
	for(const [key,value] of Object.entries(replaced)) {
		translation = translation.replace(key,value);
	}
	return translation;
}

export const { t, loading, locales, locale, translations, loadTranslations, addTranslations, setLocale, setRoute,l } = new i18n(config);

