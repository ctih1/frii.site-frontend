<script lang="ts">
	import Section from '$lib/components/Section.svelte';
    import Road from '$lib/components/Road.svelte';
    import Holder from '$lib/components/Holder.svelte';
    import Scale from '$lib/components/Scale.svelte';
    export let data:Object;
    let reportData:Map<string,any> = new Map(Object.entries(data));
    let reportSteps:Map<string,any> = new Map(Object.entries(reportData.get("progress")));
    let reportMains:Map<string,boolean> = reportSteps.get("steps");
    let reportProgress:Array<Object> = reportSteps.get("progress");
    
    function epochToDate(epoch: number):string {
        let d = new Date(0);
        d.setSeconds(epoch);
        return d.toLocaleString();
    }
    //@ts-ignore
    const getOrderedReports = (array) => {
        //@ts-ignore
        return array.sort((a,b)=>{
            let aValue=new Map(Object.entries(a)).values().next().value;
            let bValue=new Map(Object.entries(b)).values().next().value
            return bValue-aValue;
        })
    }

    function getCompleted(status:Object):number {
        let total:number=0;
        new Map(Object.entries(status)).forEach((value:boolean,key:string)=>{
            //@ts-ignore
            total+=value;
        });
        return total;
    }

</script>

<Holder args="fill">
    <h1>Progress</h1>
    <p>Here you can see your report progress and the latest comments from developers.</p>
    <Road points={["Seen","Reviewed","Development done","Done"]} color={"#FFF"} completed={getCompleted(reportMains)}></Road>
    <ul>
        {#each getOrderedReports(reportProgress) as key, index} 
            <li>
                <div class="content">
                    <div class="ball"></div>
                    <span>{new Map(Object.entries(key)).keys().next().value}</span>
                    <span class="time">{epochToDate(new Map(Object.entries(key)).values().next().value)}</span>
                </div>
                <div class="line"></div>
            </li>
        {/each} 
    </ul>
</Holder>

<Holder args="fill">
    <h1>Information about your report</h1>
    <div class="information">
        <Section id="basic" title="Basic information">
            <div class="lot-text">
                <p>Endpoint: {reportData.get("endpoint")}</p>
                <p>Expected behaviour: {reportData.get("expected")}</p>
                <p>Actual behaviour: {reportData.get("actual")}</p>
                <p>The impact: {reportData.get("impact")}</p>
                <p>Contact email: {reportData.get("email")}</p>
                <p style="height: 1em" class="importance"><span style="margin-right: 0.5em;">Importance:</span> <Scale max={5} value={reportData.get("importance")}  /></p>
            </div>
        </Section>
        <Section id="in-depth" title="In-depth information">
            <div class="lot-text">
                <p>Description: {reportData.get("description")}</p>
                <p>How this could be abused: {reportData.get("attacker")}</p>
                <p style="height: 1em" class="importance"><span style="margin-right: 0.5em;">Priority:</span> <Scale max={5} value={reportData.get("deemed-importance")}/></p>
            </div>
        </Section>
    </div>
    <ul>
        
    </ul>
</Holder>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
    * {
        font-family: "Inter",sans-serif;
    }
    ul {
        padding-left: 0px;
    }
    li {

        list-style: none;
        padding-left: 0.5em;
        padding-right: 0.5em;
        padding-top: 2em;
        padding-bottom: 2em;
        background-color: var(--background-color);
    }
    li:first-child {
        border-top-left-radius: 0.5em;
        border-top-right-radius: 0.5em;
    }
    li:last-child {
        border-bottom-left-radius: 0.5em;
        border-bottom-right-radius: 0.5em;
    }
    li:last-child .line {
        height: 0px;
    }
    .line {
        width: 100%;
        height: 3px;
        background-color: black;
        opacity: 0.2;
        transform: translateY(25px);
    }
    .time {
        opacity: 0.5;
        margin-left: 2em;
    }
    .ball {
        width: 2em;
        aspect-ratio: 1;
        background-color: #fff;
        border-radius: 100%;
        margin-right: 0.5em;
    }
    .content {
        display: flex;
        text-align: center;
        align-items: center;    
    }
    .lot-text * {
        margin-top: 3px;
        margin-bottom: 3px;
    }
    .importance {
        display: flex;
        flex-direction: row;
        width: 25vw;
        align-items: center;
        height: fit-content;
    }
</style>