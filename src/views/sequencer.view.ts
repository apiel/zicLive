import { clear, Events } from 'zic_node_ui';
import { config } from '../config';
import { eventSelector, getEditMode } from '../events';
import { cleanSelectableItems, forceSelectedItem } from '../selector';
import { color } from '../style';
import { sequencerNode } from '../nodes/sequencer.node';
import { getSequence, setSelectedSequenceId, toggleSequence } from '../sequence';
import { View } from '../def';

let scrollY = 0;
const col = config.sequence.col;

export async function sequencerView() {
    cleanSelectableItems();
    clear(color.background);
    sequencerNode(
        col,
        scrollY,
        (id) => toggleSequence(getSequence(id)),
        (id) => {
            setSelectedSequenceId(id);
            forceSelectedItem(View.SequencerEdit, id);
        },
    );
}

export async function sequencerEventHandler(events: Events) {
    const editMode = await getEditMode(events);
    if (editMode.refreshScreen) {
        await sequencerView();
        return true;
    }
    const item = eventSelector(events, 50);
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
