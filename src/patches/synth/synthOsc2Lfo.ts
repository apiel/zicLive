import { Encoders } from '../../layout/encoders.layout';
import { currentPatchId, getPatch } from '../../patch';
import { SynthDualOsc } from 'zic_node';
import { drawText } from 'zic_node_ui';
import { color, font } from '../../style';
import { drawWavetable } from '../../draw/drawWavetable';
import { drawSubTitle, graphRect, withPage } from '../draw';
import { amplitudeEncoder, onOffEncoder, wavetableEncoders } from '../encoders';
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
    onOffEncoder(fId.osc2Active, 'Active'),
    ...wavetableEncoders(sId.osc2Wavetable, fId.Osc2Morph, fId.Osc2Frequency, patchWavetable, isDisabled),
    amplitudeEncoder(fId.Osc2Amplitude, isDisabled),
    undefined,
    onOffEncoder(fId.osc2FreqNoteOn, 'Freq NoteOn', isDisabled),
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
