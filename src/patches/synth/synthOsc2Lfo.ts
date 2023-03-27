import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { SynthDualOsc } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { drawWavetable } from '../../draw/drawWavetable';
import { drawSubTitle, graphRect, withPage } from '../draw';
import { amplitudeEncoder, wavetableEncoders } from '../encoders';
import { PatchWavetable } from '../PatchWavetable';
import { minmax } from '../../util';
import { shiftPressed } from '../../midi';

const fId = SynthDualOsc.FloatId;
const sId = SynthDualOsc.StringId;

const patchWavetable = new PatchWavetable(sId.osc2Wavetable, fId.Osc2Morph);

// TODO change modulation to be positive or negative

export const isDisabled = () => {
    return getPatch(currentPatchId).floats[fId.osc2Active] === 0;
};

const encoders: Encoders = [
    {
        node: {
            title: 'Active',
            getValue: () => (getPatch(currentPatchId).floats[fId.osc2Active] ? 'On' : 'Off'),
        },
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.osc2Active, minmax(patch.floats[fId.osc2Active] + direction, 0, 1));
            return true;
        },
    },
    ...wavetableEncoders(sId.osc2Wavetable, fId.Osc2Morph, fId.Osc2Frequency, patchWavetable, isDisabled),
    amplitudeEncoder(fId.Osc2Amplitude, isDisabled),
    undefined,
    {
        node: {
            title: 'Freq NoteOn',
            getValue: () => (getPatch(currentPatchId).floats[fId.osc2FreqNoteOn] ? 'On' : 'Off'),
            isDisabled,
        },
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.osc2FreqNoteOn, minmax(patch.floats[fId.osc2FreqNoteOn] + direction, 0, 1));
            return true;
        },
    },
    {
        node: {
            title: 'Mix',
            getSlider: () => getPatch(currentPatchId).floats[fId.Mix],
            info: () => {
                return 'osc1                      osc2';
            },
            isDisabled,
        },
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.Mix, minmax(patch.floats[fId.Mix] + direction * (shiftPressed ? 0.1 : 0.05), 0, 1));
            return true;
        },
    },
];

export const synthOsc2Lfo = {
    header: () => {
        const patch = getPatch(currentPatchId);
        drawWavetable(graphRect, patchWavetable.get(patch).data);
        withPage(drawSubTitle('Oscillator 2 / LFO'), 1, 2);
    },
    encoders,
};
