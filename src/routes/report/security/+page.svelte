<script lang="ts">
	import Button from '$lib/components/Button.svelte';
    import Holder from "$lib/components/Holder.svelte";
    import Blur from "$lib/components/Blur.svelte";
    import Modal from "$lib/components/Modal.svelte"
    import { reportVulnerability } from "../../../serverContactor";
    let endpoint:string="";
    let expected:string="";
    let actual:string="";
    let importance:number=0;
    let description:string="";
    let reproduce:string="";
    let attacker:string="";
    let contactEmail:string=""
    let impact:string=""

    let blur:Blur;
    let modal:Modal;
    function onFormSubmit() {
        if(!(endpoint||expected||actual||importance||description||reproduce||attacker||contactEmail)) {modal.open("Failed to send report","Please fill in all of the requested fields."); return;}
        blur.show();
        reportVulnerability(endpoint,expected,actual,importance,description,reproduce,impact,attacker,contactEmail).then(response=>{
            blur.hide();
            if(response.status===200) {
                response.json().then(data=>{
                    modal.open("Succesfully report vulnerability",`We will look into your report as soon as possible. You can check the status of your report with the following link: <a href=/report/track?code=${data["code"]}>https://frii.site/report/track?code=${data["code"]}</a>`);
                })
            } else {
                modal.open("Failed to report vulnerability","Please contact us at urgent@frii.site");
            }
        });
    }
</script>

<Blur bind:this={blur}></Blur>
<Modal bind:this={modal} title={""} description={""} options={["OK"]}></Modal>
<Holder>
    <h1>Report a vulnerability</h1>
    <p>This is the page for reporting a vulnerability in frii.site. Please refer to <a href="https://github.com/ctih1/frii.ste-frontend/SECURITY.md">the vulnerability reporting guide</a></p>

    <form>
        <input type="text" bind:value={endpoint} placeholder="API Endpoint or website URL">
        <input type="text" bind:value={expected} placeholder="Expected behaviour">
        <input type="text" bind:value={actual} placeholder="Actual behaviour">
        <input type="number" bind:value={importance} max=5 min=0 placeholder="Importance (0-5, 5 being the most urgent)">
        <textarea placeholder="Vulnerability description" bind:value={description}></textarea>
        <textarea placeholder="Steps to reproduce" bind:value={reproduce}></textarea>
        <input type="text" bind:value={impact} placeholder="Impact of the issue">
        <input type="text" bind:value={attacker} placeholder="How an attacker could use this">
        <input type="email" bind:value={contactEmail} placeholder="An email address where we can contact you for updates">
        <Button on:click={()=>onFormSubmit()} args={"fill padding"}>Submit</Button>
    </form>
</Holder>

<style>
    form * {
        margin-top: 0.1em;
        margin-bottom: 0.1em;
    }
</style>