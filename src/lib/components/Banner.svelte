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
const lyrics = `
One day you'll look up at the ceiling above
If you're lucky you'll be surrounded by the ones that you love when
The lights in your eyes fade and life flashes by
One day you're going to die
One day you'll sleep and you'll never wake again
Heaven, hell, Nirvana, nothing, no one knows how it ends
Rest in peace or pieces and won't even know why
One day you're going to die
Read your horoscopes, your palms and tarot cards
But either way your destination ain't very far
You could drown, or choke, or burn, or be hit by a car
What doesn't kill you makes you stronger
But something will eventually
One day you'll look back at the life that you led
No more future left to fear that you'll have the past to regret
But your worries will be over if you truly realize
One day you're going to die
Take it away, hands
In the fabric of time and in the vastness of space
A billion amounts to nothing in infinity's face
At most a couple generations will remember the ways in which
Your life never mattered
So, who cares if it's a waste?
Well, one day you'll be not even a faint memory, no
At most a ghost or falling leaf from your family tree
Your legacy's not yours to see, nor is your eulogy
And you'll never know what it all means
But you'll be at peace before you sleep if you just keep this in mind
That everything and everyone goes with the passage of time
So whether it's cancer, murder, or suicide
One day you're going to die
No need to fear 'cause when it's here you won't be alive
Try not to think about it
One day you're going to die
And there's probably nothing after
One day you're going to die
So if you only have one chance
You oughta try your best to live as you like
One day you're going to die
`
//im sorry to whoevers trying to read this and seeing this horrible formatting and coding
console.log(heart)
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
            originalConsoleLog(lyrics);
        }
    }

    onMount(() => {
        setupConsoleCommandListener();
    });
</script>
