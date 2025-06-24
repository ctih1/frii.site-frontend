import i18n from "sveltekit-i18n";
import lang from "../locales/+lang.json";

export const defaultLocale = "en";

const config = {
  fallbackLocale: "en",
  translations: {
    // add your language here, and +lang.js it makes the language selector show the language in its native language (en->English)
    de: { lang },
    en: { lang },
    es: { lang },
    fi: { lang },
    it: { lang },
    ro: { lang },
    pt: { lang },
    ru: { lang },
  },
  loaders: [
    {
      locale: "de",
      key: "",
      loader: async () => (await import("../locales/de.json")).default,
    },
    {
      locale: "en",
      key: "",
      loader: async () => (await import("../locales/en.json")).default,
    },
    {
      locale: "es",
      key: "",
      loader: async () => (await import("../locales/es.json")).default,
    },
    {
      locale: "es",
      key: "common",
      loader: async () => (await import("../locales/es.json")).default,
    },
    {
      locale: "fi",
      key: "",
      loader: async () => (await import("../locales/fi.json")).default,
    },
    {
      locale: "it",
      key: "",
      loader: async () => (await import("../locales/it.json")).default,
    },
    {
      locale: "pl",
      key: "",
      loader: async () => (await import("../locales/pl.json")).default,
    },
    {
      locale: "ar",
      key: "",
      loader: async () => (await import("../locales/ar.json")).default,
    },
    {
      locale: "ro",
      key: "",
      loader: async () => (await import("../locales/ro.json")).default,
    },
    {
      locale: "bg",
      key: "",
      loader: async () => (await import("../locales/bg.json")).default,
    },
    {
      locale: "pt",
      key: "",
      loader: async () => (await import("../locales/pt.json")).default,
    },
    {
      locale: "ru",
      key: "common",
      loader: async () => (await import("../locales/ru.json")).default,
    },
  ],
};

export function addArguements(translation: string, replaced: Object): string {
  for (const [key, value] of Object.entries(replaced)) {
    translation = translation.replaceAll(key, value);
  }
  return translation;
}

export const {
  t,
  loading,
  locales,
  locale,
  translations,
  loadTranslations,
  addTranslations,
  setLocale,
  setRoute,
  l,
} = new i18n(config);
loading.subscribe(
  ($loading) => $loading && console.log("Loading translations..."),
);
