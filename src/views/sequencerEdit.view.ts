import { clear, drawFilledRect, drawRect, drawText, Rect, setColor } from 'zic_node_ui';
import { config } from '../config';
import { color, font } from '../style';
import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { MidiMsg, MIDI_TYPE } from '../midi';
import { sequencerController } from './controller/sequencerController';
import { sequences, getSelectedSequenceId } from '../sequence';
import { getTrackStyle } from '../track';

const margin = 1;
const sequenceRect = (id: number): Rect => {
    const size = { w: 25, h: 15 - margin };
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
            setColor(color.white);
            drawRect(rect);
        }
    }
    // if (sequences[i]) {
    //     const { trackId } = sequences[i];
    // }

    renderMessage();
}

export async function sequencerEditMidiHandler({ isController, message: [type, padKey] }: MidiMsg) {
    if (isController) {
        if (type === MIDI_TYPE.KEY_RELEASED) {
            // const seqId = padSeq.indexOf(padKey);
            // if (seqId !== -1) {
            //     const sequence = getSequence(seqId);
            //     if (sequence) {
            //         toggleSequence(sequence);
            //         await sequencerView({ controllerRendering: true });
            //         return true;
            //     }
            // }
        }
    }
    return false;
}
