import path from 'path';
import { Wavetable } from 'zic_node';
import { getNextWaveTable } from '../helpers/getNextWavetable';
import { Tuple } from '../interface';
import { EncoderData } from '../layout/encoders.layout';
import { shiftPressed } from '../midi';
import { currentPatchId, getPatch, Patch, setCurrentPatchId } from '../patch';
import { minmax } from '../util';

export const patchEncoder: EncoderData = {
    title: 'Patch',
    getValue: () => `#${`${currentPatchId}`.padStart(3, '0')}`,
    handler: async (direction) => {
        setCurrentPatchId(currentPatchId + direction);
        return true;
    },
    unit: () => getPatch(currentPatchId).name,
};

export const volumeEncoder = (fId: number): EncoderData => ({
    title: 'Volume',
    getValue: () => {
        const patch = getPatch(currentPatchId);
        return Math.round(patch.floats[fId] * 100).toString();
    },
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 0.1 : 0.01), 0, 1));
        return true;
    },
    unit: '%',
});

export const filterCutoffEncoder = (fId: number): EncoderData => ({
    title: 'Filter Cutoff',
    getValue: () => getPatch(currentPatchId).floats[fId].toString(),
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 100 : 10), 200, 8000));
        return true;
    },
    unit: 'hz',
});

export const filterResonanceEncoder = (fId: number): EncoderData => ({
    title: 'Filter Resonance',
    getValue: () => `${Math.round(getPatch(currentPatchId).floats[fId] * 100)}`,
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * 0.01, 0, 1));
        return true;
    },
    unit: '%',
});

export const filterEncoders = (fIdCutoff: number, fIdResonance: number): Tuple<EncoderData, 2> => [
    filterCutoffEncoder(fIdCutoff),
    filterResonanceEncoder(fIdResonance),
];

export const wavetableEncoder = (sId: number): EncoderData => ({
    title: 'Wavetable',
    getValue: () => path.parse(getPatch(currentPatchId).strings[sId]).name,
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setString(sId, await getNextWaveTable(direction, patch.strings[sId]));
        return true;
    },
});

export const morphEncoder = (fId: number, getPatchWavetable: (patch: Patch) => Wavetable): EncoderData => ({
    title: 'Morph',
    getValue() {
        const patch = getPatch(currentPatchId);
        return patch.floats[fId].toFixed(1);
    },
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 1 : 0.1), 0, 64));
        return true;
    },
    unit() {
        const patch = getPatch(currentPatchId);
        return `/${getPatchWavetable(patch).wavetableCount}`;
    },
    info() {
        const patch = getPatch(currentPatchId);
        return `${getPatchWavetable(patch).wavetableSampleCount} samples`;
    },
});

export const frequencyEncoder = (fId: number): EncoderData => ({
    title: 'Frequency',
    getValue: () => getPatch(currentPatchId).floats[fId].toString(),
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 10 : 1), 10, 2000));
        return true;
    },
    unit: 'hz',
});

export const wavetableEncoders = (
    sIdWavteable: number,
    fIdMorph: number,
    fIdFrequency: number,
    getPatchWavetable: (patch: Patch) => Wavetable,
): Tuple<EncoderData, 3> => [
    wavetableEncoder(sIdWavteable),
    morphEncoder(fIdMorph, getPatchWavetable),
    frequencyEncoder(fIdFrequency),
];

export const amplitudeEncoder = (fId: number): EncoderData => ({
    title: 'Amplitude',
    getValue: () => `${Math.round(getPatch(currentPatchId).floats[fId] * 100)}`,
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(
            fId,
            minmax(patch.floats[fId] + direction * (shiftPressed ? 0.05 : 0.01), 0, 1),
        );
        return true;
    },
    unit: '%',
});
