import { writable } from "svelte/store"
import { browser } from "$app/environment"

function persisted(key:string,placeholder:string)
{
    let value:string|null=null;
    if(browser) {value=localStorage.getItem(key);}
    let store = writable(value?JSON.parse(value):placeholder)

    store.subscribe(value_=>{
        if(browser) { localStorage.setItem(key,JSON.stringify(value_)) }
    });
    return store;
}

export const prefLocale = persisted("preferredLocale", "en");
export const warnCheck = persisted("warnCheck", Date.now().toString());
export const warnCheck = persisted("warnMessage", "We are recieving heavy traffic. Some of our services may not work properly");
