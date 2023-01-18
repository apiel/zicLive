import { readdir, readFile } from 'fs/promises';
import { Color } from 'zic_node_ui';
import { config } from './config';
import { color } from './style';

export interface Track {
    id: number;
    name: string;
    type: string; // Type of patches (PD, zicSynth, midi, etc.)
    color?: Color;
}

const tracks: Track[] = [];

export const getTracks = () => tracks;
export const getTrack = (id: number) => tracks[id];

export const getTrackColor = (id: number) =>
    tracks[id].color || color.tracks[id % color.tracks.length];

export async function loadTracks() {
    try {
        // Going through track folder is questionable as for the moment 
        // tracks are hardcoded in the app... However, would be great to make track assignement dynamic!
        const names = await readdir(config.path.tracks);
        for (const name of names) {
            const track = JSON.parse((await readFile(`${config.path.tracks}/${name}`)).toString());
            // track.id = parseInt(path.parse(name).name);
            tracks.push(track);
        }
    } catch (error) {
        console.error(`Error while loading tracks`, error);
    }
}
