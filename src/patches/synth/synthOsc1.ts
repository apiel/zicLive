import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { SynthDualOsc } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { drawWavetable } from '../../draw/drawWavetable';
import { graphRect } from '../graphRect';
import { amplitudeEncoder, wavetableEncoders } from '../encoders';
import { PatchWavetable } from '../PatchWavetable';

const fId = SynthDualOsc.FloatId;
const sId = SynthDualOsc.StringId;

const patchWavetable = new PatchWavetable(sId.oscWavetable, fId.OscMorph);

const encoders: Encoders = [
    ...wavetableEncoders(sId.oscWavetable, fId.OscMorph, fId.OscFrequency, patchWavetable),
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
        drawText('Oscillator 1', { x: 300, y: 10 }, { size: 14, color: color.info, font: font.bold });
    },
    encoders,
};
