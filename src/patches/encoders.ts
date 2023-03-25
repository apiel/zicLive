import path from 'path';
import { Color } from 'zic_node_ui';
import { getNextWaveTable } from '../helpers/getNextWavetable';
import { Tuple } from '../interface';
import { EncoderData } from '../layout/encoders.layout';
import { shiftPressed } from '../midi';
import { currentPatchId, getPatch, setCurrentPatchId } from '../patch';
import { minmax } from '../util';
import { PatchWavetable } from './PatchWavetable';

export const patchEncoder: EncoderData = {
    handler: async (direction) => {
        setCurrentPatchId(currentPatchId + direction);
        return true;
    },
    node: {
        title: 'Patch',
        getValue: () => `#${`${currentPatchId}`.padStart(3, '0')}`,
        unit: () => getPatch(currentPatchId).name,
    },
};

export const volumeEncoder = (fId: number): EncoderData => ({
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 0.1 : 0.01), 0, 1));
        return true;
    },
    node: {
        title: 'Volume',
        getValue: () => {
            const patch = getPatch(currentPatchId);
            return Math.round(patch.floats[fId] * 100).toString();
        },
        unit: '%',
    },
});

export const filterCutoffEncoder = (fId: number): EncoderData => ({
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 100 : 10), 200, 8000));
        return true;
    },
    node: {
        title: 'Filter Cutoff',
        getValue: () => getPatch(currentPatchId).floats[fId].toString(),
        unit: 'hz',
    },
});

export const filterResonanceEncoder = (fId: number): EncoderData => ({
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * 0.01, 0, 1));
        return true;
    },
    node: {
        title: 'Filter Resonance',
        getValue: () => `${Math.round(getPatch(currentPatchId).floats[fId] * 100)}`,
        unit: '%',
    },
});

export const filterEncoders = (fIdCutoff: number, fIdResonance: number): Tuple<EncoderData, 2> => [
    filterCutoffEncoder(fIdCutoff),
    filterResonanceEncoder(fIdResonance),
];

export const wavetableEncoder = (sId: number): EncoderData => ({
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setString(sId, await getNextWaveTable(direction, patch.strings[sId]));
        return true;
    },
    node: {
        title: 'Wavetable',
        getValue: () => path.parse(getPatch(currentPatchId).strings[sId]).name,
    },
});

export const morphEncoder = (fId: number, patchWavetable: PatchWavetable): EncoderData => ({
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 1 : 0.1), 0, 64));
        return true;
    },
    node: {
        title: 'Morph',
        getValue() {
            const patch = getPatch(currentPatchId);
            return patch.floats[fId].toFixed(1);
        },
        unit() {
            const patch = getPatch(currentPatchId);
            return `/${patchWavetable.get(patch).wavetableCount}`;
        },
        info() {
            const patch = getPatch(currentPatchId);
            return `${patchWavetable.get(patch).wavetableSampleCount} samples`;
        },
    },
});

export const frequencyEncoder = (fId: number): EncoderData => ({
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 10 : 1), 10, 2000));
        return true;
    },
    node: {
        title: 'Frequency',
        getValue: () => getPatch(currentPatchId).floats[fId].toString(),
        unit: 'hz',
    },
});

export const wavetableEncoders = (
    sIdWavteable: number,
    fIdMorph: number,
    fIdFrequency: number,
    patchWavetable: PatchWavetable,
): Tuple<EncoderData, 3> => [
    wavetableEncoder(sIdWavteable),
    morphEncoder(fIdMorph, patchWavetable),
    frequencyEncoder(fIdFrequency),
];

export const amplitudeEncoder = (fId: number): EncoderData => ({
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 0.05 : 0.01), 0, 1));
        return true;
    },
    node: {
        title: 'Amplitude',
        getValue: () => `${Math.round(getPatch(currentPatchId).floats[fId] * 100)}`,
        unit: '%',
    },
});

export const modLevelEncoder = (fId: number, i: number, valueColor?: Color): EncoderData => ({
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 0.1 : 0.01), 0, 1));
        return true;
    },
    node: {
        title: `Mod${i} level`,
        getValue: () => ({ value: Math.round(getPatch(currentPatchId).floats[fId] * 100).toString(), valueColor }),
        unit: '%',
    },
});

export const modTimeEncoder = (fId: number, i: number, fIdDuration: number, valueColor?: Color): EncoderData => ({
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 0.1 : 0.01), 0, 1));
        return true;
    },
    node: {
        title: `Mod ${i} time`,
        getValue: () => ({ value: Math.round(getPatch(currentPatchId).floats[fId] * 100).toString(), valueColor }),
        unit: '%',
        info: () => {
            if (fIdDuration !== undefined) {
                const patch = getPatch(currentPatchId);
                return `at ${Math.round(patch.floats[fId] * patch.floats[fIdDuration])} ms`;
            }
            return '';
        },
    },
});
