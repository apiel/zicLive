import { clear, drawFilledRect, Rect, setColor } from 'zic_node_ui';
import { config } from '../config';
import { color, unit } from '../style';
import { sequences } from '../sequence';
import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { getTrackStyle } from '../track';
import { sequenceNode } from '../nodes/sequence.node';
import { MidiMsg } from '../midi';
import { sequencerController, sequenceToggleMidiHandler } from './controller/sequencerController';

const { margin } = unit;
const height = config.screen.size.h / config.sequence.row;

const sequenceWidth = config.screen.size.w / config.sequence.col - margin;

const sequenceRect = (id: number): Rect => {
    const size = { w: sequenceWidth, h: height - margin };
    return {
        position: {
            x: margin + (margin + size.w) * (id % config.sequence.col),
            y: margin + (margin + size.h) * Math.floor(id / config.sequence.col),
        },
        size,
    };
};

export async function sequencerView({ controllerRendering }: RenderOptions = {}) {
    if (controllerRendering) {
        sequencerController();
    }
    clear(color.background);

    for (let i = 0; i < 30; i++) {
        const rect = sequenceRect(i);
        const { id, trackId, nextSequenceId, ...seq } = sequences[i];
        if (trackId !== undefined) {
            let next;
            if (nextSequenceId !== undefined) {
                next = nextSequenceId.toString();
            }
            sequenceNode(id, rect, {
                ...seq,
                trackColor: getTrackStyle(trackId).color,
                next,
            });
        } else {
            setColor(color.foreground);
            drawFilledRect(rect);
        }
    }

    renderMessage();
}

export function sequencerMidiHandler(midiMsg: MidiMsg) {
    return sequenceToggleMidiHandler(midiMsg);
}
