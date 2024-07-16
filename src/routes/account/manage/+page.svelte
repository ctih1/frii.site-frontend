<script lang="ts">
	import Button from '$lib/components/Button.svelte';
    import Holder from "$lib/components/Holder.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { onMount } from 'svelte';
    import { redirectToLogin,createFile } from '../../../helperFuncs';
    import { ServerContactor } from '../../../serverContactor';
    import Section from '$lib/components/Section.svelte';
    import Blur from '$lib/components/Blur.svelte';

    let serverContactor:ServerContactor;
    let modal:Modal;
    let noConfirm:boolean=true;

    let blurElement:Blur;
    let emailE:HTMLElement;
    let usernameE:HTMLElement;

    onMount(()=>{
        serverContactor=new ServerContactor(localStorage.getItem("auth-token"),localStorage.getItem("server_url"));
        getData();
    })

    function getData() {
        blurElement.show();
        serverContactor.getAccountDetails().then(response=>response.json()).then(data=>{
            emailE.innerHTML=`Email: ${data["email"]}`
            usernameE.innerHTML=`Username: ${data["username"]}`
            blurElement.hide();
        })
    }

    function handleDelete() {
        if(noConfirm) {
            modal.open("Are you sure you want to delete your account?","This is a destructive action which cannot be undone. Are you sure you want to continue?",15,["Cancel","Continue"]);
            noConfirm=false;
            return;
        }
        serverContactor.deleteAccoint().then(response=>{
            switch(response.status) {
                case 412:
                    redirectToLogin(412);
                    break;
                case 404:
                    modal.open("Failed to delete account (404)","Account deletion failed. Make sure your account exists.")
                    break;
                case 401:
                    redirectToLogin(401);
                    break;
                case 200:
                    modal.open("Please check your email.","A link to delete your account has been sent to your email.");
                    break;
            }
        })
    }
    function gpdrData() {
        serverContactor.getGDPR().then(response=>response.json()).then(data=>{
            createFile("data.json",JSON.stringify(data));
        });
    }
    function logOut() {
        localStorage.removeItem("logged-in");
        localStorage.removeItem("auth-token");
        redirectToLogin(200);
    }
</script>
<Blur bind:this={blurElement}/>
<Holder>
    <h1>Account management</h1>
    <Section title="Details" id="details">
        <div class="details">
            <h3 bind:this={emailE}>Email</h3>
            <h3 bind:this={usernameE}>Username</h3>
        </div>
    </Section>
    <h1>Manage your account</h1>
    <Section title="Manage" id="manage">
        <div class="buttons">
            <div><Button on:click={()=>gpdrData()} args={"padding"}>Download your data</Button></div>
            <div><Button on:click={()=>logOut()} args={"padding danger"}>Log out</Button></div>
            <div class="danger">
                <Button args={"danger padding"} on:click={()=>handleDelete()}>Delete your account</Button>
            </div>
        </div>
    </Section>
</Holder>

<Modal bind:this={modal} on:secondary={()=>handleDelete()} options={["Continue"]} title={""} description={""}></Modal>

<style>
    .buttons div {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }
</style>