import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { MidiMsg } from '../midi';
import { sequencerController } from './controller/sequencerController';
import { sequences, getSelectedSequenceId, getSelectedSequence, setSelectedSequenceId } from '../sequence';
import { getTrack, getTrackCount, getTrackStyle } from '../track';
import { minmax } from '../util';
import { forceSelectedItem } from '../selector';
import { View } from '../def';
import { Encoders, encodersHandler, encodersView } from './layout/encoders.layout';
import { sequenceEditHeader } from '../nodes/sequenceEditHeader.node';

const encoders: Encoders = [
    {
        title: 'Sequence',
        value: '',
        handler: async (direction) => {
            const id = minmax(getSelectedSequenceId() + direction, 0, sequences.length - 1);
            setSelectedSequenceId(id);
            forceSelectedItem(View.Sequencer, id);
            return true;
        },
    },
    {
        title: 'Repeat',
        value: '',
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
        value: '',
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
        value: '',
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
        value: '',
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
        value: '',
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
    const { id, trackId, repeat, nextSequenceId, detune, stepCount } = getSelectedSequence();

    let seqColor;
    let trackName = 'No track';

    if (trackId !== undefined) {
        seqColor = getTrackStyle(trackId).color;
        trackName = getTrack(trackId).name;
        encoders[1]!.value = `x${repeat}${repeat === 0 ? ' infinite' : ' times'}`;
        encoders[2]!.value = nextSequenceId ? `#${`${nextSequenceId + 1}`.padStart(3, '0')}` : `---`;
        encoders[5]!.value = (detune < 0 ? detune.toString() : `+${detune}`);
        encoders[6]!.value = `${stepCount}`;
    } else {
        encoders[1]!.value = '';
        encoders[2]!.value = '';
        encoders[5]!.value = '';
        encoders[6]!.value = '';
    }

    encoders[0]!.value = `#${`${id + 1}`.padStart(3, '0')}`;
    encoders[0]!.valueColor = seqColor;
    encoders[4]!.value = trackName;

    encodersView(encoders);
    sequenceEditHeader();

    renderMessage();
}

export function sequencerEditMidiHandler(midiMsg: MidiMsg) {
    return encodersHandler(encoders, midiMsg);
}
