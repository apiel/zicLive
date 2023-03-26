import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { SynthDualOsc } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { drawWavetable } from '../../draw/drawWavetable';
import { graphRect } from '../graphRect';
import { PatchWavetable } from '../PatchWavetable';
import { minmax } from '../../util';
import { shiftPressed } from '../../midi';
import { isDisabled } from './synthOsc2Lfo';

const fId = SynthDualOsc.FloatId;
const sId = SynthDualOsc.StringId;

const patchWavetable = new PatchWavetable(sId.osc2Wavetable, fId.Osc2Morph);

const encoders: Encoders = [
    {
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.osc2ModPitch,
                minmax(patch.floats[fId.osc2ModPitch] + direction * (shiftPressed ? 0.05 : 0.01), -1, 1),
            );
            return true;
        },
        node: {
            title: 'Osc1 Frequency Mod.',
            getValue: () => `${Math.round(getPatch(currentPatchId).floats[fId.osc2ModPitch] * 100)}`,
            unit: '%',
            isDisabled,
        },
    },
    {
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.osc2ModAmplitude,
                minmax(patch.floats[fId.osc2ModAmplitude] + direction * (shiftPressed ? 0.05 : 0.01), -1, 1),
            );
            return true;
        },
        node: {
            title: 'Osc1 Amplitude Mod.',
            getValue: () => `${Math.round(getPatch(currentPatchId).floats[fId.osc2ModAmplitude] * 100)}`,
            unit: '%',
            isDisabled,
        },
    },
    {
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.osc2ModMorph,
                minmax(patch.floats[fId.osc2ModMorph] + direction * (shiftPressed ? 0.05 : 0.01), -1, 1),
            );
            return true;
        },
        node: {
            title: 'Osc1 Morph Mod.',
            getValue: () => `${Math.round(getPatch(currentPatchId).floats[fId.osc2ModMorph] * 100)}`,
            unit: '%',
            isDisabled,
        },
    },
    undefined,
    {
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.osc2ModCutOff,
                minmax(patch.floats[fId.osc2ModCutOff] + direction * (shiftPressed ? 0.05 : 0.01), -1, 1),
            );
            return true;
        },
        node: {
            title: 'Filter Cutoff Mod.',
            getValue: () => `${Math.round(getPatch(currentPatchId).floats[fId.osc2ModCutOff] * 100)}`,
            unit: '%',
            isDisabled,
        },
    },
    {
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(
                fId.osc2ModResonance,
                minmax(patch.floats[fId.osc2ModResonance] + direction * (shiftPressed ? 0.05 : 0.01), -1, 1),
            );
            return true;
        },
        node: {
            title: 'Filter Resonance Mod.',
            getValue: () => `${Math.round(getPatch(currentPatchId).floats[fId.osc2ModResonance] * 100)}`,
            unit: '%',
            isDisabled,
        },
    },
    undefined,
    undefined,
];

export const synthOsc2LfoPage2 = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawWavetable(graphRect, patchWavetable.get(patch).data);
        const rect = drawText(
            'Oscillator 2 / LFO',
            { x: 300, y: 10 },
            { size: 14, color: color.info, font: font.bold },
        );
        drawText(
            '2 / 2',
            { x: rect.position.x + rect.size.w + 5, y: 12 },
            { size: 11, color: color.white, font: font.regular },
        );
    },
    encoders,
};
