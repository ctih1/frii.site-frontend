<!-- 
 <script lang="ts">
    import { getStatus } from "../../serverContactor";
    let height:number;
    let loaded:boolean=false;
    let danger:boolean=false;
    let message:string;

    if (Number(localStorage.getItem("notification-tocheck")).valueOf() >= Date.now()) {

        getStatus().then(response=> {
            if(response.status===204) {
                danger=false;
                loaded=true;
            } else if(response.status!==403) {
                response.text().then(data=>{
                    console.log(data);
                    danger=true;
                    message="balls";
                    loaded=true;
                })
            }
        });
        localStorage.setItem("notification-tocheck",(Date.now()+5*60).toString());
        localStorage.setItem("notification-message", message);

        loaded=true;
    } else {
        message = localStorage.getItem("notification-message") as string;
        loaded=true;
    }
    let hidden:boolean=(localStorage.getItem("notification-hidden")??false) as boolean;
</script>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
{#if loaded && danger}
    <div bind:clientHeight={height} class="bar">
        <span style="margin-left: 1em;" class="material-symbols-outlined">warning</span>
        <p>{message}</p>
    </div>
    <div style="height: {height}px" class="pusher"></div>
{/if}
<style>
    .bar {
        position: absolute;
        display: flex;
        align-items: center;
        background-color: var(--primary);
        min-width: 100vw;
        width: 100%;
        top: 0px;
        left: 0px;
    }
    .bar * {
        color: white;
    }
</style>
-->
<script>
    const heart = `
                          .,---.
                        ,/XM#MMMX;,
                      -%##########M%,
                     -@######%  $###@=
      .,--,         -H#######$   $###M:
   ,;$M###MMX;     .;##########$;HM###X=
,/@###########H=      ;################+
-+#############M/,      %##############+
%M###############=      /##############:
H################      .M#############;.
@###############M      ,@###########M:.
X################,      -$=X#######@:
/@##################%-     +######$-
.;##################X     .X#####+,
 .;H################/     -X####+.
   ,;X##############,       .MM/
      ,:+$H@M#######M#$-    .$$=
           .,-=;+$@###X:    ;/=.
                  .,/X$;   .::,   
`;

    import { onMount } from 'svelte';

    function setupConsoleCommandListener() {
        const originalConsoleLog = console.log;

        console.log = function (...args) {
            if (args.includes('i really like will wood')) {
                clearConsole();
                playMusic();
            }
            originalConsoleLog.apply(console, args);
        };

        function clearConsole() {
            if (console.clear) {
                console.clear();
            }
        }

        function playMusic() {
            const audio = new Audio('https://play.whatdidyouexpect.eu/momentomori.mp3');
            audio.play();
            originalConsoleLog(heart);
        }
    }

    onMount(() => {
        setupConsoleCommandListener();
    });
</script>
