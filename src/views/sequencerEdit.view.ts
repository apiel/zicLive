import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { MidiMsg } from '../midi';
import {
    sequencerController,
    sequenceSelectMidiHandler,
    sequenceToggleMidiHandler,
} from './controller/sequencerController';
import { sequences, getSelectedSequenceId, getSelectedSequence, setSelectedSequenceId } from '../sequence';
import { getTrack, getTrackCount, getTrackStyle } from '../track';
import { minmax } from '../util';
import { forceSelectedItem } from '../selector';
import { View } from '../def';
import { EncoderData, Encoders, encodersHandler, encodersView } from './layout/encoders.layout';
import { sequenceEditHeader } from '../nodes/sequenceEditHeader.node';

export const sequenceEncoder: EncoderData = {
    title: 'Sequence',
    getValue: () => {
        const { id, trackId } = getSelectedSequence();
        return {
            value: `#${`${id + 1}`.padStart(3, '0')}`,
            valueColor: trackId === undefined ? undefined : getTrackStyle(trackId).color,
        };
    },
    handler: async (direction) => {
        const id = minmax(getSelectedSequenceId() + direction, 0, sequences.length - 1);
        setSelectedSequenceId(id);
        forceSelectedItem(View.Sequencer, id);
        return true;
    },
};

const encoders: Encoders = [
    sequenceEncoder,
    {
        title: 'Repeat',
        getValue: () => {
            const { trackId, repeat } = getSelectedSequence();
            return trackId === undefined ? '' : `x${repeat}${repeat === 0 ? ' infinite' : ' times'}`;
        },
        handler: async (direction) => {
            const sequence = getSelectedSequence();
            if (sequence.trackId === undefined) {
                return false;
            }
            sequence.repeat = minmax(sequence.repeat + direction, 0, 16);
            return true;
        },
    },
    {
        title: 'Next sequence',
        getValue: () => {
            const { trackId, nextSequenceId } = getSelectedSequence();
            return trackId === undefined ? '' : nextSequenceId ? `#${`${nextSequenceId + 1}`.padStart(3, '0')}` : `---`;
        },
        handler: async (direction) => {
            const sequence = getSelectedSequence();
            if (sequence.trackId === undefined) {
                return false;
            }
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
        title: 'Track',
        getValue: () => {
            const { trackId } = getSelectedSequence();
            return trackId === undefined ? 'No track' : getTrack(trackId).name;
        },
        handler: async (direction) => {
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
        title: 'Detune',
        getValue: () => {
            const { trackId, detune } = getSelectedSequence();
            return trackId === undefined ? '' : detune < 0 ? detune.toString() : `+${detune}`;
        },
        unit: 'semitones',
        handler: async (direction) => {
            const sequence = getSelectedSequence();
            if (sequence.trackId === undefined) {
                return false;
            }
            sequence.detune = minmax(sequence.detune + direction, -12, 12);
            return true;
        },
    },
    {
        title: 'Pattern length',
        getValue: () => {
            const { trackId, stepCount } = getSelectedSequence();
            return trackId === undefined ? '' : `${stepCount}`;
        },
        unit: 'steps',
        handler: async (direction) => {
            const sequence = getSelectedSequence();
            if (sequence.trackId === undefined) {
                return false;
            }
            sequence.stepCount = minmax(sequence.stepCount + direction, 1, 64);
            return true;
        },
    },
    undefined,
];

export async function sequencerEditView({ controllerRendering }: RenderOptions = {}) {
    if (controllerRendering) {
        sequencerController();
    }

    encodersView(encoders);
    sequenceEditHeader();

    renderMessage();
}

export async function sequencerEditMidiHandler(midiMsg: MidiMsg, viewPadPressed: boolean) {
    if (sequenceSelectMidiHandler(midiMsg, viewPadPressed)) {
        return true;
    }
    if (await sequenceToggleMidiHandler(midiMsg)) {
        return true;
    }
    return encodersHandler(encoders, midiMsg);
}
