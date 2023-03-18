import { clear, drawFilledRect, drawRect, drawText, Rect, setColor } from 'zic_node_ui';
import { config } from '../config';
import { color, font, unit } from '../style';
import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { MidiMsg, MIDI_TYPE } from '../midi';
import { sequencerController } from './controller/sequencerController';
import { sequences, getSelectedSequenceId, getSelectedSequence, setSelectedSequenceId } from '../sequence';
import { getTrack, getTrackStyle } from '../track';
import { patternPreviewNode } from '../nodes/patternPreview.node';
import { encoderNode } from '../nodes/encoder.node';
import { akaiApcKey25 } from '../midi/akaiApcKey25';
import { minmax } from '../util';
import { forceSelectedItem } from '../selector';
import { View } from '../def';

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

export async function sequencerEditView({ controllerRendering }: RenderOptions = {}) {
    if (controllerRendering) {
        sequencerController();
    }
    clear(color.background);

    for (let i = 0; i < 30; i++) {
        const rect = sequenceRect(i);
        const { trackId } = sequences[i];
        setColor(trackId !== undefined ? getTrackStyle(trackId).color : color.foreground);
        drawFilledRect(rect);
        drawText(
            `${i + 1}`.padStart(3, '0'),
            { x: rect.position.x + 4, y: rect.position.y + 1 },
            { color: color.foreground3, size: 10, font: font.bold },
        );
        if (getSelectedSequenceId() === i) {
            // TODO find better selection color
            setColor(color.white);
            drawRect(rect);
        }
    }

    const { id, trackId, stepCount, steps, playing } = getSelectedSequence();
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

    const seqColor = trackId !== undefined ? getTrackStyle(trackId).color : undefined;
    const trackName = trackId !== undefined ? getTrack(trackId).name : 'No track';
    encoderNode([
        { title: 'Sequence', value: `#${`${id + 1}`.padStart(3, '0')}`, valueColor: seqColor },
        null,
        null,
        null,
        { title: 'Track', value: trackName },
        null,
        null,
        null,
    ]);

    renderMessage();
}

let lastTimeK1 = 0;
export async function sequencerEditMidiHandler({ isController, message: [type, padKey, value] }: MidiMsg) {
    if (isController) {
        if (type === MIDI_TYPE.CC) {
            switch (padKey) {
                case akaiApcKey25.knob.k1: {
                    // TODO optimize rendering!!! with debounce everything that is not realted to seq id
                    if (Date.now() > lastTimeK1 + 250) {
                        lastTimeK1 = Date.now();
                        const direction = value < 63 ? 1 : -1;
                        const id = minmax(getSelectedSequenceId() + direction, 0, sequences.length - 1);
                        setSelectedSequenceId(id);
                        forceSelectedItem(View.Sequencer, id);
                    }
                    return true;
                }
            }
        }
    }
    return false;
}
