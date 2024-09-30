import { prefLocale } from './stores.js';
import { get } from "svelte/store"
import { addTranslations, setLocale, setRoute } from '$lib/translations';
export const ssr = true;
/** @type {import('@sveltejs/kit').Load} */
console.log("%c ⚠️ Pasting code in this window can get you hacked. ⚠️","color:red; font-size: 25px;")
console.log("%c Pasting unknown code in this window might share your session id to unwanted individuals. We are NOT responsible for your account potentially being hacked.", "color:black; font-size: 12px;");
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
