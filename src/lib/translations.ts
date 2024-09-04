    import i18n from 'sveltekit-i18n';
import lang from "../locales/+lang.json"

export const defaultLocale = "en";

const config = ({
	fallbackLocale:"en",
	translations: { // add your language here, and +lang.js it makes the language selector show the language in its native language (en->English)
		de: {lang},
		en: {lang},
		fi: {lang},
		it: {lang}
	},
	loaders: [
	    	{
			"locale":"de",
			"key":"common",
			loader: async() => (
				await import("../locales/de.json")
			).default,
	    	},
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
	    	},
	        {
			"locale":"it",
			"key":"common",
			loader: async() => (
				await import("../locales/it.json")
			).default
	    	},
			{
			"locale":"pl",
			"key":"common",
			loader: async() => (
				await import("../locales/pl.json")
			).default
			},
            {
			"locale":"ar",
			"key":"common",
			loader: async() => (
				await import("../locales/ar.json")
			).default,
	    	},
            {
			"locale":"lc",
			"key":"common",
			loader: async() => (
				await import("../locales/lc.json")
			).default,
	    	},            
            {
			"locale":"uwu",
			"key":"common",
			loader: async() => (
				await import("../locales/uwu.json")
			).default,
	    	},
	]
})

export function addArguements(translation:string, replaced:Object):string {
	for(const [key,value] of Object.entries(replaced)) {
		translation = translation.replace(key,value);
	}
	return translation;
}

export const { t, loading, locales, locale, translations, loadTranslations, addTranslations, setLocale, setRoute,l } = new i18n(config);
loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
