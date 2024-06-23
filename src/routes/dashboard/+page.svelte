<script lang="ts">
	import Blur from '$lib/components/Blur.svelte';
	import Registrar from '$lib/components/Registrar.svelte';
    import DomainTable from "$lib/components/DomainTable.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Holder from '$lib/components/Holder.svelte';
    import { ServerContactor } from '../../serverContactor';
    import { onMount } from 'svelte';
    import { redirectToLogin } from '../../helperFuncs';
    import { redirect } from '@sveltejs/kit';
    let warningString:string = "This is a destructive action, which cannot be undone. You will immediately lose access to this domain, which means it will be available to register. Re-registering the domain will not revert the DNS settings back to normal.";

    let blurBackground:Blur;
    let domainTable:DomainTable;
    let modal:Modal;
    let domains:Map<any,any>;
    let domainlist:Array<Array<string>> = [];
    let serverContactor:ServerContactor
    let domain2delete:string;
    let responseSave:Response;
    function modalClose() {
        modal.close();
        blurBackground.hide();
    }

    function modalConfirm() {
        serverContactor.deleteDomain(domain2delete).then(response=>{
            switch(response.status) {
                case 200:
                    modal.open("Deleted "+domain2delete,domain2delete+" was deleted succesfully.");
                    break;
                default:
                    modal.open("Could not delete domain","An unhandled error occured.");
                    break;
            }
        })
    }

    function registerDomain(domain:string,type:string) {
        blurBackground.show();
        serverContactor.registerDomain(domain,type).then(response=>{
            switch(response.status) {
                case 200:
                    modal.open("Succes!","Succesfully registered "+domain+"!");
                    break;
                case 401:
                    redirectToLogin(401);
                    break;
                case 403:
                    modal.open("Could not regiser domain","You have exceeded your domain limit. Please consider purchasing more domains at https://ko-fi.com/s/123804db77");
                    break;
                case 404:
                    redirectToLogin(404);
                    break;
                case 405:
                    modal.open("Could not register domain","Invalid type. Type must be A, CNAME, TXT or NS.");
                    break;
                case 409:
                    modal.opem("Could not register domain","The domain is either invalid, or is already in use.");
                    break;
                case 412:
                    redirectToLogin(412);
                    break;
                default:
                    modal.open(`Could not register domain (${response.status})`,"An unhandled error occured.");
                    break;
            }
        })
    }

    function modifyDomain(name:string,value:string,type:string) {
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
                case 500:
                    modal.open("Something went wrong...","We don't know what happened either!");
                    break;
                case 200:
                    modal.open("Success","Succesfully modified domain.")
                    break;
            }
        })
    } 

    onMount(()=>{
        blurBackground.show();
	console.log("Im desperate p1");
	try {
	console.log("Im desperate p2");
		
	        serverContactor = new ServerContactor(localStorage.getItem("auth-token"));
	console.log("Im desperate p3");
	
	        serverContactor.getDomains().then(response=>response.json()).then(data=> {
	console.log("Im desperate p4");

	            domains = new Map(Object.entries(data));
	console.log("Im desperate p5");

	            for(let pair of domains) {
	                let [key,value] = pair;
	                value=new Map(Object.entries(value));
	                domainlist.push([value.get("type"),key,value.get("ip")]);
	            }
	console.log("Im desperate p6");

				blurBackground.hide();
	            domainTable.updateDomains(domainlist);
	        }).catch(err=>{console.log(e);blurBackground.hide();});
	}
	catch(e) {console.log(e);blurBackground.hide();}
	blurBackground.hide();
    });
</script>

<svelte:head>
    <title>Dashboard - frii.site</title>
</svelte:head>

<Holder>
    <h1>Your domains</h1>
    <p>These are all the domains you own. You can modify each parameter of them by simply clicking on their respective input field.</p>
    <DomainTable on:delete={(event)=>{domain2delete=event.detail.domain;modal.open("Are you sure you want to delete " + domain2delete,warningString,15,["Cancel","Continue"])}} on:save={(event)=>modifyDomain(event.detail.name,
        event.detail.value,
        event.detail.type
    )} bind:this={domainTable} domains={domainlist}/>
</Holder>

<Holder>
    <h2>Register a new domain</h2>
    <p>Registering a new domain is just a few clicks away! You can always get help from our <a href="https://wikipedia.com">Wiki</a></p>
    <Registrar on:click={(event)=>registerDomain(event.detail.domain,event.detail.type)}/>
</Holder>

<Modal overrideDefault={true} on:primary={()=>modalClose()} on:secondary={()=>modalConfirm()} bind:this={modal} options={["OK"]} description={""} title={""}></Modal>
<Blur reverse={false} bind:this={blurBackground}/>
<style>

</style>
