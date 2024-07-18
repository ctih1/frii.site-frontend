<script lang="ts">
    import { t,l,locale,addArguements } from '$lib/translations'
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
    <h1>{$t("common.security_report_title")}</h1>
    <p>{@html $t("common.security_report_description_page")}</p>

    <form>
        <input type="text" bind:value={endpoint} placeholder={$t("common.security_report_endpoint")}>
        <input type="text" bind:value={expected} placeholder={$t("common.security_report_expected")}>
        <input type="text" bind:value={actual} placeholder={$t("common.security_report_actual")}>
        <textarea placeholder={$t("common.security_report_description")} bind:value={description}></textarea>
        <textarea placeholder={$t("common.security_report_steps")} bind:value={reproduce}></textarea>
        <input type="number" bind:value={importance} max=5 min=0 placeholder={$t("common.security_report_importance")}>
        <input type="text" bind:value={impact} placeholder={$t("common.security_report_impact")}>
        <input type="text" bind:value={attacker} placeholder={$t("common.security_report_attacker")}>
        <input type="email" bind:value={contactEmail} placeholder={$t("common.security_report_email")}>
        <Button on:click={()=>onFormSubmit()} args={"fill padding"}>{$t("common.security_report_submit")}</Button>
    </form>
</Holder>

<style>
    form * {
        margin-top: 0.1em;
        margin-bottom: 0.1em;
    }
</style>