import { patches, } from './patch';
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
        const patch = patches[Math.floor(Math.random() * patches.length)];
        sequences[id] = {
            trackId: tracks[Math.floor(Math.random() * 8)].id,
            playing: playing.includes(id),
            detune: 0,
            repeat: Math.floor(Math.random() * 8),
            patternId: pattern.id,
            nextSequenceId: Math.random() > 0.5 ? Math.floor(Math.random() * 16) : undefined,
            patchId: patch.id,
            presetId: patch.presets[Math.floor(Math.random() * patch.presets.length)].id,
        };
    }
}

let selectedSequenceId = 0;
export function getSelectedSequenceId() {
    return selectedSequenceId;
}
export function setSelectedSequenceId(id: number) {
    selectedSequenceId = id;
}
