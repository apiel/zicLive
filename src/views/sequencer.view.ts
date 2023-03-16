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
export async function sequencerView(options: RenderOptions = {}) {
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
