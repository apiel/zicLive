import { RenderOptions, viewPadPressed } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { MidiMsg } from '../midi';
import {
    sequencerController,
    sequenceSelectMidiHandler,
    sequencePlayStopMidiHandler,
    bankController,
} from './controller/sequencerController';
import { sequences, getSelectedSequenceId, getSelectedSequence, setSelectedSequenceId } from '../sequence';
import { getTrack, getTrackCount, getTrackStyle } from '../track';
import { minmax } from '../util';
import { forceSelectedItem } from '../selector';
import { View } from '../def';
import { EncoderData, Encoders, encodersHandler, encodersView } from '../layout/encoders.layout';
import { sequenceEditHeader } from '../nodes/sequenceEditHeader.node';
import { sequenceMenuHandler, sequencerMenuNode } from '../nodes/sequenceMenu.node';

export const sequenceEncoder: EncoderData = {
    node: {
        title: 'Sequence',
        getValue: () => {
            const { id, trackId } = getSelectedSequence();
            return {
                value: `#${`${id + 1}`.padStart(3, '0')}`,
                valueColor: trackId === undefined ? undefined : getTrackStyle(trackId).color,
            };
        },
    },
    handler: async (direction) => {
        const id = minmax(getSelectedSequenceId() + direction, 0, sequences.length - 1);
        setSelectedSequenceId(id);
        forceSelectedItem(View.Sequencer, id);
        return true;
    },
};

export const isDisabled = () => {
    const sequence = getSelectedSequence();
    return sequence.trackId === undefined;
};

const encoders: Encoders = [
    sequenceEncoder,
    {
        node: {
            title: 'Repeat',
            getValue: () => {
                const { repeat } = getSelectedSequence();
                return `x${repeat}${repeat === 0 ? ' infinite' : ' times'}`;
            },
            isDisabled,
        },
        handler: async (direction) => {
            const sequence = getSelectedSequence();
            sequence.repeat = minmax(sequence.repeat + direction, 0, 16);
            return true;
        },
    },
    {
        node: {
            title: 'Next sequence',
            getValue: () => {
                const { nextSequenceId } = getSelectedSequence();
                return nextSequenceId ? `#${`${nextSequenceId + 1}`.padStart(3, '0')}` : `---`;
            },
            isDisabled,
        },
        handler: async (direction) => {
            const sequence = getSelectedSequence();
            const selectedId = getSelectedSequenceId();
            const ids = sequences.filter((s) => s.trackId === sequence.trackId && s.id !== selectedId).map((s) => s.id);
            let idx = sequence.nextSequenceId !== undefined ? ids.indexOf(sequence.nextSequenceId) : -1;
            idx = minmax(idx + direction, -1, ids.length - 1);
            sequence.nextSequenceId = idx === -1 ? undefined : ids[idx];
            return true;
        },
    },
    undefined,
    {
        node: {
            title: 'Track',
            getValue: () => {
                const { trackId } = getSelectedSequence();
                return trackId === undefined ? 'No track' : getTrack(trackId).name;
            },
        },
        handler: async (direction) => {
            // TODO when changing track for a sequence, patch are not valid anymore
            const { trackId } = getSelectedSequence();
            if (trackId !== undefined) {
                const id =
                    direction === -1 && trackId === 0 ? undefined : minmax(trackId + direction, 0, getTrackCount() - 1);
                sequences[getSelectedSequenceId()].trackId = id;
            } else if (direction === 1) {
                sequences[getSelectedSequenceId()].trackId = 0;
            }
            return true;
        },
    },
    {
        node: {
            title: 'Detune',
            getValue: () => {
                const { detune } = getSelectedSequence();
                return detune < 0 ? detune.toString() : `+${detune}`;
            },
            unit: 'semitones',
            isDisabled,
        },
        handler: async (direction) => {
            const sequence = getSelectedSequence();
            sequence.detune = minmax(sequence.detune + direction, -12, 12);
            return true;
        },
    },
    {
        node: {
            title: 'Pattern length',
            getValue: () => `${getSelectedSequence().stepCount}`,
            unit: 'steps',
            isDisabled,
        },
        handler: async (direction) => {
            const sequence = getSelectedSequence();
            sequence.stepCount = minmax(sequence.stepCount + direction, 1, 64);
            return true;
        },
    },
    undefined,
];

export async function sequencerEditView({ controllerRendering }: RenderOptions = {}) {
    if (controllerRendering) {
        sequencerController();
        bankController();
    }

    encodersView(encoders);
    sequenceEditHeader();
    sequencerMenuNode();

    renderMessage();
}

export async function sequencerEditMidiHandler(midiMsg: MidiMsg) {
    const menuStatus = await sequenceMenuHandler(midiMsg);
    if (menuStatus !== false) {
        return menuStatus !== undefined;
    }

    if (viewPadPressed && (await sequencePlayStopMidiHandler(midiMsg))) {
        return true;
    }

    if (sequenceSelectMidiHandler(midiMsg)) {
        return true;
    }

    return encodersHandler(encoders, midiMsg);
}
