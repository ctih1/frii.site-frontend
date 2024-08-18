<script>
// @ts-nocheck

    import { page } from '$app/stores';
  </script>

<div class="container">
  <h1>{$page.status}</h1>
  <p>{$page.error.message}</p>
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        min-width: 100vw;
        width: 100%;
        min-height: 100vh;
        height: 100%;
    }
    .container h1, p {
        margin-top: 5px;
        margin-bottom:  5px;
    }
</style>