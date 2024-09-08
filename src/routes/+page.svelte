<script lang="ts">
    //@ts-ignore
    import { t } from '$lib/translations';
    import Holder from '$lib/components/Holder.svelte';
    import BubbleBackground from "$lib/components/BubbleBackground.svelte";
    import Button from "$lib/components/Button.svelte";
    import { serverURL } from '../serverContactor';
    import { onMount } from 'svelte';

  let responseText = 'Loading...';

  const serverURL2 = String(localStorage.getItem("server_url"));


  onMount(async () => {
    try {
      const response = await fetch(serverURL2);
      if (response.ok) {
        responseText = await response.text();
      } else {
        responseText = 'Error: Unable to fetch data';
      }
    } catch (error) {
      responseText = 'Error: ' + error.message;
    }
  });



</script>
<svelte:head>   
    <title>frii.site</title>
</svelte:head>

<BubbleBackground>
<div class="content">
    <div class="parent">
        <div class="div1"> 
            <div class="text-container">
                <h1 style="color: white;"><strong>frii.site</strong></h1>
                <p style="color: white; font-size: 1.5em;"><i>{ $t("common.index_description") }</i></p>
            </div>
        </div>

        <div class="div2"> 
            <div class="div2-content">
                <div class="button-holder">
                    <x class="bh"><Button on:click={()=>{window.location.href="/account";}} args={"fill"}><a style="color: #ffffff;" href="/account">{$t("common.index_register_account")}</a></Button></x>
                    <x class="bh"><Button on:click={()=>{window.location.href="/dashboard";}} args={"fill"}><a style="color: #ffffff;" href="/dashboard">{$t("common.index_goto_dashboard")}</a></Button></x>
                    <p style="color: black">hello!</p>
                    <p></p>
                    <x class="bh">
                      
                        <Button on:click={()=>{window.location.href="/tokenLogin";}} args={"fill"}>
                          <a style="color: #ffffff;" href="#">{$t("common.index_token_login")}</a>
                        </Button>
                      </x>

                      <x class="bh">
                        <Button on:click={()=>{window.location.href="/serverURL";}} args={"fill"}>
                            <a style="color: #ffffff;" href="#">{$t("common.index_set_server")}</a>
                        </Button> 

                      </x>
                </div>  
                
            </div>  
        </div>

        <div class="div3">
    
        </div>

        <div class="div4">
           
        </div>
        <p style="color: grey;">this version of frii.site is mantained by <a style="color: grey; " href="https://github.com/whatdidyouexpect"><u>whatdidyouexpect</u></a> on github!</p><p style="color: grey; position: absolute; right: 0; bottom: 0; margin: 10px;">Server Response: {responseText}</p>

        
    </div>
    
</div>


</BubbleBackground>
<style>
    .parent {
        display: grid;
        grid-template-columns: 3fr 2fr;
        grid-template-rows: 1fr 5fr 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        width: 100vw;
    }

    .div1 {
        grid-area: 2 / 1 / 3 / 2;
        text-align: center;
        display: flex;
        flex-direction: column;
    }
    
    .text-container {
        margin-top: auto;
        margin-bottom: auto;
    }
    .text-container * {
        height: fit-content;
        margin-top: 0px;
        margin-left: 0.5em;
    }
    .button-holder {
        display: flex;
        flex-direction: row;
        margin-right:auto;
        height: 15%;
        width: 60%;
    }
    .button-holder x {
        margin: 2px;
        display: flex;
        width: 45%;
        height: 100%;
        min-width: 80px;
        min-height: 50px;
    }
    .div2-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .div2 {
        display: flex;
        grid-area: 2 / 2 / 3 / 3; 
    }
    .div3 { grid-area: 1 / 1 / 2 / 3; }
    .div4 { grid-area: 3 / 1 / 4 / 3; }

    h1 {
        font-size: 10em;
        font-weight: 500;
        margin-bottom: 0px;
    }
    .content {
        display: flex;
        flex-direction: row;
        width: 100vw;
        min-height: 100vh;
        height: 100%;
        color: white;
    }

    @media(max-width: 1330px) {


    } 
    @media(max-width: 1030px) {
        h1 {
            font-size: 7em;
        }
        h2 {
            font-size: 5em;
        }
        h3 {
            font-size: 1.5em;
        }
    }
    @media (orientation: portrait), (max-width: 870px) {
        .parent {
            margin-top: auto;
            margin-bottom: auto;
            grid-template-columns: 1fr;
            grid-template-rows: auto;
        } 
        .parent * {
            align-items: center;
            margin-right: auto;
            margin-left: auto;
        }
        .button-holder x {
            width: 45%;
            height: 4em;
        }
        .button-holder x button a {
            font-size: 1.25em !important;
            font-weight: 500;
        }
        .button-holder x:last-child {
            margin-left: 4px;
        }
        .button-holder x:first-child {
            margin-right: 4px;
        }
        .info {
            font-weight: 300;
            margin-left: 2em;
            margin-right: 2em;
        }  
        .parent div {
            grid-area: auto/auto/auto/auto;
            width: 100vw;
            height: fit-content;
            
        }
        .parent div * {
            margin-left: auto;
            margin-right: auto;
        }
        h1 {
            font-size: 12em;
        }
        .text-container {
            text-align: center;
        }
        .info {
            font-weight: 500;
            margin-right: 2em !important;
            margin-left: 2em !important;
            max-width: 80ch;
        }   
    }
    @media(max-width: 795px), (orientation: landscape) {
        h1 {
            font-size: 10em;
        }
        h2 {
            font-size: 8em;
        }
    }
    @media(max-width: 690px) {
        h1 {
            font-size: 8em;
        }
        h2 {
            font-size: 6em;
        }
    }
    @media(max-width: 450px) {
        h1 {
            font-size: 7em;
        }
        h2 {
            font-size: 5em;
        }
        .button-holder {
            width: 100%;
        }
        .info {
            margin-right: 1em !important;
            margin-left: 1em !important;
        }   
    }
    @media(max-width: 300px) {
        h1 {
            font-size: 5em;
        }
        h2 {
            font-size: 3em;
        }
        h2 {
            font-size: 4em;
        }
    }
    .info {
        font-weight: 500;
        margin-right: 10vw;
        max-width: 80ch;
    }   

    h2 {
        font-size: 6em;
        max-width: 90vw;
        overflow-wrap: break-word;
    }
    h3 {
        font-size: 2em;
    }
</style>
