import { writable } from 'svelte/store';

export const track = writable(null);
export const loading = writable(false);
export const error = writable(null);

const CACHE_EXPIRY_MS = 60 * 1000;

function getCachedTrack() {
    if (typeof window === 'undefined') return null;

    const cached = localStorage.getItem('cachedTrack');
    if (!cached) return null;

    try {
        const parsed = JSON.parse(cached);
        if (!parsed.timestamp || !parsed.data) return null;

        const age = Date.now() - parsed.timestamp;
        if (age < CACHE_EXPIRY_MS) {
            return parsed.data;
        } else {
            localStorage.removeItem('cachedTrack');
            return null;
        }
    } catch {
        localStorage.removeItem('cachedTrack');
        return null;
    }
}

if (typeof window !== 'undefined') {
    const cachedTrack = getCachedTrack();
    if (cachedTrack) {
        track.set(cachedTrack);
    }
}

export async function fetchTrack() {
    if (typeof window !== 'undefined' && getCachedTrack()) {
        console.log('%c CACHED - skip fetching', 'font-weight: bold; color: orange;');
        return;
    }

    loading.set(true);
    error.set(null);

    try {
        const res = await fetch('https://lastfm-last-played.biancarosa.com.br/expect69420/latest-song');
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();

        const normalizedTrack = {
            name: data.track.name,
            artist: data.track.artist['#text'],
            album: data.track.album['#text'],
            url: data.track.url,
            nowPlaying: data.track['@attr']?.nowplaying === 'true',
            image: data.track.image.find(img => img.size === 'medium')?.['#text'] || ''
        };

        track.set(normalizedTrack);

        if (typeof window !== 'undefined') {
            localStorage.setItem('cachedTrack', JSON.stringify({
                timestamp: Date.now(),
                data: normalizedTrack
            }));
        }
    } catch (e) {
        error.set(e.message);
        track.set(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cachedTrack');
        }
    } finally {
        loading.set(false);
    }
}