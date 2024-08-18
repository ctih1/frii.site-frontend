import { prefLocale } from './stores.js';
import { get } from "svelte/store"
import { addTranslations, setLocale, setRoute } from '$lib/translations';
export const ssr = false;
/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ data }) => {
  if(data===null) {return;}
  const { i18n, translations } = data;
  const { locale, route } = i18n;
  const initLocale = get(prefLocale) ? get(prefLocale) : "en";
  addTranslations(translations);

  await setRoute(route);
  await setLocale(initLocale);

  return i18n;
};