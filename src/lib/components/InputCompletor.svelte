<script lang="ts">
    import { createEventDispatcher } from "svelte";
    interface choices {
        displayText: string,
        valueText:string
    }

    let dispatcher = createEventDispatcher();
    export let suggestions:choices[];
    export let requiresLetter:boolean=false;
    export let inputPlaceholder:string;
    export let removeUsed:boolean;
    let results:choices[]=[];
    let input:HTMLInputElement;

    if(!requiresLetter) {
        results=suggestions;
    }
    let search:string="";
    let choices:HTMLDivElement;
    let resultIndex:number=0;
    let tabResult:string;
    let resultElements:HTMLElement[]=[];
    let deletedOptions:choices[]=[];

    export function removeFromDeleted(choice:choices) {
        deletedOptions = deletedOptions.filter(function(item) {
            return item!=choice
        });
        updateResults();
    }
    
    function updateResults(): void {
        results=[];
        suggestions.forEach((suggestion)=>{
            if(suggestion.displayText.toLowerCase().includes(search.toLowerCase()) && !deletedOptions.includes(suggestion)) {
                results.push(suggestion);
            }
        });
    }

    function resultClicked(event:any) {
    }

    function sendInput(choice:choices|undefined):void {
        if(choice===undefined) { return; }
        deletedOptions.push(choice);
        results=results.filter(function(suggestion) {
            return suggestion.displayText!==choice.displayText
        });
        dispatcher("enter",choice);
        search="";
    }

    function handleKey(event:any) {
        if(event.key==="Tab") {
            event.preventDefault();
            resultElements.filter(Boolean).forEach((element)=>{
                element.classList.remove("selected");
            })
            resultElements.at(resultIndex)?.classList.add("selected");
            if(resultIndex>=resultElements.filter(Boolean).length -1) {
                resultIndex = 0;
            } else {
                resultIndex++;
            }
        }
        if(event.key==="Enter") {
            if(resultIndex!==0) {resultIndex-=1}
            sendInput(results.at(resultIndex));
            updateResults();
        }
    }
</script>

<div class="holder">
    <input  bind:this={input} on:focus={()=>{choices.style.visibility="visible"; updateResults()}} bind:value={search} on:input={()=>updateResults()} on:keydown={handleKey} placeholder={inputPlaceholder}>
    <div bind:this={choices} class="choices">
        <ul class="choice-list">
            {#each results as result, index}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <li bind:this={resultElements[index]} on:mouseover={()=>{resultIndex=index;resultElements[index].classList.add("selected")}} on:mouseleave={()=>{resultElements[index].classList.remove("selected")}} on:click={()=>{sendInput(result)}}><span>{result.displayText}</span> <span style="margin-right: 0px; margin-left: auto;" class="material-symbols-outlined">add_circle</span></li>
            { /each}
        </ul>
    </div>
    <div class="selected"></div> <!-- Fixes selte issue where selected class isnt rendered because its unused-->
</div>


<style>
    .choices {
        visibility: hidden;
    }
    .choice-list {
        list-style: none;
        padding: 0px;
    }
    .choice-list:first {
        background-color: var(--primary);
    }
    li {
        border-radius: 0.25em;
        padding-left: 2px;
        padding-right: 2px; 
        box-shadow: 0px 10px 42px -18px rgba(0,0,0,0.75);
        margin: 0.25em;
    }
    
    li:hover {
        cursor: pointer;
    }
    input:focus + ul{
        background-color: black;
    }

    .selected {
        background-color: var(--primary);
        color: white;
    }

    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    input {
        height: 2em;
    }
</style>