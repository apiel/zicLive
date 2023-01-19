import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { setSequencerState } from 'zic_node';
import { config } from './config';
import { getPattern, setPatternId } from './pattern';

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

export function getSequence(id: number) {
    return sequences[id];
}

export function playSequence(sequence: Sequence) {
    sequence.playing = true;
    setSequencerState(sequence.trackId, sequence.patternId, sequence.detune, true);
}

export function toggleSequence(sequence: Sequence) {
    sequence.playing = !sequence.playing;
    setSequencerState(sequence.trackId, sequence.patternId, sequence.detune, sequence.playing, true);
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
