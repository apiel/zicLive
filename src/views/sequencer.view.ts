import { clear, Events } from 'zic_node_ui';
import { config } from '../config';
import { eventSelector, getEditMode } from '../events';
import { cleanSelectableItems } from '../selector';
import { color } from '../style';
import { sequencerNode } from '../nodes/sequencer.node';
import { setSelectedSequenceId } from '../sequence';

let scrollY = 0;
const col = 4;

export async function sequencerView() {
    cleanSelectableItems();
    clear(color.background);
    sequencerNode(
        col,
        scrollY,
        (id) => console.log(`Seq clicked: ${id}`),
        setSelectedSequenceId,
    );
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
