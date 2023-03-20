import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { MidiMsg } from '../midi';
import { sequences, getSelectedSequenceId, getSelectedSequence, setSelectedSequenceId } from '../sequence';
import { getTrack, getTrackCount, getTrackStyle } from '../track';
import { minmax } from '../util';
import { forceSelectedItem } from '../selector';
import { View } from '../def';
import { EncoderData, Encoders, encodersHandler, encodersView } from '../layout/encoders.layout';
import { sequenceEditHeader } from '../nodes/sequenceEditHeader.node';
import { sequenceMenuHandler, sequencerMenuNode } from '../nodes/sequenceMenu.node';
import { currentPatchId, getPatch, setCurrentPatchId } from '../patch';
import { Kick23 } from 'zic_node';

const fId = Kick23.FloatId;
const sId = Kick23.StringId;

export const patchEncoder: EncoderData = {
    title: 'Patch',
    getValue: () => `#${`${currentPatchId}`.padStart(3, '0')}`,
    handler: async (direction) => {
        setCurrentPatchId(currentPatchId + direction);
        return true;
    },
    unit: () => getPatch(currentPatchId).name,
};

const encoders: Encoders = [
    patchEncoder,
    {
        title: 'Volume',
        getValue: () => {
            const patch = getPatch(currentPatchId);
            return Math.round(patch.floats[fId.Volume] * 100).toString();
        },
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.Volume, minmax(patch.floats[fId.Volume] + direction * 0.01, 0, 1));
            return true;
        },
        unit: '%',
    },
    {
        title: 'Distortion',
        getValue: () => getPatch(currentPatchId).floats[fId.distortion].toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.distortion, minmax(patch.floats[fId.distortion] + direction, 0, 100));
            return true;
        },
        unit: '%',
    },
    {
        title: 'Distortion range',
        getValue: () => getPatch(currentPatchId).floats[fId.distortionRange].toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.distortionRange, minmax(patch.floats[fId.distortionRange] + direction, 10, 120));
            return true;
        },
    },
    {
        title: 'Filter',
        getValue: () => getPatch(currentPatchId).floats[fId.filterCutoff].toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.filterCutoff, minmax(patch.floats[fId.filterCutoff] + direction * 10, 200, 8000));
            return true;
        },
        unit: 'hz',
    },
    {
        title: 'Resonance',
        getValue: () => `${Math.round(getPatch(currentPatchId).floats[fId.filterResonance] * 100)}`,
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.filterResonance, minmax(patch.floats[fId.filterResonance] + direction * 0.01, 0, 1));
            return true;
        },
        unit: '%',
    },
    {
        title: 'Duration',
        getValue: () => getPatch(currentPatchId).floats[fId.Duration].toString(),
        handler: async (direction) => {
            const patch = getPatch(currentPatchId);
            patch.setNumber(fId.Duration, minmax(patch.floats[fId.Duration] + direction, 10, 5000));
            return true;
        },
        unit: 'ms (t)',
    },
    undefined,
];

export async function kick23View({ controllerRendering }: RenderOptions = {}) {
    if (controllerRendering) {
        // sequencerController();
    }

    encodersView(encoders);

    renderMessage();
}

export async function patchMidiHandler(midiMsg: MidiMsg, viewPadPressed: boolean) {
    return encodersHandler(encoders, midiMsg);
}
