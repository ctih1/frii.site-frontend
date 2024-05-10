<script lang="ts">
	import Blur from '$lib/components/Blur.svelte';
	import Registrar from '$lib/components/Registrar.svelte';
    import DomainTable from "$lib/components/DomainTable.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { ServerContactor } from '../../serverContactor';
    import { onMount } from 'svelte';
    import { redirectToLogin } from '../../helperFuncs';
    import { redirect } from '@sveltejs/kit';

    let blurBackground:Blur;
    let domainTable:DomainTable;
    let modal:Modal;
    let domains:Map<any,any>;
    let domainlist:Array<Array<string>> = [];
    let serverContactor:ServerContactor

    function modalClose() {
        modal.close();
        blurBackground.hide();
    }

    function modifyDomain(name:string,value:string,type:string) {
        console.log(type);
        blurBackground.show();
        serverContactor.modifyDomain(name,value,type).then(response=>{
            switch(response.status) {
                case 401:
                    redirectToLogin(401);
                    break;
                case 403:
                    modal.open("Could not modify domain","Please make sure you own the domain.");
                    break;
                case 404:
                    redirectToLogin(404);
                    break;
                case 412:
                    redirectToLogin(412);
                    break;
                case 422:
                    modal.open("Invalid value","Please make sure your value field is correct.");
                    break;
                case 200:
                    modal.open("Success","Succesfully modified domain.")
                    break;
            }
        })
    } 

    onMount(()=>{
        serverContactor = new ServerContactor(localStorage.getItem("auth-token"));
        serverContactor.getDomains().then(response=>console.log(response.status));

        serverContactor.getDomains().then(response=>response.json()).then(data=>{
            domains = new Map(Object.entries(data))
            for(let pair of domains) {
                let [key,value] = pair;
                value=new Map(Object.entries(value));
                domainlist.push([value.get("type"),key,value.get("ip")]);
            }
            domainTable.updateDomains(domainlist);
        });
    })
    
</script>

<div class="holder">
    <h1>Your domains</h1>
    <p>These are all the domains you own. You can modify each parameter of them by simply clicking on their respective input field.</p>
    <DomainTable on:save={(event)=>modifyDomain(event.detail.name,
        event.detail.value,
        event.detail.type
    )} bind:this={domainTable} domains={domainlist}/>
</div>

<div class="holder">
    <h2>Register a new domain</h2>
    <p>Registering a new domain is just a few clicks away! You can always get help from our <a href="https://wikipedia.com">Wiki</a></p>
    <Registrar/>
</div>

<Modal overrideDefault={true} on:primary={()=>modalClose()} bind:this={modal} options={["OK"]} description={""} title={""}></Modal>
<Blur bind:this={blurBackground}/>
<style>
    .holder {
        width: 50vw;
        margin-left: auto;
        margin-right: auto;
        background-color: white;
        border-radius: 0.5em;
        padding: 2em;
        margin-top: 2em;
    }
</style>