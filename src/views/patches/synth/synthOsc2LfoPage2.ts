import { Encoders } from '../../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../../patch';
import { SynthDualOsc } from 'zic_node';
import { drawWavetable } from '../../../draw/drawWavetable';
import { drawSubTitle, graphRect, withPage } from '../draw';
import { PatchWavetable } from '../PatchWavetable';
import { isDisabled } from './synthOsc2Lfo';
import { percentageEncoder } from '../encoders';
import { color } from '../../../style';

const fId = SynthDualOsc.FloatId;
const sId = SynthDualOsc.StringId;

const patchWavetable = new PatchWavetable(sId.osc2Wavetable, fId.Osc2Morph);

const encoders: Encoders = [
    percentageEncoder(fId.osc2ModPitch, 'Osc1 Frequency Mod.', { isDisabled }),
    percentageEncoder(fId.osc2ModAmplitude, 'Osc1 Amplitude Mod.', { isDisabled }),
    percentageEncoder(fId.osc2ModMorph, 'Osc1 Morph Mod.', { isDisabled }),
    undefined,
    percentageEncoder(fId.osc2ModCutOff, 'Filter Cutoff Mod.', { isDisabled, bgColor: color.encoder[1] }),
    percentageEncoder(fId.osc2ModResonance, 'Filter Resonance Mod.', { isDisabled, bgColor: color.encoder[1] }),
    undefined,
    undefined,
];

export const synthOsc2LfoPage2 = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawWavetable(graphRect, patchWavetable.get(patch).data);
        withPage(drawSubTitle('Oscillator 2 / LFO'), 2, 2);
    },
    encoders,
};
