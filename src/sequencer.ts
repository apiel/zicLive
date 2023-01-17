import { patches, presets } from './patch';
import { getPattern } from './pattern';
import { tracks } from './track';

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
