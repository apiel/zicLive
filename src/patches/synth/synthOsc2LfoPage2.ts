import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { SynthDualOsc } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { drawWavetable } from '../../draw/drawWavetable';
import { graphRect } from '../draw';
import { PatchWavetable } from '../PatchWavetable';
import { isDisabled } from './synthOsc2Lfo';
import { percentageEncoder } from '../encoders';

const fId = SynthDualOsc.FloatId;
const sId = SynthDualOsc.StringId;

const patchWavetable = new PatchWavetable(sId.osc2Wavetable, fId.Osc2Morph);

const encoders: Encoders = [
    percentageEncoder(fId.osc2ModPitch, 'Osc1 Frequency Mod.', undefined, isDisabled),
    percentageEncoder(fId.osc2ModAmplitude, 'Osc1 Amplitude Mod.', undefined, isDisabled),
    percentageEncoder(fId.osc2ModMorph, 'Osc1 Morph Mod.', undefined, isDisabled),
    undefined,
    percentageEncoder(fId.osc2ModCutOff, 'Filter Cutoff Mod.', undefined, isDisabled),
    percentageEncoder(fId.osc2ModResonance, 'Filter Resonance Mod.', undefined, isDisabled),
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
