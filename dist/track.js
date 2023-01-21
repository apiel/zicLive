import { readFile } from 'fs/promises';
import { config } from './config';
import { color } from './style';
let tracks = [];
export const getTracks = () => tracks;
export const getTrack = (id) => tracks[id];
export const getTrackCount = () => tracks.length;
export const getTrackColor = (id) => tracks[id].color || color.tracks[id % color.tracks.length];
export async function loadTracks() {
    try {
        // Going through track folder is questionable as for the moment 
        // tracks are hardcoded in the app... However, would be great to make track assignement dynamic!
        tracks = JSON.parse((await readFile(config.path.tracks)).toString());
    }
    catch (error) {
        console.error(`Error while loading tracks`, error);
    }
}
