import { clear, Events } from 'zic_node_ui';
import { config } from '../config';
import { eventSelector, getEditMode } from '../events';
import { cleanSelectableItems, forceSelectedItem } from '../selector';
import { color } from '../style';
import { sequencesGridNode } from '../nodes/sequencesGrid.node';
import { getSequence, setSelectedSequenceId, toggleSequence } from '../sequence';
import { View } from '../def';
import { RenderOptions } from '../view';
import { renderMessage } from '../draw/drawMessage';

let scrollY = 0;
const col = config.sequence.col;

// TODO #49 optimize rendering and draw only visible items
export async function sequencerView(options: RenderOptions = {}) {
    cleanSelectableItems();
    clear(color.background);
    sequencesGridNode(col, scrollY, (id) => ({
        edit: () => toggleSequence(getSequence(id)),
        onSelected: () => {
            setSelectedSequenceId(id);
            forceSelectedItem(View.SequencerEdit, id);
        },
    }));

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
