<!-- Planned to make it a vinyl but got lazy and made it a CD-->
<script>
  import { onMount } from 'svelte';
  import { error, fetchTrack, loading, track } from '../stores/trackStore.js';

  onMount(() => {
    if ($track) {
      console.log('Loaded cached song');
    } else {
      fetchTrack();
    }

    const interval = setInterval(() => {
      if (!$track) {
        fetchTrack();
      }
    }, 2000);

    return () => clearInterval(interval);
  });
</script>

{#if $loading}
  <p>Loading latest track...</p>
{:else if $error}
  <p style="color:red">Error: {$error}</p>
{:else if $track}
<div class="track-container">
  <a href={$track.url} target="_blank" rel="noopener noreferrer" class="track-link">
    <div class="vinyl">
      <img src={$track.image} alt="Album cover" />
    </div>
    <div class="track-info">
      <div class="track-name">{$track.name}</div>
      <div class="track-artist">{$track.artist} — {$track.album}</div>
    </div>
  </a>
</div>
{:else}
  <p>No track info available.</p>
{/if}

<style>
.track-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.track-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.vinyl {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid black;
  box-shadow: 0 0 5px rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  animation: spin 5s linear infinite;
}

.vinyl::after {
  content: '';
  position: absolute;
  width: 12px;  
  height: 12px;
  background: black; 
  border-radius: 50%;
  z-index: 2;
}


.track-info {
  text-align: center;
}

.track-name {
  font-weight: bold;
}

.track-artist {
  font-size: 0.9rem;
  color: gray;
}
</style>