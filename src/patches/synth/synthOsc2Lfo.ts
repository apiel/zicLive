import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { SynthDualOsc } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { drawWavetable } from '../../draw/drawWavetable';
import { graphRect } from '../graphRect';
import { amplitudeEncoder, wavetableEncoders } from '../encoders';
import { PatchWavetable } from '../PatchWavetable';
import { minmax } from '../../util';
import { shiftPressed } from '../../midi';

const fId = SynthDualOsc.FloatId;
const sId = SynthDualOsc.StringId;

const patchWavetable = new PatchWavetable(sId.osc2Wavetable, fId.Osc2Morph);

// drawSliderField(
//     `Mix`,
//     patch.floats[fId.Mix],
//     rowNext(1),
//     {
//         edit: (direction) => {
//             patch.setNumber(fId.Mix, minmax(patch.floats[fId.Mix] + direction, 0, 1));
//         },
//         steps: [0.01, 0.1],
//     },
//     { scrollY, leftLabel: 'osc1', rightLabel: 'osc2' },
// );
// encoderSlider

const encoders: Encoders = [
    ...wavetableEncoders(sId.osc2Wavetable, fId.Osc2Morph, fId.Osc2Frequency, patchWavetable),
    {
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.osc2FreqNoteOn, minmax(patch.floats[fId.osc2FreqNoteOn] + direction, 0, 1));
            return true;
        },
        node: {
            title: 'Freq NoteOn',
            getValue: () => (getPatch(currentPatchId).floats[fId.osc2FreqNoteOn] ? 'On' : 'Off'),
        },
    },
    amplitudeEncoder(fId.Osc2Amplitude),
    undefined,
    undefined,
    {
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.Mix, minmax(patch.floats[fId.Mix] + direction * (shiftPressed ? 0.1 : 0.05), 0, 1));
            return true;
        },
        node: {
            title: 'Mix',
            getSlider: () => getPatch(currentPatchId).floats[fId.Mix],
            info: () => {
                return 'osc1                      osc2'
            }
        },
    },
];

export const synthOsc2Lfo = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawWavetable(graphRect, patchWavetable.get(patch).data);
        drawText('Oscillator 2 / LFO', { x: 300, y: 10 }, { size: 14, color: color.info, font: font.bold });
    },
    encoders,
};
