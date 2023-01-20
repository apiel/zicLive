import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
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

export function initSequence(sequence: Sequence) {
    if (sequence.playing) {
        playSequence(sequence);
    }
}

export async function loadSequence(id: number) {
    try {
        const sequence = JSON.parse(
            (
                await readFile(`${config.path.sequences}/${id.toString().padStart(3, '0')}.json`)
            ).toString(),
        );
        sequence.id = id;
        sequences.push(sequence);
        initSequence(sequence);
    } catch (error) {
        console.error(`Error while loading sequence ${id}`, error);
    }
}

export async function loadSequences() {
    sequences = [];
    try {
        const names = await readdir(config.path.sequences);
        for (const name of names) {
            // const sequence = JSON.parse(
            //     (await readFile(`${config.path.sequences}/${name}`)).toString(),
            // );
            // sequences.push(sequence);
            await loadSequence(parseInt(path.parse(name).name));
        }
    } catch (error) {
        console.error(`Error while loading sequences`, error);
    }
}

export async function saveSequence(sequence: Sequence) {
    try {
        await writeFile(
            `${config.path.sequences}/${sequence.id.toString().padStart(3, '0')}.json`,
            JSON.stringify(sequence),
        );
    } catch (error) {
        console.error(`Error while saving sequence ${sequence.id}`, error);
    }
}

export async function saveSequences() {
    for (const sequence of sequences) {
        await saveSequence(sequence);
    }
}

export function newSequence() {
    sequences.push({
        id: sequences.length,
        trackId: 0,
        playing: false,
        // playingNext: false,
        // stoppingNext: false,
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
    const sequence = sequences[id];
    setPatternId(sequence.patternId);
}
