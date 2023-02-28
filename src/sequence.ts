import { readFile, writeFile } from 'fs/promises';
import { setSequencerState } from 'zic_node';
import { config } from './config';
import { getPatch } from './patch';
import { setPatternId } from './pattern';
import { getTrack } from './track';

export const playing = [4, 7, 8, 10];

export interface Sequence {
    id: number;
    trackId: number;
    playing: boolean;
    detune: number;
    repeat: number;
    patternId: number;
    nextSequenceId?: number;
    patchId: number;
    activeStep?: number;
}

export let sequences: Sequence[] = [];

export function getSequence(id: number) {
    return sequences[id];
}

export function getPlayingSequence(trackId: number) {
    return sequences.find((s) => s.playing && s.trackId === trackId);
}

export function getPlayingSequencesForPatch(patchId: number) {
    return sequences.filter((s) => s.playing && s.patchId === patchId);
}

export function getSequencesForPatchId(patchId: number) {
    return sequences.filter((s) => s.patchId === patchId);
}

export function cleanActiveStep(trackId: number) {
    const seqs = sequences.filter((s) => s.trackId === trackId && s.activeStep !== undefined);
    for (const seq of seqs) {
        seq.activeStep = undefined;
    }
}

export function playSequence(sequence: Sequence, playing = true, next?: boolean) {
    if (playing) {
        const playingSeq = getPlayingSequence(sequence.trackId);
        if (playingSeq) {
            playingSeq.playing = false;
        }
    }
    sequence.playing = playing;
    const { engine } = getTrack(sequence.trackId);
    const { floats, strings, cc } = getPatch(engine, sequence.patchId);
    const patch = { floats, strings, cc, id: sequence.patchId };
    setSequencerState(sequence.trackId, sequence.patternId, playing, {
        next,
        detune: sequence.detune,
        dataId: sequence.id,
        patch,
    });
}

export function toggleSequence(sequence: Sequence) {
    playSequence(sequence, !sequence.playing, true);
}

export async function loadSequences() {
    try {
        sequences = JSON.parse((await readFile(config.path.sequences)).toString());
        for (const sequence of sequences) {
            if (sequence.playing) {
                playSequence(sequence);
            }
        }
    } catch (error) {
        console.error(`Error while loading sequences`, error);
    }
}

export async function saveSequences() {
    try {
        await writeFile(config.path.sequences, JSON.stringify(sequences));
    } catch (error) {
        console.error(`Error while saving sequences`, error);
    }
}

export function newSequence() {
    const sequence = {
        id: sequences.length,
        trackId: 0,
        playing: false,
        detune: 0,
        repeat: 0,
        patternId: sequences.length,
        nextSequenceId: undefined,
        patchId: 0,
    };
    sequences.push(sequence);
    setSelectedSequenceId(sequence.id);
}

let selectedSequenceId = 0;
export function getSelectedSequenceId() {
    return selectedSequenceId;
}

export function getSelectedSequence() {
    return sequences[selectedSequenceId];
}

export function setSelectedSequenceId(id: number) {
    selectedSequenceId = id;
    const sequence = sequences[id];
    if (sequence) {
        setPatternId(sequence.patternId);
    }
}
