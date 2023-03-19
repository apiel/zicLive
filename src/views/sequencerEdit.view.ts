import { drawFilledRect, drawRect, drawText, Rect, setColor } from 'zic_node_ui';
import { config } from '../config';
import { color, font, unit } from '../style';
import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { MidiMsg } from '../midi';
import { sequencerController } from './controller/sequencerController';
import { sequences, getSelectedSequenceId, getSelectedSequence, setSelectedSequenceId } from '../sequence';
import { getTrack, getTrackCount, getTrackStyle } from '../track';
import { patternPreviewNode } from '../nodes/patternPreview.node';
import { minmax } from '../util';
import { forceSelectedItem } from '../selector';
import { View } from '../def';
import { Encoders, encodersHandler, encodersView } from './layout/encoders.layout';
import { sequenceMiniGridSelection } from '../nodes/sequenceMiniGridSelection.node';
import { sequenceEditHeader } from '../nodes/sequenceEditHeader.node';

const { margin } = unit;

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
    undefined,
    undefined,
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
    undefined,
    undefined,
    undefined,
];

export async function sequencerEditView({ controllerRendering }: RenderOptions = {}) {
    if (controllerRendering) {
        sequencerController();
    }
    const { id, trackId } = getSelectedSequence();

    const seqColor = trackId !== undefined ? getTrackStyle(trackId).color : undefined;
    const trackName = trackId !== undefined ? getTrack(trackId).name : 'No track';
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
