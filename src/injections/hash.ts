import HashRouter from '../components/Hash/HashRouter.svelte'
import i18n from './i18n';

export default async function hash():Promise<void>{
    document.querySelector('img')?.remove();

    const container = document.querySelector('#container') as HTMLElement|null;
    if(!container) return;

    container.innerHTML = ""
    const router = new HashRouter({
        target: container
    })
}

export function hashChangeCallback(event:HashChangeEvent){
    const oldURL = new URL(event.oldURL);
    const newURL = new URL(event.newURL);

    if(oldURL.hash === "" && newURL.hash !== ""){
        window.location.reload()
    }
    else if(oldURL.hash !== "" && newURL.hash === ""){
        window.location.reload()
    }
    else{
        i18n()
    }
}