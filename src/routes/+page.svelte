<script lang="ts">
    //@ts-ignore
    import { t } from '$lib/translations';
    import Holder from '$lib/components/Holder.svelte';
    import BubbleBackground from "$lib/components/BubbleBackground.svelte";
    import Review from "$lib/components/Review.svelte"
    import Button from "$lib/components/Button.svelte";
    import { onMount,onDestroy } from 'svelte'
    import Footer from "$lib/components/Footer.svelte";
    import BlogCard from "$lib/components/BlogCard.svelte"
    import { serverURL } from '../serverContactor';
    let blogsShouldBeShown:boolean=true

    interface Ireview {
      author: string,
      description: string,
      stars: number
    }

    interface Iblog {
      url:string,
      created:number,
<<<<<<< HEAD
<<<<<<< HEAD
      body:string,
      title:string
=======
>>>>>>> 41221a1 (remade index)
=======
      body:string,
      title:string
>>>>>>> 344f4ce (I/seo (#183))
    }

    let reviews: Ireview[] = [
      {
        author:"Rage65",
        description: "I have been using (frii.site) to get a domain for my website for a while now and it's been great!",
        stars: 5
      },
      {
        author: "Luka Rantalainen",
        description: "frii.site has served me well for my domain registraation needs.",
        stars: 4
      },
      {
        author: "Planethac",
        description: "Good service for a good price!",
        stars: 4
      }
    ]
    let blogs: Iblog[] = [];
    onMount(()=>{
      async function load() {
<<<<<<< HEAD
<<<<<<< HEAD
        await fetch(`${serverURL}/blog/get/all?n=3&content=80`).then(response=>{
=======
        await fetch(`${serverURL}/blog/get/all?n=6`).then(response=>{
>>>>>>> 41221a1 (remade index)
=======
        await fetch(`${serverURL}/blog/get/all?n=3&content=80`).then(response=>{
>>>>>>> 344f4ce (I/seo (#183))
          if(response.status!==200) { blogsShouldBeShown=false; console.log("Failed to load blogs"); return; }
          response.json().then(data=>{
            blogs = data as Iblog[];
          })
        })
      }
      load();
    })
</script>
<svelte:head>
    <title>frii.site - Register subdomains for free!</title>
</svelte:head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<BubbleBackground>
    <div class="head">
        <h1 class="title" style="font-size: 10em">frii.site</h1>
        <p class="tagline">{$t("common.index_tagline")}</p>
        <div class="buttons">
            <Button on:click={()=>window.location.href="/account"} args="padding fill margin"><p class="button-text">{$t("common.index_register_account")}</p></Button>
            <Button on:click={()=>window.location.href="/dashboard"} args="padding fill margin secondary"><p class="button-text">{$t("common.index_goto_dashboard")}</p></Button>
        </div>
    </div>
    <div class="introduction-wrapper">
        <div class="center">
            <h1 style="font-size: 5em; margin-bottom: 0px;"><strong>{$t("common.index_aboutus")}</strong></h1>
            <hr style="width: 50%;opacity: 0.1; height: 4px;"/>
            <p class="description" style="margin-top: 10px;">{@html $t("common.index_aboutus_description")}
        </div>
        <div class="left">
            <h2><span class="material-symbols-outlined">lock_open_right</span>{$t("common.index_tp_freedom")}</h2>
            <p>{$t("common.index_tp_freedom_desc")}</p>
        </div>
        <div class="right">
            <h2><span class="material-symbols-outlined">lock</span>{$t("common.index_tp_security")}</h2>
            <p>{$t("common.index_tp_security_desc")}</p>
        </div>
        <div class="bottom-left">
            <h2><span class="material-symbols-outlined">support</span>{$t("common.index_tp_support")}</h2>
            <p>{$t("common.index_tp_support_desc")}</p>
        </div>
        <div class="bottom-right">
            <h2><span class="material-symbols-outlined">encrypted</span>{$t("common.index_tp_privacy")}</h2>
            <p>{$t("common.index_tp_privacy_desc")}</p>
        </div>
    </div>
    <div class="reviews">
        <h1 style="font-size: 3em;">{$t("common.index_reviews")}</h1>
        <div class="review-cards">
            {#each reviews as review, index}
                <Review descrption={review.description} author={review.author} stars={review.stars} index={index}/>
            {/each}
        </div>
    </div>
    <div class="blogs">
        <h3 style="font-size: 3em; width: fit-content; margin-left: auto; margin-right: auto;">Latest updates</h3>
        <div class="latest-releases">
            {#each blogs as blog}
<<<<<<< HEAD
<<<<<<< HEAD
                <BlogCard title={blog.title} description={blog.body} date={blog.created} url={blog.url}/>
=======
                <BlogCard urlTitle={blog.url}/>
>>>>>>> 41221a1 (remade index)
=======
                <BlogCard title={blog.title} description={blog.body} date={blog.created} url={blog.url}/>
>>>>>>> 344f4ce (I/seo (#183))
            {/each}
        </div>
    </div>
    <div class="bottom-hooker">
        <h1>{$t("common.index_bottom_hook")}</h1>
        <p>{$t("common.index_bottom_hook_desc")}</p>
        <div class="button-hook">
            <Button on:click={()=>window.location.href="/account"} args="padding fill margin"><p class="button-text">{$t("common.index_register_account")}</p></Button>
        </div>
    </div>
    <Footer/>
</BubbleBackground>

<style>
    .head {
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        height: 100vh;
    }

    .title {
        margin-bottom: 0px;
    }
    .tagline {
      padding: 0px 2em 1em 2em;
      margin: 0px;
      font-size: 25px;
    }

    .buttons {
      display: flex;
      justify-content: space-evenly;
      width: 50%;
      height: 3em;
      margin-left: auto;
      margin-right: auto;
    }

    .button-text {
      font-size: 1.5em;
    }

    .introduction-wrapper {
        display: grid;
        min-width: 100vw;
        min-height: 100vh;
        grid-template-rows: repeat(3,1fr);
        grid-template-columns: repeat(3,1fr);
        margin-top: 2em;
    }
    .introduction-wrapper div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1em;
        text-align: center;
    }
    .introduction-wrapper div h2 {
      display: flex;
      align-items: center;
      font-size: 3em;
      margin-bottom: 0px;
    }
    .introduction-wrapper div h2 span {
        color: var(--primary);
        font-size: 1em;
    }
    .center {
      grid-area: 2 / 2 / 3 / 3;
      text-align: center;
      min-width: fit-content;
      grid-column:  1 / 4;
      background-color: initial !important;
    }
    .description {
      max-width: 80ch;
    }
    .left {
        grid-area: 1 / 1 / 2 / 2;
    }
    .bottom-left {
        grid-area: 3 / 1 / 4 / 2;
    }
    .bottom-right {
        grid-area: 3 / 3 / 4 / 4;
    }
    .right {
        grid-area: 1 / 3 / 2 / 4;
    }

    .blogs {
        margin-top: 25vh;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .latest-releases {
      display: grid;
      grid-template-columns: repeat(3,1fr);
<<<<<<< HEAD
      grid-template-rows: repeat(1, 1fr);
      margin-bottom: 25vh;
=======
      grid-template-rows: repeat(2, 1fr);
>>>>>>> 41221a1 (remade index)
      gap: 20px;
      padding: 2em;
    }

    .reviews {
        margin-top: 25vh;
        height: fit-content;
        margin-bottom: 50vh;
    }

    .reviews h1 {
        text-align: center;
    }

    .review-cards {
      display: flex;
      justify-content: space-evenly;
      width: 100vw;
    }

    .bottom-hooker {
        width: 100vw;
        text-align: center;
        margin-bottom: 75vh;
    }
    .bottom-hooker * {
        margin: 10px;
    }
    .bottom-hooker h1 {
        font-size: 5em
    }
    .bottom-hooker p {
        font-size: 1.75em;
    }

    .button-hook {
      width: 75%;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    @media(orientation:portrait) {
      .introduction-wrapper {
        display:flex !important;
        flex-direction: column;
      }
      .introduction-wrapper div {
        margin: 2em;
      }
      .buttons {
        width: 90vw;
      }
      .latest-releases {
          display: flex;
          flex-direction:column;
      }
      .review-cards {
          margin-left: auto;
          margin-right: auto;
          padding: 0px;
          flex-direction: column;
          justify-content: center;
          width: 100vw;
      }
      .bottom-hooker h1 {
          font-size: 3em;
      }
      .bottom-hooker p {
          font-size: 1.5em;
      }
<<<<<<< HEAD
      .title {
          font-size: 6em !important;
      }
=======
>>>>>>> 41221a1 (remade index)
    }

    @keyframes textChange {
        from {
            transform: translateX(0px);
            opcaity: 1;
        } to {
            transform: translateX(100px);
            opacity: 0;
        }
    }
</style>
