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
    if (patch.strings[sId.oscWavetable] !== lastWavetable || patch.floats[fId.OscMorph] !== lastMorph) {
        lastWavetable = patch.strings[sId.oscWavetable];
        lastMorph = patch.floats[fId.OscMorph];
        wavetable = getWavetable(lastWavetable, lastMorph);
    }
    return wavetable;
}

const encoders: Encoders = [
    ...wavetableEncoders(sId.oscWavetable, fId.OscMorph, fId.OscFrequency, getPatchWavetable),
    undefined,
    amplitudeEncoder(fId.OscAmplitude),
    undefined,
    undefined,
    undefined,
];

export const synthOsc1 = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawWavetable(graphRect, getPatchWavetable(patch).data);
        drawText('Oscillator 1', { x: 300, y: 10 }, { size: 14, color: color.info, font: font.bold });
    },
    encoders,
};
