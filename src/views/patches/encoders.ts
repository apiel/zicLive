import path from 'path';
import { Color } from 'zic_node_ui';
import { getNextWaveTable } from '../../helpers/getNextWavetable';
import { Tuple } from '../../interface';
import { EncoderData } from '../../layout/encoders.layout';
import { shiftPressed } from '../../midi';
import { currentPatchId, getPatch, setCurrentPatchId } from '../../patch';
import { color } from '../../style';
import { minmax } from '../../util';
import { PatchWavetable } from './PatchWavetable';

export const patchEncoder: EncoderData = {
    node: {
        title: 'Patch',
        getValue: () => `#${`${currentPatchId}`.padStart(3, '0')}`,
        unit: () => getPatch(currentPatchId).name,
    },
    handler: async (direction) => {
        setCurrentPatchId(
            currentPatchId + direction * (shiftPressed ? ([1,-1].includes(direction) ? 10 : 50) : 1),
        );
        return true;
    },
};

interface EncoderOptions {
    valueColor?: Color;
    isDisabled?: IsDisabled;
    bgColor?: Color;
}

export const percentageEncoder = (
    fId: number,
    title: string,
    { valueColor, isDisabled, bgColor }: EncoderOptions = {},
): EncoderData => ({
    node: {
        title,
        getValue: () => ({
            value: Math.round(getPatch(currentPatchId).floats[fId] * 100).toString(),
            valueColor,
        }),
        unit: '%',
        isDisabled,
        bgColor,
    },
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 0.05 : 0.01), 0, 1));
        return true;
    },
});

export const onOffEncoder = (
    fId: number,
    title: string,
    { isDisabled, bgColor }: EncoderOptions = {},
): EncoderData => ({
    node: {
        title,
        getValue: () => (getPatch(currentPatchId).floats[fId] ? 'On' : 'Off'),
        isDisabled,
        bgColor,
    },
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction, 0, 1));
        return true;
    },
});

export const volumeEncoder = (fId: number, isDisabled?: IsDisabled): EncoderData =>
    percentageEncoder(fId, `Volume`, { isDisabled });

export const filterCutoffEncoder = (fId: number, { isDisabled, bgColor }: EncoderOptions = {}): EncoderData => ({
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 100 : 10), 200, 8000));
        return true;
    },
    node: {
        title: 'Filter Cutoff',
        getValue: () => getPatch(currentPatchId).floats[fId].toString(),
        unit: 'hz',
        isDisabled,
        bgColor,
    },
});

export const filterResonanceEncoder = (fId: number, options: EncoderOptions = {}): EncoderData =>
    percentageEncoder(fId, `Filter Resonance`, options);

export const filterEncoders = (
    fIdCutoff: number,
    fIdResonance: number,
    options: EncoderOptions = {},
): Tuple<EncoderData, 2> => [filterCutoffEncoder(fIdCutoff, options), filterResonanceEncoder(fIdResonance, options)];

export const wavetableEncoder = (sId: number, { isDisabled, bgColor }: EncoderOptions = {}): EncoderData => ({
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setString(sId, await getNextWaveTable(direction, patch.strings[sId]));
        return true;
    },
    node: {
        title: 'Wavetable',
        getValue: () => path.parse(getPatch(currentPatchId).strings[sId]).name,
        isDisabled,
        bgColor,
    },
});

export const morphEncoder = (
    fId: number,
    patchWavetable: PatchWavetable,
    { isDisabled, bgColor }: EncoderOptions = {},
): EncoderData => ({
    node: {
        title: 'Morph',
        getValue: () => getPatch(currentPatchId).floats[fId].toFixed(1),
        unit: () => `/${patchWavetable.get(getPatch(currentPatchId)).wavetableCount}`,
        info: () => `${patchWavetable.get(getPatch(currentPatchId)).wavetableSampleCount} samples`,
        isDisabled,
        bgColor,
    },
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 1 : 0.1), 0, 64));
        return true;
    },
});

export const frequencyEncoder = (fId: number, { isDisabled, bgColor }: EncoderOptions = {}): EncoderData => ({
    node: {
        title: 'Frequency',
        getValue: () => getPatch(currentPatchId).floats[fId].toString(),
        unit: 'hz',
        isDisabled,
        bgColor,
    },
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 10 : 1), 10, 2000));
        return true;
    },
});

export const wavetableEncoders = (
    sIdWavteable: number,
    fIdMorph: number,
    fIdFrequency: number,
    patchWavetable: PatchWavetable,
    options: EncoderOptions = {},
): Tuple<EncoderData, 3> => [
    wavetableEncoder(sIdWavteable, options),
    morphEncoder(fIdMorph, patchWavetable, options),
    frequencyEncoder(fIdFrequency, options),
];

type IsDisabled = () => boolean;

export const amplitudeEncoder = (fId: number, isDisabled?: IsDisabled): EncoderData =>
    percentageEncoder(fId, `Amplitude`, { isDisabled });

export const modLevelEncoder = (fId: number, i: number, valueColor?: Color): EncoderData =>
    percentageEncoder(fId, `Mod${i} level`, { valueColor });

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

export const envMsEncoder = (fId: number, title: string, valueColor?: Color): EncoderData => ({
    node: {
        title,
        getValue: () => ({
            value: getPatch(currentPatchId).floats[fId].toString(),
            valueColor,
        }),
        unit: 'ms',
    },
    handler: async (direction) => {
        const patch = getPatch(currentPatchId);
        patch.setNumber(fId, minmax(patch.floats[fId] + direction * (shiftPressed ? 100 : 10), 0, 9900));
        return true;
    },
});

export const adsrEncoders = (
    fIdAttack: number,
    fIdDecay: number,
    fIdSustain: number,
    fIdRelease: number,
): Tuple<EncoderData, 4> => [
    envMsEncoder(fIdAttack, 'Attack', color.graph[0]),
    envMsEncoder(fIdDecay, 'Decay', color.graph[1]),
    percentageEncoder(fIdSustain, 'Sustain', { valueColor: color.graph[2] }),
    envMsEncoder(fIdRelease, 'Release', color.graph[3]),
];
