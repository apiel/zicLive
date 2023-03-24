import { minmax } from '../../util';
import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch, Patch } from '../../patch';
import { getWavetable, SynthDualOsc, Wavetable } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { drawWavetable } from '../../draw/drawWavetable';
import { graphRect } from '../graphRect';
import { shiftPressed } from '../../midi';
import { amplitudeEncoder, wavetableEncoders } from '../encoders';

const fId = SynthDualOsc.FloatId;
const sId = SynthDualOsc.StringId;

let wavetable: Wavetable;
let lastWavetable = '';
let lastMorph = 0;
function getPatchWavetable(patch: Patch) {
    if (patch.strings[sId.osc2Wavetable] !== lastWavetable || patch.floats[fId.Osc2Morph] !== lastMorph) {
        lastWavetable = patch.strings[sId.osc2Wavetable];
        lastMorph = patch.floats[fId.Osc2Morph];
        wavetable = getWavetable(lastWavetable, lastMorph);
    }
    return wavetable;
}

const encoders: Encoders = [
    ...wavetableEncoders(sId.osc2Wavetable, fId.Osc2Morph, fId.Osc2Frequency, getPatchWavetable),
    undefined,
    amplitudeEncoder(fId.Osc2Amplitude),
    undefined,
    undefined,
    undefined,
];

export const synthOsc2Lfo = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawWavetable(graphRect, getPatchWavetable(patch).data);
        drawText('Oscillator 2 / LFO', { x: 300, y: 10 }, { size: 14, color: color.info, font: font.bold });
    },
    encoders,
};
