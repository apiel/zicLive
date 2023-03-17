import { clear, drawFilledRect, Events, Rect, setColor } from 'zic_node_ui';
import { config } from '../config';
import { eventSelector, getEditMode } from '../events';
import { cleanSelectableItems, forceSelectedItem } from '../selector';
import { color, unit } from '../style';
import { sequencesGridNode } from '../nodes/sequencesGrid.node';
import { getSequence, sequences, setSelectedSequenceId, toggleSequence } from '../sequence';
import { View } from '../def';
import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';
import { getTrackStyle } from '../track';
import { sequenceNode } from '../nodes/sequence.node';
import { drawSelectableRect } from '../draw/drawSelectable';
import { sendMidiMessage } from 'zic_node';
import { midiOutController } from '../midi';

let scrollY = 0;
const col = config.sequence.col;

const { margin } = unit;
const height = config.screen.size.h / config.sequence.row;

const sequenceWidth = config.screen.size.w / config.sequence.col - margin;

const sequenceRect = (id: number, scrollY = 0): Rect => {
    const size = { w: sequenceWidth, h: height - margin };
    return {
        position: {
            x: margin + (margin + size.w) * (id % col),
            y: scrollY + margin + (margin + size.h) * Math.floor(id / col),
        },
        size,
    };
};

// TODO #49 optimize rendering and draw only visible items
export async function sequencerView({ controllerRendering }: RenderOptions = {}) {
    if (controllerRendering) {
        sequencerController();
    }
    cleanSelectableItems();
    clear(color.background);

    for (let i = 0; i < 40; i++) {
        const rect = sequenceRect(i, scrollY);
        if (sequences[i]) {
            const { id, trackId, nextSequenceId, ...seq } = sequences[i];
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

// prettier-ignore
const padSeq = [
    0x20, 0x21, 0x22, 0x23, 0x24, 0x25,
    0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d,
    0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05,
];

// prettier-ignore
const padBanks = [
    0x26, 0x27,
    0x1e, 0x1f, 
    0x16, 0x17,
    0x0e, 0x0f,
    0x06, 0x07,
];

function sequencerController() {
    if (midiOutController) {
        for (let i = 0; i < 40; i++) {
            if (sequences[i]) {
                const { trackId } = sequences[i];
                const { padColor } = getTrackStyle(trackId);
                sendMidiMessage(midiOutController.port, [0x96, padSeq[i], padColor]);
            } else {
                sendMidiMessage(midiOutController.port, [0x96, padSeq[i], 0]);
            }
        }
    }
}

export async function sequencerEventHandler(events: Events) {
    const editMode = await getEditMode(events);
    if (editMode.refreshScreen) {
        await sequencerView();
        return true;
    }
    const item = eventSelector(events);
    if (item) {
        if (item.position.y > config.screen.size.h - 50) {
            scrollY -= 50;
        } else if (item.position.y < 40 && scrollY < 0) {
            scrollY += 50;
        }
        item.options?.onSelected?.();
        await sequencerView();
        return true;
    }
    return false;
}
