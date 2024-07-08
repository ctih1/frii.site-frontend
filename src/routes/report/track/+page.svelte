<script lang="ts">
    import Road from '$lib/components/Road.svelte';
    import Holder from '$lib/components/Holder.svelte';
    export let data:Object;
    let reportData:Map<string,any> = new Map(Object.entries(data));
    let reportSteps:Map<string,any> = new Map(Object.entries(reportData.get("progress")));
    let reportProgress:Array<Object> = reportSteps.get("progress");
    console.log(reportProgress);

    function epochToDate(epoch: number):string {
        let d = new Date(0);
        d.setSeconds(epoch);
        return d.toLocaleString();
    }

    const getOrderedReports = (array:Array<any>) => {
        return array.sort((a,b)=> {
            console.log(new Map(Object.entries(b)).values().next().value);
            return new Map(Object.entries(b)).values().next().value - new Map(Object.entries(a)).values().next().value();
        });
    }
</script>

<Holder args="fill">
    <h1>Progress</h1>
    <p>Here you can see your report progress and the latest comments from developers.</p>
    <Road points={["First stage","Second stage","Third stage","Forth stage","Fifth stage"]} color={"#FFF"} completed={2}></Road>
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
</style>