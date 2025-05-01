<script lang="ts">
    import Holder from "$lib/components/Holder.svelte"; 
    import { onMount } from "svelte";

    let lossValue: number = $state(0);

    let views = $state(0); 
    const ADS_PER_PAGE = 2;
    const CLICK_THROUGH_RATE = 0.015;
    const COST_PER_CLICK = 0.1;

    onMount(() => {
        views = Number(localStorage.getItem("views"));
    })

    function calculateLoss() {
        return Math.round((views * ADS_PER_PAGE * CLICK_THROUGH_RATE * COST_PER_CLICK)*1000)/1000;
    }

    
</script>

<Holder>
    <h1>Due to you using an adblocker</h1>
    <p>(Naively assuming that you click an ad 3 out of 20 times with a cost per click of $0.1)</p>

    <p>You have lost me ${calculateLoss()} in ad revenue</p>
    <p>Note: we currently don't have ads running on any of our sites. So you haven't made us lose anything yet</p>
</Holder>