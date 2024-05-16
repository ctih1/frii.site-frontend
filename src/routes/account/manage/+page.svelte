<script lang="ts">
	import Button from '$lib/components/Button.svelte';
    import Holder from "$lib/components/Holder.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { onMount } from 'svelte';
    import { redirectToLogin,createFile } from '../../../helperFuncs';
    import { ServerContactor } from '../../../serverContactor';


    let serverContactor:ServerContactor;
    let modal:Modal;
    let noConfirm:boolean=false;
    onMount(()=>{
        serverContactor=new ServerContactor(localStorage.getItem("auth-token"));
    })
    function handleDelete() {
        if(noConfirm) {
            modal.open("Are you sure you want to delete your account?","This is a destructive action which cannot be undone. Are you sure you want to continue?",15,["Cancel","Continue"]);
        }
        else {
            noConfirm=true;
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
            console.log(data);
        });
    }
    function logOut() {
        localStorage.removeItem("logged-in");
        localStorage.removeItem("auth-token");
        redirectToLogin(200);
    }
</script>

<Holder>
    <h1>Manage your account</h1>
    <div class="buttons">
        <Button on:click={()=>gpdrData()} args={"padding"}>Download your data</Button>
        <Button on:click={()=>logOut()} args={"padding danger"}>Log out</Button>
        <div class="danger">
            <Button args={"danger padding"} on:click={()=>handleDelete()}>Delete your account</Button>
        </div>
    </div>
</Holder>

<Modal bind:this={modal} on:secondary={()=>handleDelete()} options={["Continue"]} title={""} description={""}></Modal>

<style>
    .buttons l {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }
</style>