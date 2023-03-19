import { clear, drawFilledRect, drawRect, drawText, Rect, setColor } from 'zic_node_ui';
import { config } from '../config';
import { color, font, unit } from '../style';
import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { MidiMsg, MIDI_TYPE } from '../midi';
import { sequencerController } from './controller/sequencerController';
import { sequences, getSelectedSequenceId, getSelectedSequence, setSelectedSequenceId } from '../sequence';
import { getTrack, getTrackCount, getTrackStyle } from '../track';
import { patternPreviewNode } from '../nodes/patternPreview.node';
import { encoderNode } from '../nodes/encoder.node';
import { akaiApcKey25 } from '../midi/akaiApcKey25';
import { minmax } from '../util';
import { forceSelectedItem } from '../selector';
import { View } from '../def';
import { Encoders, encodersHandler, encodersView } from './layout/encoders.layout';

const { margin } = unit;

const sequenceRect = (id: number): Rect => {
    const size = { w: 25, h: 15 };
    return {
        position: {
            x: margin + (margin + size.w) * (id % config.sequence.col),
            y: margin + (margin + size.h) * Math.floor(id / config.sequence.col),
        },
        size,
    };
};

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
    const { id, trackId, stepCount, steps, playing } = getSelectedSequence();

    const seqColor = trackId !== undefined ? getTrackStyle(trackId).color : undefined;
    const trackName = trackId !== undefined ? getTrack(trackId).name : 'No track';
    encoders[0]!.value = `#${`${id + 1}`.padStart(3, '0')}`;
    encoders[0]!.valueColor = seqColor;
    encoders[4]!.value = trackName;
    encodersView(encoders);

    for (let i = 0; i < 30; i++) {
        const rect = sequenceRect(i);
        const { trackId } = sequences[i];
        setColor(trackId !== undefined ? getTrackStyle(trackId).color : color.foreground);
        drawFilledRect(rect);
        const isSelected = getSelectedSequenceId() === i;
        drawText(
            `${i + 1}`.padStart(3, '0'),
            { x: rect.position.x + 4, y: rect.position.y + 1 },
            { color: color.foreground3, size: 10, font: font.regular },
        );
        if (isSelected) {
            // TODO find better selection color
            setColor(color.white);
            drawRect(rect);
        }
    }

    if (trackId !== undefined) {
        const patternPreviewPosition = { x: 165, y: margin };
        const patternPreviewRect = {
            position: patternPreviewPosition,
            size: { w: config.screen.size.w - (patternPreviewPosition.x + margin * 2), h: 83 },
        };
        setColor(color.foreground);
        drawFilledRect(patternPreviewRect);
        patternPreviewNode(patternPreviewRect, stepCount, steps, playing);
        // if (activeStep !== undefined) {
        //     renderActiveStep(patternPreviewPosition, patternPreviewSize, stepCount, activeStep);
        // }
    }

    renderMessage();
}

export function sequencerEditMidiHandler(midiMsg: MidiMsg) {
    return encodersHandler(encoders, midiMsg);
}
