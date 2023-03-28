import { Encoders } from '../../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../../patch';
import { SynthDualOsc } from 'zic_node';
import { drawWavetable } from '../../../draw/drawWavetable';
import { drawSubTitle, graphRect } from '../draw';
import { amplitudeEncoder, wavetableEncoders } from '../encoders';
import { PatchWavetable } from '../PatchWavetable';
import { color } from '../../../style';

const fId = SynthDualOsc.FloatId;
const sId = SynthDualOsc.StringId;

const patchWavetable = new PatchWavetable(sId.oscWavetable, fId.OscMorph);

const encoders: Encoders = [
    ...wavetableEncoders(sId.oscWavetable, fId.OscMorph, fId.OscFrequency, patchWavetable, {
        bgColor: color.encoder[2],
    }),
    undefined,
    amplitudeEncoder(fId.OscAmplitude),
    undefined,
    undefined,
    undefined,
];

export const synthOsc1 = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawWavetable(graphRect, patchWavetable.get(patch).data);
        drawSubTitle('Oscillator 1');
    },
    encoders,
};
