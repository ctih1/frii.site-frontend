<script lang="ts">
    import { onMount } from "svelte";
    import { ServerContactor } from "../../../serverContactor";
    import { redirectToLogin } from "../../../helperFuncs";
    import Holder from "$lib/components/Holder.svelte";
    import Button from "$lib/components/Button.svelte";
    import Collapse from "$lib/components/Collapse.svelte";
    import { redirect } from "@sveltejs/kit";
    import Scale from "$lib/components/Scale.svelte";

    let descriptionText:string;
    let reports:Array<any> = [];
    onMount(()=>{
        let sc:ServerContactor = new ServerContactor(localStorage.getItem("auth-token"),localStorage.getItem("server_url"));
        sc.getVulns().then(response=>{
            if(response.status!==200) { redirectToLogin(401); }
            response.json().then(data=>{
                reports = Object.keys(data).map(function(index){
                    let report = data[index]
                    return report
                });
            });
        })
    });

    //@ts-ignore
    const getOrderedReports = (array) => {
        //@ts-ignore
        return array.sort((a,b)=>{
            let aValue=new Map(Object.entries(a)).get("importance");
            let bValue=new Map(Object.entries(b)).get("importance");
            //@ts-ignore
            return bValue-aValue;
        })
    }
    function getDescription(description:unknown|undefined) {
        return description as string;
    }
</script>

{#each getOrderedReports(reports) as item}
    <Holder>
        {@const report=new Map(Object.entries(item))}
        {@const descriptionText=getDescription(report.get("description"))}
           
        <h1>{report.get("_id")}</h1>
        <div class="content">
            <p>Endpoint: {report.get("endpoint")}</p>
            <p>Description: {(descriptionText.toString().length>50)?(descriptionText.substring(0,50)+"..."):(report.get("description"))}</p>
            <p>Email: {report.get("email")}</p>
            <Scale max={5} value={new Number(report.get("importance")).valueOf()}></Scale>
            <Collapse title={"Advanced"}>
                <p>Expected: {report.get("expected")}</p>
                <p>Behaviour: {report.get("actual")}</p>
                <p>Impact: {report.get("impact")}</p>
                <p>Steps: {report.get("steps")}</p>
                <p>Description: {report.get("description")}</p>
            </Collapse>
        </div>
        <Button on:click={()=>(window.location.href=`/report/manage/${report.get('_id')}`)} args="fill padding">Manage</Button>
    </Holder>
{/each}

<style>
    .content * {
        margin-top: 2px;
        margin-bottom: 2px;
    }

</style>