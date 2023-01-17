import { Patch } from './patch';
import { getPattern } from './pattern';
import { color } from './style';
import { Track } from './track';

export const tracks: Track[] = [
    { id: 0, color: color.tracks[0] },
    { id: 1, color: color.tracks[1] },
    { id: 2, color: color.tracks[2] },
    { id: 3, color: color.tracks[3] },
    { id: 4, color: color.tracks[4] },
    { id: 5, color: color.tracks[5] },
    { id: 6, color: color.tracks[6] },
    { id: 7, color: color.tracks[7] },
];

export const patches: Patch[] = [
    { id: 0, name: 'Kick' },
    { id: 1, name: 'Organic' },
    { id: 2, name: 'Melo' },
    { id: 3, name: 'Bass' },
    { id: 4, name: 'Midi ch1' },
    { id: 5, name: 'Midi ch2' },
    { id: 6, name: 'Psy' },
    { id: 7, name: 'Drone' },
];
export const presets = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
];

export const playing = [4, 7, 8, 10];

interface Sequence {
    trackId: number;
    playing: boolean;
    detune: number;
    repeat: number;
    patternId: number;
    nextSequenceId?: number;
    patchId: number;
    presetId: number;
}

export let sequences: Sequence[] = [];

export async function loadSequences() {
    for (let id = 0; id < 25; id++) {
        const pattern = getPattern(Math.floor(Math.random() * 4));
        sequences[id] = {
            trackId: tracks[Math.floor(Math.random() * 8)].id,
            playing: playing.includes(id),
            detune: 0,
            repeat: 0,
            patternId: pattern.id,
            nextSequenceId: Math.random() > 0.5 ? Math.floor(Math.random() * 16) : undefined,
            patchId: patches[Math.floor(Math.random() * patches.length)].id,
            presetId: presets[Math.floor(Math.random() * presets.length)].id,
        };
    }
}
