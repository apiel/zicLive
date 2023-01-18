import { getPatches } from './patch';
import { getPattern } from './pattern';
import { getTrack } from './track';

export const playing = [4, 7, 8, 10];

interface Sequence {
    id: number;
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
    for (let id = 0; id < 10; id++) {
        const track = getTrack(Math.floor(Math.random() * 8));
        const pattern = getPattern(Math.floor(Math.random() * 4));
        const patches = getPatches(track.type);
        const patch = patches[Math.floor(Math.random() * patches.length)];
        sequences[id] = {
            id,
            trackId: track.id,
            playing: playing.includes(id),
            detune: 0,
            repeat: Math.floor(Math.random() * 8),
            patternId: pattern.id,
            nextSequenceId: undefined, //Math.random() > 0.5 ? Math.floor(Math.random() * 16) : undefined,
            patchId: patch.id,
            presetId: patch.presets[Math.floor(Math.random() * patch.presets.length)].id,
        };
    }
}

export function newSequence() {
    sequences.push({
        id: sequences.length,
        trackId: 0,
        playing: false,
        detune: 0,
        repeat: 0,
        patternId: 0,
        nextSequenceId: undefined,
        patchId: 0,
        presetId: 0,
    });
}

let selectedSequenceId = 0;
export function getSelectedSequenceId() {
    return selectedSequenceId;
}
export function setSelectedSequenceId(id: number) {
    selectedSequenceId = id;
}
