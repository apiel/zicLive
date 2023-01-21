import { readFile, writeFile } from 'fs/promises';
import { setSequencerState } from 'zic_node';
import { config } from './config';
import { setPatternId } from './pattern';

export const playing = [4, 7, 8, 10];

interface Sequence {
    id: number;
    trackId: number;
    playing: boolean;
    // playingNext: boolean;
    // stoppingNext: boolean;
    detune: number;
    repeat: number;
    patternId: number;
    nextSequenceId?: number;
    patchId: number;
    presetId: number;
    activeStep?: number;
}

export let sequences: Sequence[] = [];

export function getSequence(id: number) {
    return sequences[id];
}

export function getPlayingSequence(trackId: number) {
    return sequences.find((s) => s.playing && s.trackId === trackId);
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
    setSequencerState(sequence.trackId, sequence.patternId, playing, {
        next,
        detune: sequence.detune,
        dataId: sequence.id,
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

export function getSelectedSequence() {
    return sequences[selectedSequenceId];
}

export function setSelectedSequenceId(id: number) {
    selectedSequenceId = id;
    const sequence = sequences[id];
    setPatternId(sequence.patternId);
}
