<script lang="ts">
    
</script>

<div class="placeholder"></div>

<style>

    @keyframes placeholderScrobbler {
        0% {
            background-position: 50% 0;
        }
        100% {
            background-position: -50% 0;
        }
    }

    .placeholder {
        width: 100%;
        height: 100%;
        min-height: 20px;
        animation-duration: 1.2s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: placeholderScrobbler;
        animation-timing-function: linear;
        background: #f6f7f8;
        background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
        background-size: 500% 100%;
        overflow: hidden;
        border-radius: 0.5em;
    }
</style>
